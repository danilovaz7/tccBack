import Sala from "../models/Sala.js";
import SalaAluno from "../models/SalaAluno.js";
import Alternativa from  "../models/Alternativa.js"
import Pergunta from  "../models/Pergunta.js"
import Materia from "../models/Materia.js"
import SalaPergunta from "../models/SalaPergunta.js"   
import SalaAlunoResposta from "../models/SalaAlunoResposta.js"

import { Sequelize } from 'sequelize';
import { io } from '../app.js';

export async function createSala(req, res) {
    const { codigo, id_host, tipo } = req.body;
   

    try {
        const sala = Sala.build({ codigo, host_id: id_host, tipo });
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
        console.log(error)
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

    if (sala.status === 'em andamento') {
      return res.status(404).json({ error: 'Sala em andamento' });
    }

    if (sala.status === 'encerrada') {
      return res.status(404).json({ error: 'Sala encerrada' });
    }

    const totalAlunos = await SalaAluno.count({ where: { sala_id: sala.id } });
    if (totalAlunos >= 5) {
      return res.status(400).json({ error: 'A sala já atingiu o limite de 5 alunos.' });
    }
   
    let salaAluno = await SalaAluno.findOne({
      where: { sala_id: sala.id, usuario_id: id_aluno }
    });

    if (!salaAluno) {
      salaAluno = SalaAluno.build({ sala_id: sala.id, usuario_id: id_aluno });
      await salaAluno.validate();
      await salaAluno.save();
    }

    const salaAlunos = await SalaAluno.findAll({
      where: { sala_id: sala.id },
      include: ['usuario']
    });

    io.to(sala.id).emit("atualizar_sala", {
      alunosAtualizados: salaAlunos
    });

    return res.status(200).json({
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



async function getPerguntasQuizMaterias(req, res) {
    const { eloId, turmaId, idMateria1, idMateria2, idMateria3, salaId } = req.params;
    
    console.log(eloId, turmaId, idMateria1, idMateria2, idMateria3, salaId)

    const sala_id = parseInt(salaId);
    const eloid = parseInt(eloId);
    const turmaid = parseInt(turmaId);
    const id1 = parseInt(idMateria1);
    const id2 = parseInt(idMateria2);
    const id3 = parseInt(idMateria3);

    console.log('typeof(sala_id)',typeof(sala_id))
    console.log('typeof(eloid)',typeof(eloid))
    console.log('typeof(turmaid)',typeof(turmaid))
    console.log('typeof(id1)',typeof(id1))
    console.log('typeof(id2)',typeof(id2))
    console.log('typeof(id3)',typeof(id3))

    console.log(eloid,turmaid,id1,id2,id3,sala_id)
  
    // Verifica se os IDs são únicos
    if (new Set([id1, id2, id3]).size < 3) {
      return res.status(400).json({ error: 'As matérias selecionadas devem ser diferentes.' });
    }
  
    const materia1 = await Materia.findOne({ where: { id: id1 } });
    const materia2 = await Materia.findOne({ where: { id: id2 } });
    const materia3 = await Materia.findOne({ where: { id: id3 } });
  
    if (!materia1 || !materia2 || !materia3) {
      return res.status(404).json({ error: 'Uma ou mais matérias não foram encontradas' });
    }
  
    const randomOrder = Sequelize.literal('rand()'); 
    const perguntasMateria1 = await Pergunta.findAll({
      where: {
        materia_id: materia1.id,
        elo_id: eloid,
        turma_id: turmaid
      },
      include: ['alternativas'],
      order: randomOrder,
      limit: 4    
    });
  
    const perguntasMateria2 = await Pergunta.findAll({
      where: {
        materia_id: materia2.id,
        elo_id: eloid,
        turma_id: turmaid
      },
      include: ['alternativas'],
      order: randomOrder,
      limit: 4
    });
  
    const perguntasMateria3 = await Pergunta.findAll({
      where: {
        materia_id: materia3.id,
        elo_id: eloid,
        turma_id: turmaid
      },
      include: ['alternativas'],
      order: randomOrder,
      limit: 4
    });
  
    const perguntasTotais = [
      ...perguntasMateria1,
      ...perguntasMateria2,
      ...perguntasMateria3
    ];
  
    if (perguntasTotais && perguntasTotais.length > 0) {
      try {
        for (const pergunta of perguntasTotais) {
          const salaPergunta = SalaPergunta.build({
            sala_id: sala_id,
            pergunta_id: pergunta.id
          });
  
          await salaPergunta.validate();
          await salaPergunta.save();
        }
        return res.json(perguntasTotais);
      } catch (error) {
        console.error('Erro ao salvar sala_perguntas:', error);
        return res.status(500).json({ error: 'Erro ao inserir relação sala-pergunta' });
      }
    } else {
      return res.status(404).json({ error: 'Perguntas não encontradas' });
    }
  }


async function getPerguntasQuizMateria(req, res) {
    const { eloId, turmaId, nmMateria,salaId } = req.params;

    const sala_id = parseInt(salaId)
    const eloid = parseInt(eloId);
    const turmaid = parseInt(turmaId);
    console.log('sala_id',sala_id)
    console.log('eloId',eloId)
    console.log('turmaId',turmaId)
    console.log('nmMateria',nmMateria)
   

    const materia1 = await Materia.findOne({ where: { nome: nmMateria } });
    console.log('materia1 id',materia1.id)

    if (!materia1) {
        return res.status(404).json({ error: 'Uma ou mais matérias não foram encontradas' });
    }
    const perguntasMateria1 = await Pergunta.findAll({
        where: {
            materia_id: materia1.id,
            elo_id: eloid,
            turma_id: turmaid
        },
        include: ['alternativas'], 
        limit: 6    
    });
    
    console.log('perguntasMateria1',perguntasMateria1)

    const perguntasTotais = [
        ...perguntasMateria1,
    ];

    if (perguntasTotais && perguntasTotais.length > 0) {
        try {
           
            for (const pergunta of perguntasTotais) {
                const salaPergunta = SalaPergunta.build({
                    sala_id: sala_id,         
                    pergunta_id: pergunta.id  
                });
            
                await salaPergunta.validate();
                await salaPergunta.save();
            }
        
            return res.json(perguntasTotais);
        } catch (error) {
            console.error('Erro ao salvar sala_perguntas:', error);
            return res.status(500).json({ error: 'Erro ao inserir relação sala-pergunta' });
        }
    } else {
        return res.status(404).json({ error: 'Perguntas não encontradas' });
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

async function criarSalaAlunoResposta(req, res) {
    const { sala_id, usuario_id, pergunta_id, resposta_id } = req.body;

    if (!sala_id || !usuario_id || !pergunta_id || !resposta_id) {
      return res.status(400).json({ error: 'É necessário enviar sala_id, usuario_id, pergunta_id e resposta_id' });
    }
  
    try {
      const salaAluno = await SalaAluno.findOne({
        where: {
          sala_id,
          usuario_id
        }
      });
  
      if (!salaAluno) {
        return res.status(404).json({ error: 'Registro de SalaAluno não encontrado para os dados informados.' });
      }
  
    
      const salaPergunta = await SalaPergunta.findOne({
        where: {
          sala_id,
          pergunta_id
        }
      });
  
      if (!salaPergunta) {
        return res.status(404).json({ error: 'Registro de SalaPergunta não encontrado para os dados informados.' });
      }
  

      const salaAlunoResposta = SalaAlunoResposta.build({
        sala_aluno_id: salaAluno.id,
        sala_pergunta_id: salaPergunta.id,
        resposta_id 
      });
  
      await salaAlunoResposta.validate();
      await salaAlunoResposta.save();
  
      return res.status(201).json({ message: 'Resposta registrada com sucesso.', data: salaAlunoResposta });
    } catch (error) {
      console.error('Erro ao criar sala_aluno_resposta:', error);
      return res.status(500).json({ error: 'Erro ao registrar a resposta.' });
    }
  }

async function updateSala(req, res) {
    const { codigo } = req.params
    const {status,vencedor_id,updatedAt } = req.body

    const sala = await Sala.findOne({where:{codigo}})

    if (!sala) {
        return res.status(404).json({ error: 'materia não encontrado' })
    }

    if (status) sala.status = status
    if (vencedor_id) sala.vencedor_id = vencedor_id
    if (updatedAt) sala.updatedAt = updatedAt

    try {
        await sala.validate()
    } catch (error) {
        return res.status(400).json({ error: 'Informações de sala inválidas: ' + error.message })
    }   

    try {
        await sala.save()
        res.json(sala.toJSON())
    } catch(error) {
        res.status(500).json({ error: 'Erro ao atualizar sala: ' + error.message })
    }
}


export default {
    createSala,
    getAlunoSala,
    getSalaById,
    entrarSala,
    getPerguntasQuizMaterias,
    getPerguntasQuizMateria,
    getAternativasPerguntaMateria,
    criarSalaAlunoResposta,
    updateSala
};
