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

async function getEloMaterias(req, res) {
    const { materia_id } = req.params

    const eloMaterias = await EloMateria.findAll({
        where: {materia_id:materia_id},
        include: ['elo', 'materia'], 
    })

    console.log('eloMaterias', eloMaterias)

    if (eloMaterias) {
        res.json(eloMaterias)
    } else {
        res.status(500).json({ error: 'Erro ao buscar materia' })
    }
}

async function getPerguntasMateria(req, res) {
    const { nmMateria, eloid } = req.params

    let elo_id = parseInt(eloid)

    const materia = await Materia.findOne({
        where: {nome:nmMateria},
        include: ['elo', 'materia'],
    })

    let perguntasMateria = await Pergunta.findAll({
        where: {
            materia_id: materia.id,
            elo_id: elo_id
        },
        limit: 6
    });

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
        order: [['materia_id', 'ASC']] 
      });
      

    if (eloMaterias) {
        res.json(eloMaterias)
    } else {
        res.status(500).json({ error: 'Erro ao buscar eloMaterias' })
    }
}

async function getEloMateriasByUserAndMateria(req, res) {
    const { id, nmMateria  } = req.params
    const materia = await Materia.findOne({where: {nome:nmMateria}})

   const eloMateriaUnic = await EloMateria.findOne({where: {usuario_id: id,  materia_id: materia.id }})
      

    if (eloMateriaUnic) {
        res.json(eloMateriaUnic.toJSON())
    } else {
        res.status(500).json({ error: 'Erro ao buscar eloMateriaUnic' })
    }
}
async function updateEloMateria(req, res) {
    const { id, nmMateria } = req.params;
    let { elo_id, subelo_id, respostas_corretas_elo, respostas_corretas_total } = req.body;

    const materia = await Materia.findOne({ where: { nome: nmMateria } });
    if (!materia) {
        return res.status(404).json({ error: 'Matéria não encontrada' });
    }

    const eloMateriaUnic = await EloMateria.findOne({ where: { usuario_id: id, materia_id: materia.id } });
    if (!eloMateriaUnic) {
        return res.status(404).json({ error: 'eloMateriaUnic não encontrado' });
    }

    if (respostas_corretas_elo >= 30 && elo_id != 6) {
        respostas_corretas_elo = 0;
        elo_id = elo_id + 1
        subelo_id = 1
    }

    if (elo_id !== undefined) eloMateriaUnic.elo_id = elo_id;
    if (subelo_id !== undefined) eloMateriaUnic.subelo_id = subelo_id;
    if (respostas_corretas_elo !== undefined) eloMateriaUnic.respostas_corretas_elo = respostas_corretas_elo;
    if (respostas_corretas_total !== undefined) eloMateriaUnic.respostas_corretas_total = respostas_corretas_total;

    try {
        await eloMateriaUnic.validate();
    } catch (error) {
        return res.status(400).json({ error: 'Informações de eloMateriaUnic inválidas: ' + error.message });
    }

    try {
        await eloMateriaUnic.save();
        res.json(eloMateriaUnic.toJSON());
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar eloMateriaUnic: ' + error.message });
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
    getEloMaterias,
    getEloMateriasByUser,
    getPerguntasMateria,
    getAternativasPerguntaMateria,
    getEloMateriasByUserAndMateria,
    updateEloMateria
}