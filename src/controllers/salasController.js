import Sala from "../models/Sala.js";
import SalaAluno from "../models/SalaAluno.js";
import Alternativa from  "../models/Alternativa.js"
import Pergunta from  "../models/Pergunta.js"
import Materia from "../models/Materia.js"

import { io } from '../app.js';

export async function createSala(req, res) {
    const { codigo, id_host } = req.body;

    try {
        const sala = Sala.build({ codigo, host_id: id_host });
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

        const salaAluno = SalaAluno.build({ sala_id: sala.id, usuario_id: id_aluno });
        await salaAluno.validate();
        await salaAluno.save();

        const salaAlunos = await SalaAluno.findAll({
            where: { sala_id: sala.id },
            include: ['usuario']
        });

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

async function getPerguntasQuizMateria(req, res) {
    const { eloId, turmaId, idMateria1, idMateria2, idMateria3 } = req.params;
    console.log(req.params)
    console.log('entrei dei bom')

    const eloid = parseInt(eloId);
    const turmaid = parseInt(turmaId);
    const id1 = parseInt(idMateria1);
    const id2 = parseInt(idMateria2);
    const id3 = parseInt(idMateria3);

    const materia1 = await Materia.findOne({ where: { id: id1 } });
    const materia2 = await Materia.findOne({ where: { id: id2 } });
    const materia3 = await Materia.findOne({ where: { id: id3 } });

    console.log(materia1)
    console.log(materia2)
    console.log(materia3)

    if (!materia1 || !materia2 || !materia3) {
        return res.status(404).json({ error: 'Uma ou mais matérias não foram encontradas' });
    }

    const perguntasMateria1 = await Pergunta.findAll({
        where: {
            materia_id: materia1.id,
            elo_id: eloid,
            turma_id: turmaid
        },
        limit: 4    
    });
    const perguntasMateria2 = await Pergunta.findAll({
        where: {
            materia_id: materia2.id,
            elo_id: eloid,
            turma_id: turmaid
        },
        limit: 4
    });
    const perguntasMateria3 = await Pergunta.findAll({
        where: {
            materia_id: materia3.id,
            elo_id: eloid,
            turma_id: turmaid
        },
        limit: 4
    });

    const perguntasTotais = [
        ...perguntasMateria1,
        ...perguntasMateria2,
        ...perguntasMateria3
    ];

    if (perguntasTotais && perguntasTotais.length > 0) {
        res.json(perguntasTotais);
    } else {
        res.status(404).json({ error: 'Perguntas não encontradas' });
    }
}


async function getAternativasPerguntaMateria(req, res) {
    const { id } = req.params

    const alternativas = await Alternativa.findAll({where: {pergunta_id:id}})

    if (alternativas) {
        res.json(alternativas)
    } else {
        res.status(404).json({ error: 'perguntasMateria não encontrado' })
    }
}

export default {
    createSala,
    getAlunoSala,
    getSalaById,
    entrarSala,
    getPerguntasQuizMateria
};
