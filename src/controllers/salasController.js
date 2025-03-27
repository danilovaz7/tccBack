import Sala from "../models/Sala.js";
import SalaAluno from "../models/SalaAluno.js";
import { io } from '../app.js'; 

export async function createSala(req, res) {
    const { codigo, id_host } = req.body;

    try {
        const sala = Sala.build({ codigo });
        await sala.validate();
        await sala.save();

        const salaAluno = SalaAluno.build({ sala_id: sala.id, usuario_id: id_host });
        await salaAluno.validate();
        await salaAluno.save();

        return res.status(201).json({
            sala: sala.toJSON(),
            salaAluno: salaAluno.toJSON()
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar sala e/ou salaAluno: ' + error.message });
    }
}

export async function entrarSala(req, res) {
    const { codigo, id_aluno } = req.body;

    try {
        const sala = await Sala.findOne({ where: { codigo } });
        if (!sala) {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }

        // Adiciona o aluno à sala
        const salaAluno = SalaAluno.build({ sala_id: sala.id, usuario_id: id_aluno });
        await salaAluno.validate();
        await salaAluno.save();

        // Busca a lista de alunos atualizada
        const salaAlunos = await SalaAluno.findAll({
            where: { sala_id: sala.id },
            include: ['usuario']
        });

        // Emite para todos os sockets conectados à sala a lista de alunos atualizada
        io.to(sala.id).emit("atualizar_sala", {
            alunosAtualizados: salaAlunos
        });

        return res.status(201).json({
            salaAluno: salaAluno.toJSON()
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao adicionar aluno à sala: ' + error.message });
    }
}

export async function getAlunoSala(req, res) {
    const { id } = req.params;
    try {
        const salaAlunos = await SalaAluno.findAll({
            where: { sala_id: id },
            include: ['usuario']
        });
        if (salaAlunos) {
            return res.json(salaAlunos);
        } else {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar salaAlunos: ' + error.message });
    }
}

export async function getSalaById(req, res) {
    const { codigo } = req.params;
    try {
        const sala = await Sala.findOne({ where: { codigo } });
        if (sala) {
            return res.json(sala.toJSON());
        } else {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar sala: ' + error.message });
    }
}

export default {
    createSala,
    getAlunoSala,
    getSalaById,
    entrarSala
};
