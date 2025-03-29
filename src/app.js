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

// Criando um servidor HTTP para o Socket.io
const server = http.createServer(app);

// Inicializando o Socket.io e vinculando ao servidor HTTP
const io = new Server(server, {
  cors: corsOptions
});

// Objeto para armazenar os usuários prontos por sala
const readyUsersPerRoom = {};

io.on("connection", (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  socket.on("joinRoom", ({ roomId, userName }) => {
    socket.join(roomId);
    console.log(`Usuário ${userName} entrou na sala ${roomId}`);
    socket.to(roomId).emit("userJoined", { message: `Um novo usuário entrou na sala ${roomId}` });
  });

  socket.on("pronto", ({ roomId, userId }) => {
    if (!readyUsersPerRoom[roomId]) {
      readyUsersPerRoom[roomId] = new Set();
    }
    readyUsersPerRoom[roomId].add(userId);
    console.log(`Usuário ${userId} pronto na sala ${roomId}`);

    // Envia a lista atualizada de prontos para todos na sala
    io.to(roomId).emit("updateReady", { readyUserIds: Array.from(readyUsersPerRoom[roomId]) });

    // Aguarda um pequeno delay para garantir que os sockets já tenham entrado na sala
    setTimeout(() => {
      console.log("Salas registradas:", Array.from(io.sockets.adapter.rooms.entries()));

      // Obter o número total de conexões na sala usando o adapter do Socket.io
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
    io.to(roomId).emit("receberPerguntas", perguntas); // Emite para todos na sala
  });
  


  socket.on("disconnect", () => {
    console.log(`Cliente ${socket.id} desconectado`);
  });
});

server.listen(process.env.APP_PORT, () => {
  console.log(`O servidor está escutando na porta ${process.env.APP_PORT}`);
});

export { io };
