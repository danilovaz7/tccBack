import { Router } from 'express'
import jwt from 'jsonwebtoken'

import usuariosController from '../controllers/usuariosController.js'
import tiposController from '../controllers/tiposController.js'
import materiasController from '../controllers/materiasController.js'
import loginController from '../controllers/loginController.js'


const router = Router()

router.post('/usuarios',usuariosController.createUser)
router.get('/usuarios',usuariosController.getUsers)
router.get('/usuarios/:id',usuariosController.getUserById)
router.put('/usuarios/:id', usuariosController.updateUser)
router.delete('/usuarios/:id',usuariosController.deleteUser)

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
