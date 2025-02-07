import { UUID } from "sequelize"
import EstatisticaGeral from "../models/EstatisticaGeral.js"
import Usuario from "../models/Usuario.js"


async function getEstatisticasByUser(req, res) {
    const { id } = req.params

    const estatisticas = await EstatisticaGeral.findOne({
        where: { usuario_id: id }
    })

    if (estatisticas) {
        console.log(estatisticas.toJSON())
        res.json(estatisticas.toJSON())
    } else {
        res.status(404).json({ error: 'Estatísticas do usuário não encontradas' })
    }
}

async function updateEstatisticasByUser(req, res) {
    const { id } = req.params
    const { total_perguntas, total_perguntas_acertadas,total_disputas,total_disputas_ganhas } = req.body

    const estatisticas = await EstatisticaGeral.findByPk(id)

    if (!estatisticas) {
        return res.status(404).json({ error: 'estatisticas de usuario não encontrado' })
    }

    if (total_perguntas) estatisticas.total_perguntas = total_perguntas
    if (total_perguntas_acertadas) estatisticas.total_perguntas_acertadas = total_perguntas_acertadas
    if (total_disputas) estatisticas.total_disputas = total_disputas
    if (total_disputas_ganhas) estatisticas.total_disputas_ganhas = total_disputas_ganhas

    try {
        await estatisticas.validate()
    } catch (error) {
        return res.status(400).json({ error: 'estatisticas de usuario inválidas: ' + error.message })
    }

    try {
        await estatisticas.save()
        res.json(estatisticas.toJSON())
    } catch(error) {
        res.status(500).json({ error: 'Erro ao atualizar estatisticas: ' + error.message })
    }
}

export default {
    getEstatisticasByUser,
    updateEstatisticasByUser,
    

}