import { UUID } from "sequelize"

import Usuario from "../models/Usuario.js"
import Sala from "../models/Sala.js"
import SalaAluno from "../models/SalaAluno.js"
import SalaPergunta from "../models/SalaPergunta.js"
import SalaAlunoResposta from "../models/SalaAlunoResposta.js"
import Alternativa from "../models/Alternativa.js"
import Pergunta from "../models/Pergunta.js"


async function getEstatisticasByUser(req, res) {
    const { id } = req.params;

  try {
    // Quantidade de salas que o usuário participou (status 'encerrada')
    const total_disputas = await SalaAluno.count({
      include: {
        model: Sala,
        as: 'sala', // Alias definido nas associações
        where: { status: 'encerrada' },
      },
      where: { usuario_id: id },
    });

    // Quantidade de salas que o usuário ganhou
    const total_disputas_ganhas = await Sala.count({
      where: { vencedor_id: id },
    });

    // Total de perguntas respondidas
    const total_perguntas = await SalaAlunoResposta.count({
      include: [
        {
          model: SalaPergunta,
          as: 'sala_pergunta', // Alias definido nas associações
          include: {
            model: Sala,
            as: 'sala', // Alias
            where: { status: 'encerrada' },
          },
        },
        {
          model: SalaAluno,
          as: 'aluno', // Alias definido nas associações
          where: { usuario_id: id },
        },
      ],
    });

    // Total de perguntas respondidas corretamente
    const total_perguntas_acertadas = await SalaAlunoResposta.count({
      include: [
        {
          model: Alternativa,
          as: 'alternativa', // Alias definido nas associações
          where: { correta: true },
        },
        {
          model: SalaPergunta,
          as: 'sala_pergunta',
          include: {
            model: Sala,
            as: 'sala',
            where: { status: 'encerrada' },
          },
        },
        {
          model: SalaAluno,
          as: 'aluno',
          where: { usuario_id: id },
        },
      ],
    });

    console.log(total_disputas,
        total_disputas_ganhas,
        total_perguntas,
        total_perguntas_acertadas,)
    return res.status(200).json({
      total_disputas,
      total_disputas_ganhas,
      total_perguntas,
      total_perguntas_acertadas,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}


export default {
    getEstatisticasByUser
}