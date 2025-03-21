import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import './models/associations.js';
import router from './routes/router.js';

dotenv.config();

const app = express();

// Configuração do CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
}));

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Definindo as rotas
app.use(router);

// Iniciando o servidor
app.listen(process.env.APP_PORT, () => {
    console.log(`O servidor está escutando na porta ${process.env.APP_PORT}`);
});
