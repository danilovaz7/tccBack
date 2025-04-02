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

/* Variáveis globais para gerenciar o quiz */
let perguntasAtuais = []; // Perguntas em ordem (definidas pelo host)
let indicePergunta = 0;   // Pergunta atual
let timerRodada = null;   // Timer para a pergunta atual
let questionStartTime = 0; // Momento em que a pergunta foi emitida
let fastestTime = Infinity; // Menor tempo de resposta (para respostas corretas)
let currentWinner = null;   // Nome do primeiro a acertar

// Estruturas para armazenar dados por sala
const scores = {};           // scores[roomId] = { userId: pontos, ... }
const answeredUsers = {};    // answeredUsers[roomId] = Set de userId que já responderam
const readyUsersPerRoom = {}; // readyUsersPerRoom[roomId] = Set de userId prontos
const usersInRoom = {};      // usersInRoom[roomId] = [ { userId, userName }, ... ]

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
    // Após 500ms, verifica se todos estão prontos
    setTimeout(() => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const totalPlayers = room ? room.size : 0;
      console.log(`Sala ${roomId}: ${readyUsersPerRoom[roomId].size} prontos de ${totalPlayers}`);
      if (readyUsersPerRoom[roomId].size === totalPlayers && totalPlayers > 0) {
        // Countdown de 3 segundos
        let countdown = 3;
        const countdownInterval = setInterval(() => {
          io.to(roomId).emit("countdown", { countdown });
          countdown--;
          if (countdown < 0) {
            clearInterval(countdownInterval);
            io.to(roomId).emit("iniciarQuiz");
            // Inicia a primeira pergunta após o countdown
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
    perguntasAtuais = perguntas;
    indicePergunta = 0;
    fastestTime = Infinity;
    currentWinner = null;
    // Reinicia placar e respostas para a sala
    scores[roomId] = {};
    answeredUsers[roomId] = new Set();
    startQuestion(roomId);
    io.to(roomId).emit("receberPerguntas", perguntas);
  });

  socket.on("responderPergunta", ({ roomId, userId, respostaId, userName }) => {
    // Cada usuário só pode responder uma vez por pergunta
    if (answeredUsers[roomId] && answeredUsers[roomId].has(userId)) return;
    if (!perguntasAtuais[indicePergunta]) return;
    const perguntaObj = perguntasAtuais[indicePergunta];
    if (!answeredUsers[roomId]) answeredUsers[roomId] = new Set();
    answeredUsers[roomId].add(userId);
    
    const responseTime = Date.now() - questionStartTime;
    const alternativaRespondida = perguntaObj.alternativas.find(a => a.id === respostaId);
    
    // Se a resposta estiver correta, somente o primeiro acerto pontua
    if (alternativaRespondida && alternativaRespondida.correta === true) {
      if (fastestTime === Infinity) { // Nenhum acerto anterior nesta pergunta
        fastestTime = responseTime;
        currentWinner = userName;
        scores[roomId][userId] = 1;
        console.log(`Usuário ${userName} acertou primeiro! Pontos: ${scores[roomId][userId]}`);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`Cliente ${socket.id} desconectado`);
    // Remoção opcional dos usuários da lista de usersInRoom
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
  const pergunta = perguntasAtuais[indicePergunta];
  if (!pergunta) return;
  
  // Registra o início da pergunta
  questionStartTime = Date.now();
  fastestTime = Infinity;
  currentWinner = null;
  answeredUsers[roomId] = new Set();
  
  // Emite a pergunta com tempo de 10 segundos
  io.to(roomId).emit("startQuestion", { pergunta, tempo: 10 });
  
  // Define o timer fixo de 10 segundos
  timerRodada = setTimeout(() => {
    // Prepara o scoreboard para a rodada
    const scoreboard = Object.keys(scores[roomId] || {}).map(userId => {
      const user = usersInRoom[roomId]?.find(u => u.userId === parseInt(userId));
      return {
        userId: parseInt(userId),
        userName: user ? user.userName : "Desconhecido",
        pontos: scores[roomId][userId]
      };
    });
    
    // Emite o resultado da pergunta com o placar atualizado
    io.to(roomId).emit("resultadoPergunta", { 
      vencedor: currentWinner, 
      respostaCorreta: pergunta.respostaCorreta, 
      scoreboard 
    });
    
    // Aguarda 5 segundos para exibir o resultado antes de avançar
    setTimeout(() => {
      indicePergunta++;
      if (indicePergunta < perguntasAtuais.length) {
        startQuestion(roomId);
      } else {
        // Quiz finalizado
        const finalScoreboard = Object.keys(scores[roomId] || {}).map(userId => {
          const user = usersInRoom[roomId]?.find(u => u.userId === parseInt(userId));
          return {
            userId: parseInt(userId),
            userName: user ? user.userName : "Desconhecido",
            pontos: scores[roomId][userId]
          };
        });
        finalScoreboard.sort((a, b) => b.pontos - a.pontos);
        const vencedorFinal = finalScoreboard[0]?.userName || "Nenhum";
        io.to(roomId).emit("quizFinalizado", { scoreboard: finalScoreboard, vencedorFinal });
      }
    }, 5000);
  }, 10000);
}

server.listen(process.env.APP_PORT, () => {
  console.log(`O servidor está escutando na porta ${process.env.APP_PORT}`);
});

export { io };
