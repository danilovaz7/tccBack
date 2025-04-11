import { QueryTypes, Op } from 'sequelize';
import sequelize from '../db/database.js'; // ou onde sua instância do Sequelize está exportada
// Importação dos modelos caso precise de algum (não utilizada nas raw queries neste exemplo)

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
  const { month } = req.query;
  const { startDate, endDate } = getDateRange(month);

  try {
    // 1. Matéria com mais respostas INCORRETAS
    const [materiaErrada] = await sequelize.query(
      `SELECT m.id, m.nome, COUNT(sar.id) AS wrongCount
       FROM materias m
       JOIN perguntas p ON m.id = p.materia_id
       JOIN sala_perguntas sp ON p.id = sp.pergunta_id
       JOIN sala_aluno_respostas sar ON sp.id = sar.sala_pergunta_id
       JOIN alternativas a ON sar.resposta_id = a.id
       WHERE a.correta = 0 
         AND sar.createdAt BETWEEN ? AND ?
       GROUP BY m.id, m.nome
       ORDER BY wrongCount DESC
       LIMIT 1;`,
      { replacements: [startDate, endDate], type: QueryTypes.SELECT }
    );
    
    // 2. Matéria com mais respostas CORRETAS
    const [materiaCerta] = await sequelize.query(
      `SELECT m.id, m.nome, COUNT(sar.id) AS correctCount
       FROM materias m
       JOIN perguntas p ON m.id = p.materia_id
       JOIN sala_perguntas sp ON p.id = sp.pergunta_id
       JOIN sala_aluno_respostas sar ON sp.id = sar.sala_pergunta_id
       JOIN alternativas a ON sar.resposta_id = a.id
       WHERE a.correta = 1 
         AND sar.createdAt BETWEEN ? AND ?
       GROUP BY m.id, m.nome
       ORDER BY correctCount DESC
       LIMIT 1;`,
      { replacements: [startDate, endDate], type: QueryTypes.SELECT }
    );

    // 3. Pergunta com mais respostas INCORRETAS
    const [perguntaErrada] = await sequelize.query(
      `SELECT p.id, p.pergunta, COUNT(sar.id) AS wrongCount
       FROM perguntas p
       JOIN sala_perguntas sp ON p.id = sp.pergunta_id
       JOIN sala_aluno_respostas sar ON sp.id = sar.sala_pergunta_id
       JOIN alternativas a ON sar.resposta_id = a.id
       WHERE a.correta = 0 
         AND sar.createdAt BETWEEN ? AND ?
       GROUP BY p.id, p.pergunta
       ORDER BY wrongCount DESC
       LIMIT 1;`,
      { replacements: [startDate, endDate], type: QueryTypes.SELECT }
    );

    // 4. Pergunta com mais respostas CORRETAS
    const [perguntaCerta] = await sequelize.query(
      `SELECT p.id, p.pergunta, COUNT(sar.id) AS correctCount
       FROM perguntas p
       JOIN sala_perguntas sp ON p.id = sp.pergunta_id
       JOIN sala_aluno_respostas sar ON sp.id = sar.sala_pergunta_id
       JOIN alternativas a ON sar.resposta_id = a.id
       WHERE a.correta = 1 
         AND sar.createdAt BETWEEN ? AND ?
       GROUP BY p.id, p.pergunta
       ORDER BY correctCount DESC
       LIMIT 1;`,
      { replacements: [startDate, endDate], type: QueryTypes.SELECT }
    );

    // 5. Quantidade de salas encerradas
    const [closedSalasResult] = await sequelize.query(
      `SELECT COUNT(*) AS closedCount
       FROM salas
       WHERE status = 'encerrada'
         AND createdAt BETWEEN ? AND ?;`,
      { replacements: [startDate, endDate], type: QueryTypes.SELECT }
    );
    const closedSalas = closedSalasResult.closedCount || 0;
    
    // 6. Média de alunos por sala
    const salas = await sequelize.query(
      `SELECT id FROM salas WHERE createdAt BETWEEN ? AND ?;`,
      { replacements: [startDate, endDate], type: QueryTypes.SELECT }
    );
    let totalStudents = 0;
    for (const sala of salas) {
      const [countResult] = await sequelize.query(
        `SELECT COUNT(*) AS studentCount FROM sala_alunos WHERE sala_id = ?;`,
        { replacements: [sala.id], type: QueryTypes.SELECT }
      );
      totalStudents += countResult.studentCount;
    }
    const avgStudents = salas.length > 0 ? totalStudents / salas.length : 0;
    
    // 7. Total de respostas enviadas (SalaAlunoResposta)
    const [totalRespostasResult] = await sequelize.query(
      `SELECT COUNT(*) AS total FROM sala_aluno_respostas WHERE createdAt BETWEEN ? AND ?;`,
      { replacements: [startDate, endDate], type: QueryTypes.SELECT }
    );
    const totalRespostas = totalRespostasResult.total || 0;
    
    return res.json({
      materiaComMaisRespostasErradas: materiaErrada || null,
      materiaComMaisRespostasCorretas: materiaCerta || null,
      perguntaMaisErrada: perguntaErrada || null,
      perguntaMaisCerta: perguntaCerta || null,
      salasEncerradas: closedSalas,
      mediaAlunosPorSala: avgStudents,
      totalRespostas
    });
    
  } catch (error) {
    console.error('Erro ao obter estatísticas do dashboard:', error);
    return res.status(500).json({ error: 'Erro ao obter estatísticas do dashboard.' });
  }
}


export default {
    getDashboardStats
}
