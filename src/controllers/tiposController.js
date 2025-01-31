import TipoUsuario from "../models/TipoUsuario.js"

async function createType(req, res) {
    const { nome } = req.body

    const tipoUsuario = TipoUsuario.build({ nome })

    try {
        await tipoUsuario.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações de tipo inválidas: ' + error.message })
    }

    try {
        await tipoUsuario.save()
        res.status(201).json(tipoUsuario.toJSON())
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar tipo: ' + error.message })
    }
}

async function getTypes(req, res) {
    const tipos = await TipoUsuario.findAll()

    if (tipos) {
        res.json(tipos)
    } else {
        res.status(500).json({ error: 'Erro ao buscar tipos' })
    }
}

async function getTypeById(req, res) {
    const { id } = req.params

    const tipo = await TipoUsuario.findByPk({id})

    if (tipo) {
        res.json(tipo.toJSON())
    } else {
        res.status(404).json({ error: 'tipo não encontrado' })
    }
}

async function updateType(req, res) {
    const { id } = req.params
    const { nome } = req.body

    const tipoUsuario = await TipoUsuario.findByPk(id)

    if (!tipoUsuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    if (nome) tipoUsuario.nome = nome

    try {
        await tipoUsuario.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações de tipoUsuario inválidas: ' + error.message })
    }

    try {
        await tipoUsuario.save()
        res.json(tipoUsuario.toJSON())
    } catch(error) {
        res.status(500).json({ error: 'Erro ao atualizar tipoUsuario: ' + error.message })
    }
}

async function deleteType(req, res) {
    const { id } = req.params
    
    const tipo = await TipoUsuario.findByPk(id)

    if (!tipo) {
        return res.status(404).json({ error: 'tipo não encontrado' })
    }

    try {
        await tipo.destroy()
        res.json({ message: 'tipo excluído com sucesso' })
    } catch(error) {
        res.status(500).json({ error: 'Erro ao excluir tipo: ' + error.message })
    }
}

export default {
    createType,
    getTypes,
    getTypeById,
    updateType,
    deleteType
}