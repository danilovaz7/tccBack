import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from "socket.io";
import http from "http";

import './models/associations.js';
import router from './routes/router.js';

dotenv.config();

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(router);

const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

// Estado do quiz por sala
const roomQuiz = {}; // roomQuiz[roomId] = { perguntas, indice, questionStartTime, fastestTime, currentWinner, scores, answeredUsers, timerInterval, timerTimeout }

const readyUsersPerRoom = {}; // readyUsersPerRoom[roomId] = Set de userId prontos
const usersInRoom = {};       // usersInRoom[roomId] = [ { userId, userName }, ... ]

io.on("connection", (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  socket.on("joinRoom", ({ roomId, userId, userName }) => {
    if (!roomId || !userId || !userName) return;
    socket.join(roomId);
    if (!usersInRoom[roomId]) {
      usersInRoom[roomId] = [];
    }
    if (!usersInRoom[roomId].find(u => u.userId === userId)) {
      usersInRoom[roomId].push({ userId, userName });
    }
    console.log(`Usuário ${userName} (ID: ${userId}) entrou na sala ${roomId}`);
    io.to(roomId).emit("playersUpdated", usersInRoom[roomId]);
    socket.to(roomId).emit("userJoined", { message: `Um novo usuário entrou na sala ${roomId}` });
  });

  socket.on("pronto", ({ roomId, userId }) => {
    if (!readyUsersPerRoom[roomId]) {
      readyUsersPerRoom[roomId] = new Set();
    }
    readyUsersPerRoom[roomId].add(userId);
    console.log(`Usuário ${userId} pronto na sala ${roomId}`);
    io.to(roomId).emit("updateReady", { readyUserIds: Array.from(readyUsersPerRoom[roomId]) });
    // Verifica se todos estão prontos
    setTimeout(() => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const totalPlayers = room ? room.size : 0;
      if (readyUsersPerRoom[roomId].size === totalPlayers && totalPlayers > 0) {
        // Countdown de 3 segundos
        let countdown = 3;
        const countdownInterval = setInterval(() => {
          io.to(roomId).emit("countdown", { countdown });
          countdown--;
          if (countdown < 0) {
            clearInterval(countdownInterval);
            io.to(roomId).emit("iniciarQuiz");
            // Inicia o quiz (primeira pergunta)
            startQuestion(roomId);
            readyUsersPerRoom[roomId].clear();
          }
        }, 1000);
      }
    }, 500);
  });

  socket.on("message", ({ roomId, message, userName }) => {
    console.log(`Mensagem recebida na sala ${roomId}: ${message}`);
    io.to(roomId).emit("newMessage", { message, sender: userName });
  });

  socket.on("materiasSelecionadas", ({ roomId, selectedMaterias }) => {
    console.log(`Matérias selecionadas na sala ${roomId}:`, selectedMaterias);
    socket.to(roomId).emit("materiasSelecionadas", selectedMaterias);
  });

  socket.on("enviarPerguntas", ({ roomId, perguntas }) => {
    console.log(`Perguntas sendo enviadas para a sala ${roomId}:`, perguntas);
    // Inicializa o estado do quiz para a sala
    roomQuiz[roomId] = {
      perguntas: perguntas,
      indice: 0,
      questionStartTime: 0,
      fastestTime: Infinity,
      currentWinner: null,
      scores: {},      // scores[usuarioId] = pontos
      answeredUsers: new Set(),
      timerInterval: null,
      timerTimeout: null,
    };
    io.to(roomId).emit("receberPerguntas", perguntas);
  });

  socket.on("responderPergunta", ({ roomId, userId, respostaId, userName }) => {
    const quiz = roomQuiz[roomId];
    if (!quiz) return;
    if (quiz.answeredUsers.has(userId)) return; // já respondeu
    const perguntaObj = quiz.perguntas[quiz.indice];
    if (!perguntaObj) return;
    quiz.answeredUsers.add(userId);
    const responseTime = Date.now() - quiz.questionStartTime;
    const alternativa = perguntaObj.alternativas.find(a => a.id === respostaId);
    if (alternativa && alternativa.correta === true) {
      if (quiz.fastestTime === Infinity) {
        quiz.fastestTime = responseTime;
        quiz.currentWinner = userName;
        quiz.scores[userId] = (quiz.scores[userId] || 0) + 1;
        console.log(`Usuário ${userName} acertou primeiro! Pontos: ${quiz.scores[userId]}`);
      }
    }
  });

// Evento para o host iniciar a próxima pergunta
socket.on("nextQuestion", ({ roomId }) => {
  const quiz = roomQuiz[roomId];
  if (!quiz) return;

  // Avança para a próxima pergunta
  quiz.indice++;

  // Verifica se ainda há perguntas restantes
  if (quiz.indice < quiz.perguntas.length) {
    startQuestion(roomId); // Reinicia o ciclo da próxima pergunta
  } else {
    // Todas as perguntas foram respondidas, finalizar o quiz
    const finalScoreboard = Object.keys(quiz.scores).map(userId => {
      const user = usersInRoom[roomId]?.find(u => u.userId === parseInt(userId));
      return {
        userId: parseInt(userId),
        userName: user ? user.userName : "Desconhecido",
        pontos: quiz.scores[userId],
      };
    });

    finalScoreboard.sort((a, b) => b.pontos - a.pontos);
    const vencedorFinal = finalScoreboard[0]?.userName || "Nenhum";

    io.to(roomId).emit("quizFinalizado", { scoreboard: finalScoreboard, vencedorFinal });
  }
});


  socket.on("disconnect", () => {
    console.log(`Cliente ${socket.id} desconectado`);
    for (const roomId in usersInRoom) {
      const index = usersInRoom[roomId].findIndex(u => u.socketId === socket.id);
      if (index !== -1) {
        usersInRoom[roomId].splice(index, 1);
        io.to(roomId).emit("playersUpdated", usersInRoom[roomId]);
      }
    }
  });
});

