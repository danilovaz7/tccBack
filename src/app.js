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

// Configuração do CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Definindo as rotas
app.use(router);

// Criando um servidor HTTP para o Socket.IO
const server = http.createServer(app);

// Inicializando o Socket.IO e vinculando ao servidor HTTP
const io = new Server(server, {
  cors: corsOptions
});
// Variáveis para gerenciar o quiz
let perguntasAtuais = [];
let indicePergunta = 0;
let timerRodada = null;
let questionStartTime = 0;
let fastestTime = Infinity;
let currentWinner = null;

// Estruturas para armazenar dados por sala
const scores = {};
const answeredUsers = {};
const readyUsersPerRoom = {};
const usersInRoom = {};

io.on("connection", (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  socket.on("joinRoom", ({ roomId, userId, userName }) => {
    // Validação dos dados recebidos
    if (!roomId || !userId || !userName) {
      console.log(`Dados inválidos para joinRoom: ${roomId}, ${userId}, ${userName}`);
      return;
    }
    socket.join(roomId);
    if (!usersInRoom[roomId]) {
      usersInRoom[roomId] = [];
    }
    // Se o usuário não existir na lista, adicione-o
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
    setTimeout(() => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const totalPlayers = room ? room.size : 0;
      console.log(`Sala ${roomId}: ${readyUsersPerRoom[roomId].size} prontos de ${totalPlayers}`);
      if (readyUsersPerRoom[roomId].size === totalPlayers && totalPlayers > 0) {
        io.to(roomId).emit("iniciarQuiz");
        readyUsersPerRoom[roomId].clear();
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
    scores[roomId] = {};
    answeredUsers[roomId] = new Set();
    startQuestion(roomId);
    io.to(roomId).emit("receberPerguntas", perguntas);
  });

  socket.on("responderPergunta", ({ roomId, userId, respostaId, userName }) => {
    if (answeredUsers[roomId] && answeredUsers[roomId].has(userId)) return;
    if (!perguntasAtuais[indicePergunta]) return;
    const perguntaObj = perguntasAtuais[indicePergunta];
    
    if (!answeredUsers[roomId]) {
      answeredUsers[roomId] = new Set();
    }
    answeredUsers[roomId].add(userId);
    
    const responseTime = Date.now() - questionStartTime;
    const alternativaRespondida = perguntaObj.alternativas.find(a => a.id === respostaId);
    if (alternativaRespondida && alternativaRespondida.correta === true) {
      // Apenas o primeiro a acertar (com fastestTime ainda igual a Infinity) ganha o ponto
      if (fastestTime === Infinity) {
        fastestTime = responseTime;
        currentWinner = userName;
        scores[roomId][userId] = (scores[roomId][userId] || 0) + 1;
        console.log(`Usuário ${userName} acertou! Pontos: ${scores[roomId][userId]}`);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`Cliente ${socket.id} desconectado`);
    // Opcional: remova o usuário da lista de usersInRoom para cada sala
    for (const roomId in usersInRoom) {
      const index = usersInRoom[roomId].findIndex(u => u.socketId === socket.id);
      if (index !== -1) {
        usersInRoom[roomId].splice(index, 1);
        io.to(roomId).emit("playersUpdated", usersInRoom[roomId]);
      }
    }
  });
});

function startQuestion(roomId) {
  const pergunta = perguntasAtuais[indicePergunta];
  if (!pergunta) return;
  
  questionStartTime = Date.now();
  fastestTime = Infinity;
  currentWinner = null;
  answeredUsers[roomId] = new Set();
  
  io.to(roomId).emit("startQuestion", { pergunta, tempo: 10 });
  
  timerRodada = setTimeout(() => {
    const scoreboard = (usersInRoom[roomId] || []).map(user => ({
      userId: user.userId,
      userName: user.userName,
      pontos: scores[roomId][user.userId] || 0
    }));
    
    io.to(roomId).emit("resultadoPergunta", { 
      vencedor: currentWinner, 
      respostaCorreta: pergunta.respostaCorreta, 
      scoreboard 
    });
    
    setTimeout(() => {
      indicePergunta++;
      if (indicePergunta < perguntasAtuais.length) {
        startQuestion(roomId);
      } else {
        io.to(roomId).emit("quizFinalizado", { message: "Quiz finalizado!", scoreboard });
      }
    }, 5000);
  }, 10000);
}

server.listen(process.env.APP_PORT, () => {
  console.log(`O servidor está escutando na porta ${process.env.APP_PORT}`);
});

export { io };