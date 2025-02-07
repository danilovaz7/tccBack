import Usuario from "../models/Usuario.js"
import EloMateria from "../models/EloMateria.js"
import Materia from "../models/Materia.js"
import EstatisticaGeral from "../models/EstatisticaGeral.js";
import Avatar from "../models/Avatar.js";

async function createUser(req, res) {
    const { nome, email, senha,matricula, experiencia, nivel,id_avatar, tipo_usuario_id, id_escola,id_turma,genero } = req.body;
    const usuario = Usuario.build({ nome, email, senha, matricula, experiencia,id_turma,id_avatar, id_escola, nivel, tipo_usuario_id,genero });

    try {
        await usuario.validate();
    } catch (error) {
        return res.status(400).json({ error: 'Informações de usuário inválidas: ' + error.message }); 
    }

    try {
        await usuario.save();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar usuário: ' + error.message });
    }

    const estatisticasUsuario = EstatisticaGeral.build({usuario_id: usuario.id, total_perguntas: 0, total_perguntas_acertadas: 0, total_disputas: 0, total_disputas_ganhas: 0 }) 

    try {
        await estatisticasUsuario.validate();
    } catch (error) {
        return res.status(400).json({ error: 'Estatistiacs de usuário inválidas: ' + error.message }); 
    }

    try {
        await estatisticasUsuario.save();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar estatisticasUsuario de usuário: ' + error.message });
    }
    
    try {
        const materias = await Materia.findAll();
        const userId = usuario.id;

        await Promise.all(materias.map(async (materia) => {
            const materiaId = materia.id;
            const materiaElo = EloMateria.build({ usuario_id:userId, materia_id:materiaId, elo_id: 1, subelo_id: 1, perguntas_acertadas: 0 });

            try {
                await materiaElo.validate();
            } catch (error) {
                throw new Error('Informações de materiaElo inválidas: ' + error.message);
            }

            try {
                await materiaElo.save();
            } catch (error) {
                throw new Error('Erro ao criar materiaElo: ' + error.message);
            }
        }));

        res.status(201).json(usuario.toJSON());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function getUsers(req, res) {
    const usuarios = await Usuario.findAll({
        where: {tipo_usuario_id: 2},
        order: [['nivel', 'DESC']],
        include: 'avatar'
    })

    if (usuarios) {
        res.json(usuarios)
    } else {
        res.status(500).json({ error: 'Erro ao buscar usuários' })
    }
}

async function getUserById(req, res) {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id, { include: ['tipo_usuario','avatar'] })

    if (usuario) {
        res.json(usuario.toJSON())
    } else {
        res.status(404).json({ error: 'Usuário não encontrado' })
    }
}

async function updateUser(req, res) {
    const { id } = req.params
    const { nome, email, senha, id_avatar,matricula, experiencia, nivel, tipo_usuario_id } = req.body

    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    if (nome) usuario.nome = nome
    if (email) usuario.email = email
    if (senha) usuario.senha = senha
    if (matricula) usuario.matricula = matricula
    if (experiencia) usuario.experiencia = experiencia
    if (nivel) usuario.nivel = nivel
    if (tipo_usuario_id) usuario.tipo_usuario_id = tipo_usuario_id
    if (id_avatar) usuario.id_avatar = id_avatar

    try {
        await usuario.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações de usuário inválidas: ' + error.message })
    }

    try {
        await usuario.save()
        res.json(usuario.toJSON())
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário: ' + error.message })
    }
}

async function deleteUser(req, res) {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    try {
        await usuario.destroy()
        res.json({ message: 'Usuário excluído com sucesso' })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir usuário: ' + error.message })
    }
}

export default {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}