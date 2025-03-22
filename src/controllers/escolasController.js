
import Escola from "../models/Escola.js"

async function createEscola(req, res) {
    console.log('entrei no criar escola')
    const { nome } = req.body
    console.log('nome', nome)

    const escola = Escola.build({ nome })
    console.log(escola)
    try {
        await escola.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações de escola inválidas: ' + error.message })
    }

    try {
        await escola.save()
        res.status(201).json(escola.toJSON())
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar escola: ' + error.message })
    }
}

async function getEscolas(req, res) {
    const escolas = await Escola.findAll({})

    if (escolas) {
        res.json(escolas)
    } else {
        res.status(500).json({ error: 'Erro ao buscar escolas' })
    }
}



export default {
    createEscola,
    getEscolas  
}