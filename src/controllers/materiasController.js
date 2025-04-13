import Materia from "../models/Materia.js"
import EloMateria from "../models/EloMateria.js"
import Alternativa from  "../models/Alternativa.js"
import Pergunta from  "../models/Pergunta.js"
import { Op } from "sequelize";


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

    if (eloMaterias) {
        res.json(eloMaterias)
    } else {
        res.status(500).json({ error: 'Erro ao buscar materia' })
    }
}

async function createPergunta(req, res) {
    const { materia_id, elo_id, turma_id, escola_id, pergunta, alternativas, alternativaCorreta, criador_id } = req.body;
    const perguntaNova = Pergunta.build({ materia_id, elo_id, turma_id, escola_id, pergunta,criador_id });

    try {
        await perguntaNova.validate();
    } catch (error) {
        return res.status(400).json({ error: 'Informações de pergunta inválidas: ' + error.message });
    }

    try {
        await perguntaNova.save();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao criar pergunta: ' + error.message });
    }

    const alternativasCriadas = [];

   
    for (let i = 0; i < 4; i++) {
        let alternativaNova;

        
        if (i === alternativaCorreta) {
            alternativaNova = Alternativa.build({ pergunta_id: perguntaNova.id, alternativa: alternativas[i], correta: true });
        } else {
            alternativaNova = Alternativa.build({ pergunta_id: perguntaNova.id, alternativa: alternativas[i], correta: false });
        }

      
        try {
            await alternativaNova.validate();
            await alternativaNova.save();
            alternativasCriadas.push(alternativaNova.toJSON());
        } catch (error) {
            return res.status(400).json({ error: `Erro ao salvar alternativa ${i + 1}: ` + error.message });
        }
    }


    return res.status(201).json({
        pergunta: perguntaNova.toJSON(),
        alternativas: alternativasCriadas
    });
}


async function getPerguntasQuizMateria(req, res) {
    const { nmMateria, eloid,turmaId } = req.params
    console.log('deu bo aqui')
    let elo_id = parseInt(eloid)
    let turmaid = parseInt(turmaId)

    const materia = await Materia.findOne({
        where: {nome:nmMateria},
    })

    let perguntasMateria = await Pergunta.findAll({
        where: {
            materia_id: materia.id,
            elo_id: elo_id,
            turma_id: turmaid
        },
        limit: 6
    });

    if (perguntasMateria) {
        res.json(perguntasMateria)
    } else {
        res.status(404).json({ error: 'perguntasMateria não encontrado' })
    }
}

async function getPerguntasAllMateria(req, res) {
    const id_turma = req.params.id_turma ? parseInt(req.params.id_turma) : null;
    const materia_id = req.params.materia_id ? parseInt(req.params.materia_id) : null;
    const escola_id = req.params.escola_id ? parseInt(req.params.escola_id) : null;

    const materia = await Materia.findOne({
        where: { id: materia_id },

    });
   
    if (!materia) {
        return res.status(404).json({ error: 'Matéria não encontrada' });
    }

    let perguntasAllMateria = await Pergunta.findAll({
        where: {
            materia_id: materia.id,
            turma_id: id_turma,
            [Op.or]: [
                { escola_id: escola_id },
                { escola_id: 1 }
            ]
        },
        include: ['alternativas'], 
        order: [['elo_id', 'ASC']], 
    });

    if (perguntasAllMateria) {
        res.json(perguntasAllMateria);
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
    getPerguntasQuizMateria,
    getAternativasPerguntaMateria,
    getEloMateriasByUserAndMateria,
    updateEloMateria,
    getPerguntasAllMateria,
    createPergunta
}