import Materia from "../models/Materia.js"
import EloMateria from "../models/EloMateria.js"
import Alternativa from  "../models/Alternativa.js"
import Pergunta from  "../models/Pergunta.js"

async function createMateria(req, res) {
    const { nome,icone } = req.body

    const materia = Materia.build({ nome,icone })

    try {
        await materia.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações de materia inválidas: ' + error.message })
    }

    try {
        await materia.save()
        res.status(201).json(materia.toJSON())
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar materia: ' + error.message })
    }
}

async function getMaterias(req, res) {
    const materia = await Materia.findAll()

    if (materia) {
        res.json(materia)
    } else {
        res.status(500).json({ error: 'Erro ao buscar materia' })
    }
}

async function getMateriaById(req, res) {
    const { id } = req.params

    const materia = await Materia.findByPk(id)

    if (materia) {
        res.json(materia.toJSON())
    } else {
        res.status(404).json({ error: 'materia não encontrado' })
    }
}

async function getPerguntasMateria(req, res) {
    const { nmMateria } = req.params
    const materia = await Materia.findOne({where: {nome:nmMateria}})

    const perguntasMateria = await Pergunta.findAll({where: {materia_id: materia.id}})

    if (perguntasMateria) {
        res.json(perguntasMateria)
    } else {
        res.status(404).json({ error: 'perguntasMateria não encontrado' })
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


async function getEloMateriasByUser(req, res) {
    const { id } = req.params

    const eloMaterias = await EloMateria.findAll({
        where: { usuario_id: id },
        include: ['elo', 'materia'],
        order: [['materia_id', 'ASC']] // Ordena pelo campo materia_id em ordem crescente
      });
      

    if (eloMaterias) {
        res.json(eloMaterias)
    } else {
        res.status(500).json({ error: 'Erro ao buscar eloMaterias' })
    }
}



async function updateMateria(req, res) {
    const { id } = req.params
    const { nome, icone } = req.body

    const materia = await Materia.findByPk(id)

    if (!materia) {
        return res.status(404).json({ error: 'materia não encontrado' })
    }

    if (nome) materia.nome = nome
    if (icone) materia.icone = icone

    try {
        await materia.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações de materia inválidas: ' + error.message })
    }

    try {
        await materia.save()
        res.json(materia.toJSON())
    } catch(error) {
        res.status(500).json({ error: 'Erro ao atualizar materia: ' + error.message })
    }
}

async function deleteMateria(req, res) {
    const { id } = req.params
    
    const materia = await Materia.findByPk(id)

    if (!materia) {
        return res.status(404).json({ error: 'materia não encontrado' })
    }

    try {
        await materia.destroy()
        res.json({ message: 'materia excluído com sucesso' })
    } catch(error) {
        res.status(500).json({ error: 'Erro ao excluir materia: ' + error.message })
    }
}

export default {
    createMateria,
    getMaterias,
    getMateriaById,
    updateMateria,
    deleteMateria,
    getEloMateriasByUser,
    getPerguntasMateria,
    getAternativasPerguntaMateria
}