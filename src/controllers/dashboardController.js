import { Op, fn, col } from 'sequelize';
import sequelize from '../db/database.js';
import Usuario from '../models/Usuario.js';
import Materia from '../models/Materia.js';
import Pergunta from '../models/Pergunta.js';
import SalaPergunta from '../models/SalaPergunta.js';
import SalaAlunoResposta from '../models/SalaAlunoResposta.js';
import Alternativa from '../models/Alternativa.js';
import Sala from '../models/Sala.js';
import SalaAluno from '../models/SalaAluno.js';

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
  const { id } = req.params;  // id do usuário para filtrar pela escola dele
  const { month } = req.query;
  const { startDate, endDate } = getDateRange(month);
  console.log('Dashboard stats from:', startDate, 'to:', endDate);

  try {
    // 1. Buscar o usuário para obter seu id_escola
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const id_escola = usuario.id_escola;
    console.log(`Calculando estatísticas para a escola: ${id_escola}`);

    // 2. Matéria com mais respostas erradas
    const materiaErrada = await Materia.findOne({
      attributes: [
        'id',
        'nome',
        [fn('COUNT', col('perguntas.sala_perguntas.aluno_respostas.id')), 'wrongCount']
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
              where: { correta: false }
            }]
          }]
        }]
      }],
      group: ['materias.id', 'materias.nome'],
      order: [[sequelize.literal('wrongCount'), 'DESC']],
      subQuery: false
    });
    
    // 3. Matéria com mais respostas corretas
    const materiaCerta = await Materia.findOne({
      attributes: [
        'id',
        'nome',
        [fn('COUNT', col('perguntas.sala_perguntas.aluno_respostas.id')), 'correctCount']
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
    
    // 4. Pergunta com mais respostas erradas
    const perguntaErrada = await Pergunta.findOne({
      where: { escola_id: id_escola },
      attributes: [
        'id',
        'pergunta',
        [fn('COUNT', col('sala_perguntas.aluno_respostas.id')), 'wrongCount']
      ],
      include: [
        {
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
        },
        {
          model: Materia,
          as: 'materia',
          attributes: ['id', 'nome']
        }
      ],
      group: ['perguntas.id', 'perguntas.pergunta', 'materia.id'],
      order: [[sequelize.literal('wrongCount'), 'DESC']],
      subQuery: false
    });
    
    // 5. Pergunta com mais respostas corretas
    const perguntaCerta = await Pergunta.findOne({
      where: { escola_id: id_escola },
      attributes: [
        'id',
        'pergunta',
        [fn('COUNT', col('sala_perguntas.aluno_respostas.id')), 'correctCount']
      ],
      include: [
        {
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
        },
        {
          model: Materia,
          as: 'materia',
          attributes: ['id', 'nome']
        }
      ],
      group: ['perguntas.id', 'perguntas.pergunta', 'materia.id'],
      order: [[sequelize.literal('correctCount'), 'DESC']],
      subQuery: false
    });
    
    // 6. Salas encerradas agrupadas por tipo (online e offline)
    const salasEncerradasGrouped = await Sala.findAll({
      where: {
        status: 'encerrada',
        createdAt: { [Op.between]: [startDate, endDate] }
      },
      include: [{
        model: Usuario,
        as: 'host',
        required: true,
        where: { id_escola },
        attributes: []
      }],
      attributes: [
        'tipo',
        [fn('COUNT', col('salas.id')), 'count']
      ],
      group: ['tipo']
    });
    const salasEncerradas = { online: 0, offline: 0 };
    salasEncerradasGrouped.forEach(item => {
      const tipo = item.get('tipo');
      const count = Number(item.get('count'));
      if (tipo) {
        const tipoLower = tipo.toLowerCase();
        if (tipoLower === 'online' || tipoLower === 'offline') {
          salasEncerradas[tipoLower] = count;
        }
      }
    });
    
    // 7. Média de alunos por sala (apenas salas cujo host pertence à mesma escola)
    const salas = await Sala.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      include: [
        { model: Usuario, as: 'host', required: true, where: { id_escola }, attributes: [] },
        { model: SalaAluno, as: 'alunosConectados', attributes: [] }
      ],
      attributes: [
        'id',
        [fn('COUNT', col('alunosConectados.id')), 'studentCount']
      ],
      group: ['salas.id']
    });
    const totalStudents = salas.reduce((sum, sala) => sum + Number(sala.get('studentCount') || 0), 0);
    const avgStudents = salas.length ? totalStudents / salas.length : 0;
    
    // 8. Total de respostas enviadas (apenas respostas de perguntas cuja escola seja a mesma)
    const totalRespostas = await SalaAlunoResposta.count({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      include: [
        {
          model: SalaPergunta,
          as: 'sala_pergunta',
          required: true,
          include: [{
            model: Pergunta,
            as: 'pergunta',
            required: true,
            where: { escola_id: id_escola },
            attributes: []
          }]
        },
        {
          model: SalaAluno,
          as: 'aluno',
          required: true,
          include: [{
            model: Usuario,
            as: 'usuario',
            required: true,
            where: { id_escola },
            attributes: []
          }]
        }
      ]
    });
    
    // 9. Ranking por Turma: os 3 alunos que mais erraram (considerando respostas erradas)
    const wrongAnswers = await SalaAlunoResposta.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] } },
      include: [
        {
          model: Alternativa,
          as: 'alternativa',
          required: true,
          where: { correta: false },
          attributes: []
        },
        {
          model: SalaAluno,
          as: 'aluno',
          required: true,
          attributes: ['usuario_id'],
          include: [{
            model: Usuario,
            as: 'usuario',
            required: true,
            where: { id_escola },
            attributes: ['id', 'nome', 'id_turma']
          }]
        }
      ],
      attributes: [
        [fn('COUNT', col('sala_aluno_respostas.id')), 'wrongCount']
      ],
      group: ['aluno.usuario.id', 'aluno.usuario.nome', 'aluno.usuario.id_turma'],
      raw: true,
      nest: true
    });
    const rankingByTurma = {};
    wrongAnswers.forEach(item => {
      const turma = item.aluno?.usuario?.id_turma;
      if (!turma) return;
      if (!rankingByTurma[turma]) rankingByTurma[turma] = [];
      rankingByTurma[turma].push({
        id: item.aluno.usuario.id,
        nome: item.aluno.usuario.nome,
        wrongCount: Number(item.wrongCount)
      });
    });
    Object.keys(rankingByTurma).forEach(turma => {
      rankingByTurma[turma].sort((a, b) => b.wrongCount - a.wrongCount);
      rankingByTurma[turma] = rankingByTurma[turma].slice(0, 3);
    });
    
    return res.json({
      materiaComMaisRespostasErradas: materiaErrada,
      materiaComMaisRespostasCorretas: materiaCerta,
      perguntaMaisErrada: perguntaErrada,
      perguntaMaisCerta: perguntaCerta,
      salasEncerradas,       // Ex: { online: x, offline: y }
      mediaAlunosPorSala: avgStudents,
      totalRespostas,
      rankingPorTurma: rankingByTurma
    });
    
  } catch (error) {
    console.error('Erro ao obter estatísticas do dashboard:', error);
    return res.status(500).json({ error: 'Erro ao obter estatísticas do dashboard.' });
  }
}

export default { getDashboardStats };
