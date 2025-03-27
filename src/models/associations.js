import Elo from './Elo.js';
import Subelo from './Subelo.js';
import Usuario from './Usuario.js';
import TipoUsuario from './TipoUsuario.js';
import Materia from './Materia.js';
import EloMateria from './EloMateria.js';
import HistoricoPartida from './HistoricoPartida.js';
import Pergunta from './Pergunta.js';
import Alternativa from './Alternativa.js';
import RespostaQuiz from './RespostaQuiz.js';
import EstatisticaGeral from './EstatisticaGeral.js';
import Turma from './Turma.js';
import Escola from './Escola.js';
import Avatar from './Avatar.js';
import Sala from './Sala.js';         
import SalaAluno from './SalaAluno.js'; 

// Associações relacionadas a TipoUsuario
TipoUsuario.hasMany(Usuario, { foreignKey: 'tipo_usuario_id', as: 'usuarios' });
Usuario.belongsTo(TipoUsuario, { foreignKey: 'tipo_usuario_id', as: 'tipo_usuario' });

Materia.hasMany(Usuario, { foreignKey: 'id_materia', as: 'usuarios' });
Usuario.belongsTo(Materia, { foreignKey: 'id_materia', as: 'materia' });

Turma.hasMany(Usuario, { foreignKey: 'id_turma', as: 'usuarios' });
Usuario.belongsTo(Turma, { foreignKey: 'id_turma', as: 'turma' });

Escola.hasMany(Usuario, { foreignKey: 'id_escola', as: 'usuarios' });
Usuario.belongsTo(Escola, { foreignKey: 'id_escola', as: 'escola' });

Avatar.hasMany(Usuario, { foreignKey: 'id_avatar', as: 'usuarios' });
Usuario.belongsTo(Avatar, { foreignKey: 'id_avatar', as: 'avatar' });

// Associações relacionadas a Usuarios e EstatisticasGerais
Usuario.hasOne(EstatisticaGeral, { foreignKey: 'usuario_id', as: 'estatisticas_gerais' });
EstatisticaGeral.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Associações relacionadas a Materias e EloMaterias
Materia.hasMany(EloMateria, { foreignKey: 'materia_id', as: 'elos' });
EloMateria.belongsTo(Materia, { foreignKey: 'materia_id', as: 'materia' });

Usuario.hasMany(EloMateria, { foreignKey: 'usuario_id', as: 'elos' });
EloMateria.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Associações relacionadas a EloMateria e Elo
Elo.hasMany(EloMateria, { foreignKey: 'elo_id', as: 'elos_materia' });
EloMateria.belongsTo(Elo, { foreignKey: 'elo_id', as: 'elo' });

// Associações relacionadas a EloMateria e Subelo
Subelo.hasMany(EloMateria, { foreignKey: 'subelo_id', as: 'subelos_materia' });
EloMateria.belongsTo(Subelo, { foreignKey: 'subelo_id', as: 'subelo' });

// Associações relacionadas a Usuarios e HistoricoPartidas
Usuario.hasMany(HistoricoPartida, { foreignKey: 'usuario_id_1', as: 'historico_partidas_como_1' });
Usuario.hasMany(HistoricoPartida, { foreignKey: 'usuario_id_2', as: 'historico_partidas_como_2' });
HistoricoPartida.belongsTo(Usuario, { foreignKey: 'usuario_id_1', as: 'usuario_1' });
HistoricoPartida.belongsTo(Usuario, { foreignKey: 'usuario_id_2', as: 'usuario_2' });

// Associações relacionadas a Materias em HistoricoPartidas
Materia.hasMany(HistoricoPartida, { foreignKey: 'materia_id_1', as: 'partidas_materia_1' });
Materia.hasMany(HistoricoPartida, { foreignKey: 'materia_id_2', as: 'partidas_materia_2' });
Materia.hasMany(HistoricoPartida, { foreignKey: 'materia_aleatoria_id', as: 'partidas_materia_aleatoria' });

HistoricoPartida.belongsTo(Materia, { foreignKey: 'materia_id_1', as: 'materia_1' });
HistoricoPartida.belongsTo(Materia, { foreignKey: 'materia_id_2', as: 'materia_2' });
HistoricoPartida.belongsTo(Materia, { foreignKey: 'materia_aleatoria_id', as: 'materia_aleatoria' });

// Associações relacionadas a Usuarios e HistoricoPartidas (vencedor)
Usuario.hasMany(HistoricoPartida, { foreignKey: 'vencedor_id', as: 'partidas_vencidas' });
HistoricoPartida.belongsTo(Usuario, { foreignKey: 'vencedor_id', as: 'vencedor' });

// Associações relacionadas a Materias e Perguntas
Materia.hasMany(Pergunta, { foreignKey: 'materia_id', as: 'perguntas' });
Pergunta.belongsTo(Materia, { foreignKey: 'materia_id', as: 'materia' });

Turma.hasMany(Pergunta, { foreignKey: 'turma_id', as: 'perguntas' });
Pergunta.belongsTo(Turma, { foreignKey: 'turma_id', as: 'turma' });

// Associações relacionadas a Elos e Perguntas
Elo.hasMany(Pergunta, { foreignKey: 'elo_id', as: 'perguntas' });
Pergunta.belongsTo(Elo, { foreignKey: 'elo_id', as: 'elo' });

// Associações relacionadas a Perguntas e Alternativas
Pergunta.hasMany(Alternativa, { foreignKey: 'pergunta_id', as: 'alternativas' });
Alternativa.belongsTo(Pergunta, { foreignKey: 'pergunta_id', as: 'pergunta' });

// Associações relacionadas a Usuarios, Perguntas, Alternativas e RespostaQuiz
Usuario.hasMany(RespostaQuiz, { foreignKey: 'usuario_id', as: 'respostas_quiz' });
Pergunta.hasMany(RespostaQuiz, { foreignKey: 'pergunta_id', as: 'respostas_quiz' });
Alternativa.hasMany(RespostaQuiz, { foreignKey: 'alternativa_id', as: 'respostas_quiz' });

RespostaQuiz.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
RespostaQuiz.belongsTo(Pergunta, { foreignKey: 'pergunta_id', as: 'pergunta' });
RespostaQuiz.belongsTo(Alternativa, { foreignKey: 'alternativa_id', as: 'alternativa' });

// Associação para o vencedor da sala (relacionamento direto com Usuario)
Usuario.hasMany(Sala, { foreignKey: 'vencedor_id', as: 'salas_vencidas' });
Sala.belongsTo(Usuario, { foreignKey: 'vencedor_id', as: 'vencedor' });

// Associação de um para muitos entre Sala e SalaAluno
Sala.hasMany(SalaAluno, { foreignKey: 'sala_id', as: 'alunosConectados' });
SalaAluno.belongsTo(Sala, { foreignKey: 'sala_id', as: 'sala' });

// Associação de um para muitos entre Usuario e SalaAluno
Usuario.hasMany(SalaAluno, { foreignKey: 'usuario_id', as: 'salasParticipadas' });
SalaAluno.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });