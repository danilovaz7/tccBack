
import Turma from "../models/Turma.js"

async function getTurmas(req, res) {
    const turmas = await Turma.findAll({})

    if (turmas) {
        res.json(turmas)
    } else {
        res.status(500).json({ error: 'Erro ao buscar turmas' })
    }
}



export default {
    getTurmas,
    
}