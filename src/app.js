import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import './models/associations.js';
import router from './routes/router.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Definindo as rotas
app.use(router);

// Iniciando o servidor
app.listen(process.env.APP_PORT, () => {
    console.log(`O servidor está escutando na porta ${process.env.APP_PORT}`);
});
