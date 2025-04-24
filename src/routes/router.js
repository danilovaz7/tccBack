import { Router } from 'express'
import jwt from 'jsonwebtoken'

import express from 'express';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js';
import transporter from '../services/email.js';

import { authenticate } from '../services/authService.js'
import usuariosController from '../controllers/usuariosController.js'
import tiposController from '../controllers/tiposController.js'
import materiasController from '../controllers/materiasController.js'
import loginController from '../controllers/loginController.js'
import estatisticasController from '../controllers/estatisticasController.js'
import avataresController from '../controllers/avataresController.js'
import escolasController from '../controllers/escolasController.js'
import nivelController from '../controllers/nivelController.js';
import turmasController from '../controllers/turmasController.js';
import salasController from '../controllers/salasController.js';
import dashboardController from '../controllers/dashboardController.js';

const router = Router()

router.post('/usuarios', usuariosController.createUser)
router.get('/usuarios',authenticate, usuariosController.getUsers)
router.get('/usuarios/:id', authenticate,usuariosController.getUserById)
router.put('/usuarios/:id', authenticate, usuariosController.updateUser)
router.delete('/usuarios/:id', authenticate,usuariosController.deleteUser)
router.get('/estatisticas/:id', authenticate,estatisticasController.getEstatisticasByUser)

router.get('/cargos', authenticate,usuariosController.getTipoUsuarios)

router.put('/usuarios/:id/atualizaexperiencia', authenticate, nivelController.adicionarXp)

router.post('/tipos', authenticate,tiposController.createType)
router.get('/tipos', authenticate,tiposController.getTypes)
router.get('/tipos/:id', authenticate,tiposController.getTypeById)
router.put('/tipos/:id', authenticate, tiposController.updateType)
router.delete('/tipos/:id', authenticate,tiposController.deleteType)

router.post('/materias', authenticate,materiasController.createMateria)
router.get('/materias', authenticate,materiasController.getMaterias)
router.get('/materias/:id', authenticate,materiasController.getMateriaById)
router.put('/materias/:id', authenticate, materiasController.updateMateria)
router.delete('/materias/:id', authenticate,materiasController.deleteMateria)
router.get('/eloMaterias/:id', authenticate,materiasController.getEloMateriasByUser)
router.get('/eloMaterias/materias/:materia_id', authenticate,materiasController.getEloMaterias)
router.get('/eloMaterias/:id/materia/:nmMateria', authenticate,materiasController.getEloMateriasByUserAndMateria)
router.put('/eloMaterias/:id/materia/:nmMateria', authenticate, materiasController.updateEloMateria)

router.post('/criar-pergunta', authenticate,materiasController.createPergunta)

router.get('/materias/:materia_id/perguntas/escola/:escola_id/turma/:id_turma', authenticate, materiasController.getPerguntasAllMateria);

router.get('/materias/:nmMateria/perguntas/:eloid/:turmaId', authenticate, materiasController.getPerguntasQuizMateria);
router.get('/materias/perguntas/:id/alternativas', authenticate,materiasController.getAternativasPerguntaMateria)

router.get('/avatares', authenticate,avataresController.getAvatares)

router.post('/criar-escola', authenticate,escolasController.createEscola)
router.get('/escolas', authenticate,escolasController.getEscolas)

router.get('/turmas', authenticate,turmasController.getTurmas)

router.get('/escola/:id/dashboard', authenticate, dashboardController.getDashboardStats);

router.post('/sala', authenticate,salasController.createSala)
router.get('/sala/:codigo', authenticate,salasController.getSalaById)
router.get('/sala-alunos/:id', authenticate,salasController.getAlunoSala)
router.post('/entrar/sala', authenticate,salasController.entrarSala)
router.get('/sala/:salaId/perguntas/:eloId/:turmaId/:idMateria1/:idMateria2/:idMateria3', authenticate,salasController.getPerguntasQuizMaterias)
router.get('/sala/:salaId/perguntas/:eloId/:turmaId/:nmMateria', authenticate,salasController.getPerguntasQuizMateria)
router.put('/sala/:codigo', authenticate, salasController.updateSala)
router.post('/sala/resposta-aluno', authenticate, salasController.criarSalaAlunoResposta);

router.post('/login',loginController.login)
router.get('/eu', pegarUsuarioDoToken)

export default router


function checaToken(req, res, next) {
    const headers = req.headers;

    const authorizationHeader = headers.authorization;
    if (!authorizationHeader) {
        return res.status(403).json({ message: "Forbidden" })
    }
    const [, token] = authorizationHeader.split(' ');
    if (!token) {
        return res.status(403).json({ message: "Forbidden" })
    }

    next();
}

function pegarUsuarioDoToken(req, res) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "Token ausente ou inválido" });
        }

        const token = authorizationHeader.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "Token inválido" });
        }

        const usuarioDoToken = jwt.verify(token, process.env.SECRET_KEY); // Verifica validade
        res.json(usuarioDoToken);
    } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado", error: error.message });
    }
}

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const usuario = await Usuario.findOne({ where: { email } });
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      const token = jwt.sign({ userId: usuario.id },  process.env.SECRET_KEY, { expiresIn: '1h' });
  
      const resetLink = `http://localhost:5173/redefinir-senha/${token}`;
      const mailOptions = {
        from: 'equipeplay2learn@gmail.com',
        to: usuario.email,
        subject: 'Recuperação de Senha',
        text: `Clique no link para redefinir sua senha: ${resetLink}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Link de recuperação de senha enviado para seu e-mail.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao enviar e-mail.' });
    }
  });
  
  router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {

      const decoded = jwt.verify(token, process.env.SECRET_KEY); 
      const usuario = await Usuario.findByPk(decoded.userId);
  
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      // Criptografa a nova senha
      usuario.senha = password;
      await usuario.save();
  
      res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Token inválido ou expirado.' });
    }
  });
  