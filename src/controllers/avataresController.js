
import Avatar from "../models/Avatar.js"


async function getAvatares(req, res) {
    const avatares = await Avatar.findAll({})

    if (avatares) {
        res.json(avatares)
    } else {
        res.status(500).json({ error: 'Erro ao buscar avatares' })
    }
}

async function getAvatarById(req, res) {
    const { id } = req.params

    const avatar = await Avatar.findOne({
        where: {id}
    })

    if (avatar) {
        res.json(avatar.toJSON())
    } else {
        res.status(404).json({ error: 'avatar não encontradas' })
    }
}

async function getAvatarByName(req, res) {
    const { nome } = req.params
    
    const estatisticas = await Avatar.findOne({
        where: { nome }
    })

    if (estatisticas) {
        res.json(estatisticas.toJSON())
    } else {
        res.status(404).json({ error: 'estatisticas não encontradas' })
    }
}

export default {
    getAvatares,
    getAvatarById,
    getAvatarByName
}