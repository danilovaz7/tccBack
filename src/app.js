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

// Evento de conexão do Socket.io
io.on("connection", (socket) => {
    console.log(`Novo cliente conectado: ${socket.id}`);

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);
        socket.to(roomId).emit("userJoined", { message: `Um novo usuário entrou na sala ${roomId}` });
    });

    socket.on("message", ({ roomId, message }) => {
        console.log(`Mensagem recebida na sala ${roomId}: ${message}`);
        io.to(roomId).emit("newMessage", { message, sender: socket.id });
    });

    socket.on("disconnect", () => {
        console.log(`Cliente ${socket.id} desconectado`);
    });
});

// Iniciando o servidor
server.listen(process.env.APP_PORT, () => {
    console.log(`O servidor está escutando na porta ${process.env.APP_PORT}`);
});

// Exportando o 'io' para uso em outros módulos
export { io };
