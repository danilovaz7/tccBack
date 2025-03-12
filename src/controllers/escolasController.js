
import Escolas from "../models/Escola.js"

async function getEscolas(req, res) {
    const escolas = await Escolas.findAll({})

    if (escolas) {
        res.json(escolas)
    } else {
        res.status(500).json({ error: 'Erro ao buscar escolas' })
    }
}



export default {
    getEscolas,
    
}