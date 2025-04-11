import { Op } from 'sequelize';
import sequelize from '../db/database.js';
import Usuario from '../models/Usuario.js';
import Materia from "../models/Materia.js";
import Pergunta from "../models/Pergunta.js";
import SalaPergunta from "../models/SalaPergunta.js";
import SalaAlunoResposta from "../models/SalaAlunoResposta.js";
import Alternativa from "../models/alternativa.js";
import Sala from "../models/Sala.js";
import SalaAluno from "../models/SalaAluno.js";

// Define o intervalo de datas
function getDateRange(month) {
  let startDate, endDate;
  if (month) {
    startDate = new Date(`${month}-01`);
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    startDate = new Date('1970-01-01');
    endDate = new Date();
  }
  return { startDate, endDate };
}

async function getDashboardStats(req, res) {
  const { id } = req.params;  // id do usuário, via rota, para filtrar pela escola dele
  const { month } = req.query;
  const { startDate, endDate } = getDateRange(month);
  console.log('Dashboard stats from:', startDate, 'to:', endDate);

  try {
    // 1. Buscar o usuário e obter seu id_escola
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const id_escola = usuario.id_escola;
    console.log(`Calculando estatísticas para a escola: ${id_escola}`);

    // 2. Matéria com mais respostas INCORRETAS
    const materiaErrada = await Materia.findOne({
      attributes: [
        'id',
        'nome',
        [sequelize.fn('COUNT', sequelize.col('perguntas.sala_perguntas.aluno_respostas.id')), 'wrongCount']
      ],
      include: [{
        model: Pergunta,
        as: 'perguntas',
        required: true,
        where: { escola_id: id_escola },
        attributes: [],
        include: [{
          model: SalaPergunta,
          as: 'sala_perguntas',
          required: true,
          attributes: [],
          include: [{
            model: SalaAlunoResposta,
            as: 'aluno_respostas',
            required: true,
            attributes: [],
            where: {
              createdAt: { [Op.between]: [startDate, endDate] }
            },
            include: [{
              model: Alternativa,
              as: 'alternativa',
              required: true,
              attributes: [],
              where: { correta: false }
            }]
          }]
        }]
      }],
      group: ['materias.id', 'materias.nome'],
      order: [[sequelize.literal('wrongCount'), 'DESC']],
      subQuery: false
    });
    
    // 3. Matéria com mais respostas CORRETAS
    const materiaCerta = await Materia.findOne({
      attributes: [
        'id',
        'nome',
        [sequelize.fn('COUNT', sequelize.col('perguntas.sala_perguntas.aluno_respostas.id')), 'correctCount']
      ],
      include: [{
        model: Pergunta,
        as: 'perguntas',
        required: true,
        where: { escola_id: id_escola },
        attributes: [],
        include: [{
          model: SalaPergunta,
          as: 'sala_perguntas',
          required: true,
          attributes: [],
          include: [{
            model: SalaAlunoResposta,
            as: 'aluno_respostas',
            required: true,
            attributes: [],
            where: { createdAt: { [Op.between]: [startDate, endDate] } },
            include: [{
              model: Alternativa,
              as: 'alternativa',
              required: true,
              attributes: [],
              where: { correta: true }
            }]
          }]
        }]
      }],
      group: ['materias.id', 'materias.nome'],
      order: [[sequelize.literal('correctCount'), 'DESC']],
      subQuery: false
    });
    
    // 4. Pergunta com mais respostas INCORRETAS (apenas da escola do usuário)
    const perguntaErrada = await Pergunta.findOne({
      where: { escola_id: id_escola },
      attributes: [
        'id',
        'pergunta',
        [sequelize.fn('COUNT', sequelize.col('sala_perguntas.aluno_respostas.id')), 'wrongCount']
      ],
      include: [{
        model: SalaPergunta,
        as: 'sala_perguntas',
        required: true,
        attributes: [],
        include: [{
          model: SalaAlunoResposta,
          as: 'aluno_respostas',
          required: true,
          attributes: [],
          where: { createdAt: { [Op.between]: [startDate, endDate] } },
          include: [{
            model: Alternativa,
            as: 'alternativa',
            required: true,
            attributes: [],
            where: { correta: false }
          }]
        }]
      }],
      group: ['perguntas.id', 'perguntas.pergunta'],
      order: [[sequelize.literal('wrongCount'), 'DESC']],
      subQuery: false
    });
    
    // 5. Pergunta com mais respostas CORRETAS (apenas da escola do usuário)
    const perguntaCerta = await Pergunta.findOne({
      where: { escola_id: id_escola },
      attributes: [
        'id',
        'pergunta',
        [sequelize.fn('COUNT', sequelize.col('sala_perguntas.aluno_respostas.id')), 'correctCount']
      ],
      include: [{
        model: SalaPergunta,
        as: 'sala_perguntas',
        required: true,
        attributes: [],
        include: [{
          model: SalaAlunoResposta,
          as: 'aluno_respostas',
          required: true,
          attributes: [],
          where: { createdAt: { [Op.between]: [startDate, endDate] } },
          include: [{
            model: Alternativa,
            as: 'alternativa',
            required: true,
            attributes: [],
            where: { correta: true }
          }]
        }]
      }],
      group: ['perguntas.id', 'perguntas.pergunta'],
      order: [[sequelize.literal('correctCount'), 'DESC']],
      subQuery: false
    });
    
    // 6. Quantidade de salas encerradas (só salas cujo host pertence à mesma escola)
    const closedSalas = await Sala.count({
      where: {
        status: 'encerrada',
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      include: [{
        model: Usuario,
        as: 'host',
        required: true,
        where: { id_escola }
      }]
    });
    
    // 7. Média de alunos por sala (apenas salas com host da mesma escola)
    const salas = await Sala.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      include: [
        {
          model: Usuario,
          as: 'host',
          required: true,
          where: { id_escola }
        },
        {
          model: SalaAluno,
          as: 'alunosConectados',
          attributes: []
        }
      ],
      attributes: [
        'id',
        [sequelize.fn('COUNT', sequelize.col('alunosConectados.id')), 'studentCount']
      ],
      group: ['salas.id']
    });
    
    const totalStudents = salas.reduce((sum, sala) => {
      const countValue = Number(sala.get('studentCount')) || 0;
      return sum + countValue;
    }, 0);
    const avgStudents = salas.length ? totalStudents / salas.length : 0;
    
    // 8. Total de respostas enviadas (só respostas de perguntas cuja escola seja a do usuário)
    const totalRespostas = await SalaAlunoResposta.count({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        '$sala_pergunta.pergunta.escola_id$': id_escola,
        '$aluno.usuario.id_escola$': id_escola
      },
      include: [
        {
          model: SalaPergunta,
          as: 'sala_pergunta', // associação definida: SalaAlunoResposta.belongsTo(SalaPergunta, { as: 'sala_pergunta' })
          required: true,
          include: [{
            model: Pergunta,
            as: 'pergunta', // associação definida: SalaPergunta.belongsTo(Pergunta, { as: 'pergunta' })
            required: true,
            attributes: []
          }]
        },
        {
          model: SalaAluno,
          as: 'aluno', // associação definida: SalaAlunoResposta.belongsTo(SalaAluno, { as: 'aluno' })
          required: true,
          include: [{
            model: Usuario,
            as: 'usuario', // associação definida: SalaAluno.belongsTo(Usuario, { as: 'usuario' })
            required: true,
            attributes: []
          }]
        }
      ]
    });
    
    return res.json({
      materiaComMaisRespostasErradas: materiaErrada ? materiaErrada.toJSON() : null,
      materiaComMaisRespostasCorretas: materiaCerta ? materiaCerta.toJSON() : null,
      perguntaMaisErrada: perguntaErrada ? perguntaErrada.toJSON() : null,
      perguntaMaisCerta: perguntaCerta ? perguntaCerta.toJSON() : null,
      salasEncerradas: closedSalas,
      mediaAlunosPorSala: avgStudents,
      totalRespostas
    });
    
  } catch (error) {
    console.error('Erro ao obter estatísticas do dashboard:', error);
    return res.status(500).json({ error: 'Erro ao obter estatísticas do dashboard.' });
  }
}

export default { getDashboardStats };