// Função para iniciar a pergunta atual com timer fixo de 10 segundos
function startQuestion(roomId) {
  const quiz = roomQuiz[roomId];
  if (!quiz) return;

  const pergunta = quiz.perguntas[quiz.indice];
  if (!pergunta) return;

  // Reinicia os dados da pergunta
  quiz.questionStartTime = Date.now();
  quiz.fastestTime = Infinity;
  quiz.currentWinner = null;
  quiz.answeredUsers = new Set();

  // Inicializa o tempo restante
  let remainingTime = 10;

  // Envia a pergunta inicial junto com o tempo
  io.to(roomId).emit("startQuestion", { pergunta, tempo: remainingTime });

  // Atualização do timer para decremento correto
  quiz.timerInterval = setInterval(() => {
    remainingTime--; // Decrementa o tempo
    if (remainingTime >= 0) {
      // Emite o tempo atualizado para o front-end
      io.to(roomId).emit("updateTimer", { remainingTime });
    } else {
      // Interrompe o timer ao atingir 0
      clearInterval(quiz.timerInterval);
    }
  }, 1000);

  // Após o término do timer (10 segundos), emite o resultado da pergunta
  quiz.timerTimeout = setTimeout(() => {
    const scoreboard = Object.keys(quiz.scores).map(userId => {
      const user = usersInRoom[roomId]?.find(u => u.userId === parseInt(userId));
      return {
        userId: parseInt(userId),
        userName: user ? user.userName : "Desconhecido",
        pontos: quiz.scores[userId] || 0,
      };
    });

    io.to(roomId).emit("resultadoPergunta", {
      vencedor: quiz.currentWinner || 'ninguém',
      respostaCorreta: pergunta.respostaCorreta,
      scoreboard,
    });
  }, 10000);
}



server.listen(process.env.APP_PORT, () => {
  console.log(`O servidor está escutando na porta ${process.env.APP_PORT}`);
});

export { io };
