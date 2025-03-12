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

const router = Router()

router.post('/usuarios',usuariosController.createUser)
router.get('/usuarios',usuariosController.getUsers)
router.get('/usuarios/:id',usuariosController.getUserById)
router.put('/usuarios/:id', usuariosController.updateUser)
router.delete('/usuarios/:id',usuariosController.deleteUser)
router.get('/estatisticas/:id',estatisticasController.getEstatisticasByUser)
router.put('/estatisticas/:id',estatisticasController.updateEstatisticasByUser)

router.put('/usuarios/:id/atualizaexperiencia', nivelController.adicionarXp)

router.post('/tipos',tiposController.createType)
router.get('/tipos',tiposController.getTypes)
router.get('/tipos/:id',tiposController.getTypeById)
router.put('/tipos/:id', tiposController.updateType)
router.delete('/tipos/:id',tiposController.deleteType)

router.post('/materias',materiasController.createMateria)
router.get('/materias',materiasController.getMaterias)
router.get('/materias/:id',materiasController.getMateriaById)
router.put('/materias/:id', materiasController.updateMateria)
router.delete('/materias/:id',materiasController.deleteMateria)
router.get('/eloMaterias/:id',materiasController.getEloMateriasByUser)
router.get('/eloMaterias/materias/:materia_id',materiasController.getEloMaterias)
router.get('/eloMaterias/:id/materia/:nmMateria',materiasController.getEloMateriasByUserAndMateria)
router.put('/eloMaterias/:id/materia/:nmMateria', materiasController.updateEloMateria)

router.get('/materias/:nmMateria/perguntas/:eloid',materiasController.getPerguntasMateria)
router.get('/materias/perguntas/:id/alternativas',materiasController.getAternativasPerguntaMateria)

router.get('/avatares',avataresController.getAvatares)

router.get('/escolas',escolasController.getEscolas)

router.get('/turmas',turmasController.getTurmas)


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
  
      // Cria um token de recuperação de senha
      const token = jwt.sign({ userId: usuario.id },  process.env.SECRET_KEY, { expiresIn: '1h' });
  
      // Envia o link de recuperação de senha para o e-mail
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
  