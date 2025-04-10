import Usuario from "../models/Usuario.js"
import EloMateria from "../models/EloMateria.js"
import Materia from "../models/Materia.js"
import TipoUsuario from "../models/TipoUsuario.js";
import { Sequelize } from 'sequelize';

import generator from "generate-password";

export function generateRandomPassword() {
    return generator.generate({
        length: 8,
        numbers: true,
        uppercase: true,
        lowercase: true,
        symbols: false
    });
}

async function createUser(req, res) {
    const { nome, email, matricula, experiencia, nivel, id_avatar, tipo_usuario_id, id_materia,id_escola, id_turma, genero } = req.body;
    const senha = generateRandomPassword();

    const usuario = Usuario.build({ nome, email, senha, matricula, id_materia,experiencia, id_turma, id_avatar, id_escola, nivel, tipo_usuario_id, genero });
    console.log(usuario)
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

    
    try {
        const materias = await Materia.findAll();
        const userId = usuario.id;

        await Promise.all(materias.map(async (materia) => {
            const materiaId = materia.id;
            const materiaElo = EloMateria.build({ usuario_id: userId, materia_id: materiaId, elo_id: 1, subelo_id: 1, respostas_corretas_elo: 0, respostas_corretas_total: 0 });

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
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const orderField = req.query.order ? req.query.order : null;
    let orderDirection = req.query.orderDirection ? req.query.orderDirection : 'DESC';
    const id_turma = req.query.id_turma ? parseInt(req.query.id_turma) : null;
    const materia_id = req.query.materiaId ? parseInt(req.query.materiaId) : null; 
    const id_escola = req.query.id_escola ? parseInt(req.query.id_escola) : null;
  
    if (orderField === 'nome') {
      orderDirection = 'ASC';
    }
  
    const queryOptions = {
      where: { tipo_usuario_id: 2 },
      include: [
        'avatar',
        {
          model: EloMateria,
          as: 'elos',
          include: ['elo'],
          required: false, 
          where: materia_id ? { materia_id: materia_id } : undefined,
        }
      ],
    };
  
    if (id_turma) {
      queryOptions.where.id_turma = id_turma;
    }
    if (id_escola) {
        queryOptions.where.id_escola = id_escola;
      }
    if (limit !== null) {
      queryOptions.limit = limit;
    }
  
    if (orderField === 'elo') {
        if (!materia_id) {
          return res.status(400).json({
            error: "Para ordenar por elo, o parâmetro materia_id deve ser fornecido."
          });
        } else {
          queryOptions.order = [
            [Sequelize.col('elos.elo_id'), orderDirection],
            [Sequelize.col('elos.subelo_id'), 'DESC']
          ];
        }
      } else {
        queryOptions.order = [[orderField, orderDirection]];
      }
  
    try {
      const usuarios = await Usuario.findAll(queryOptions);
      res.json(Array.isArray(usuarios) ? usuarios : []);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários', message: error.message });
    }
  }


async function getUserById(req, res) {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id, { include: ['tipo_usuario', 'avatar'] })

    if (usuario) {
        res.json(usuario.toJSON())
    } else {
        res.status(404).json({ error: 'Usuário não encontrado' })
    }
}

async function getTipoUsuarios(req, res) {
    const tipoUsuarios = await TipoUsuario.findAll()

    if (tipoUsuarios) {
        res.json(tipoUsuarios)
    } else {
        res.status(500).json({ error: 'Erro ao buscar tipoUsuarios' })
    }
}

async function updateUser(req, res) {
    const { id } = req.params
    const { nome, email, senha, id_avatar, matricula, experiencia, nivel, tipo_usuario_id , ic_ativo} = req.body

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
    if (ic_ativo) usuario.ic_ativo = ic_ativo

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
    deleteUser,
    getTipoUsuarios
}