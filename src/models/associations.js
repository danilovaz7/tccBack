// Importação dos modelos
import Elo from './Elo.js';
import Subelo from './Subelo.js';
import Usuario from './Usuario.js';
import TipoUsuario from './TipoUsuario.js';
import Materia from './Materia.js';
import EloMateria from './EloMateria.js';
import Pergunta from './Pergunta.js';
import Alternativa from './Alternativa.js';
import RespostaQuiz from './RespostaQuiz.js';
import Turma from './Turma.js';
import Escola from './Escola.js';
import Avatar from './Avatar.js';
import Sala from './Sala.js';
import SalaAluno from './SalaAluno.js';
import SalaPergunta from './SalaPergunta.js';
import SalaAlunoResposta from './SalaAlunoResposta.js';

/* ========= ASSOCIAÇÕES EXISTENTES ========= */

// TipoUsuario e Usuario
TipoUsuario.hasMany(Usuario, { foreignKey: 'tipo_usuario_id', as: 'usuarios' });
Usuario.belongsTo(TipoUsuario, { foreignKey: 'tipo_usuario_id', as: 'tipo_usuario' });

// Materia e Usuario
Materia.hasMany(Usuario, { foreignKey: 'id_materia', as: 'usuarios' });
Usuario.belongsTo(Materia, { foreignKey: 'id_materia', as: 'materia' });

// Turma e Usuario
Turma.hasMany(Usuario, { foreignKey: 'id_turma', as: 'usuarios' });
Usuario.belongsTo(Turma, { foreignKey: 'id_turma', as: 'turma' });

// Escola e Usuario
Escola.hasMany(Usuario, { foreignKey: 'id_escola', as: 'usuarios' });
Usuario.belongsTo(Escola, { foreignKey: 'id_escola', as: 'escola' });

// Avatar e Usuario
Avatar.hasMany(Usuario, { foreignKey: 'id_avatar', as: 'usuarios' });
Usuario.belongsTo(Avatar, { foreignKey: 'id_avatar', as: 'avatar' });

// Materia e EloMateria
Materia.hasMany(EloMateria, { foreignKey: 'materia_id', as: 'elos' });
EloMateria.belongsTo(Materia, { foreignKey: 'materia_id', as: 'materia' });

// Usuario e EloMateria
Usuario.hasMany(EloMateria, { foreignKey: 'usuario_id', as: 'elos' });
EloMateria.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Elo e EloMateria
Elo.hasMany(EloMateria, { foreignKey: 'elo_id', as: 'elos_materia' });
EloMateria.belongsTo(Elo, { foreignKey: 'elo_id', as: 'elo' });

// Subelo e EloMateria
Subelo.hasMany(EloMateria, { foreignKey: 'subelo_id', as: 'subelos_materia' });
EloMateria.belongsTo(Subelo, { foreignKey: 'subelo_id', as: 'subelo' });

// Materia e Pergunta
Materia.hasMany(Pergunta, { foreignKey: 'materia_id', as: 'perguntas' });
Pergunta.belongsTo(Materia, { foreignKey: 'materia_id', as: 'materia' });

// Turma e Pergunta
Turma.hasMany(Pergunta, { foreignKey: 'turma_id', as: 'perguntas' });
Pergunta.belongsTo(Turma, { foreignKey: 'turma_id', as: 'turma' });

// Elo e Pergunta
Elo.hasMany(Pergunta, { foreignKey: 'elo_id', as: 'perguntas' });
Pergunta.belongsTo(Elo, { foreignKey: 'elo_id', as: 'elo' });

Usuario.hasMany(Pergunta, { foreignKey: 'criador_id', as: 'perguntas' });
Pergunta.belongsTo(Usuario, { foreignKey: 'criador_id', as: 'criador' });

// Escola e Pergunta
Escola.hasMany(Pergunta, { foreignKey: 'escola_id', as: 'perguntas' });
Pergunta.belongsTo(Escola, { foreignKey: 'escola_id', as: 'escola' });

// Pergunta e Alternativa
Pergunta.hasMany(Alternativa, { foreignKey: 'pergunta_id', as: 'alternativas' });
Alternativa.belongsTo(Pergunta, { foreignKey: 'pergunta_id', as: 'pergunta' });

// Usuário, Pergunta, Alternativa e RespostaQuiz
Usuario.hasMany(RespostaQuiz, { foreignKey: 'usuario_id', as: 'respostas_quiz' });
RespostaQuiz.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Pergunta.hasMany(RespostaQuiz, { foreignKey: 'pergunta_id', as: 'respostas_quiz' });
RespostaQuiz.belongsTo(Pergunta, { foreignKey: 'pergunta_id', as: 'pergunta' });

Alternativa.hasMany(RespostaQuiz, { foreignKey: 'alternativa_id', as: 'respostas_quiz' });
RespostaQuiz.belongsTo(Alternativa, { foreignKey: 'alternativa_id', as: 'alternativa' });

// Sala: host e vencedor
Usuario.hasMany(Sala, { foreignKey: 'host_id', as: 'salas_criadas' });
Sala.belongsTo(Usuario, { foreignKey: 'host_id', as: 'host' });

Usuario.hasMany(Sala, { foreignKey: 'vencedor_id', as: 'salas_vencidas' });
Sala.belongsTo(Usuario, { foreignKey: 'vencedor_id', as: 'vencedor' });

// Sala e SalaAluno
Sala.hasMany(SalaAluno, { foreignKey: 'sala_id', as: 'alunosConectados' });
SalaAluno.belongsTo(Sala, { foreignKey: 'sala_id', as: 'sala' });

Usuario.hasMany(SalaAluno, { foreignKey: 'usuario_id', as: 'salasParticipadas' });
SalaAluno.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });


Sala.hasMany(SalaPergunta, { foreignKey: 'sala_id', as: 'sala_perguntas' });
SalaPergunta.belongsTo(Sala, { foreignKey: 'sala_id', as: 'sala' });

Pergunta.hasMany(SalaPergunta, { foreignKey: 'pergunta_id', as: 'sala_perguntas' });
SalaPergunta.belongsTo(Pergunta, { foreignKey: 'pergunta_id', as: 'pergunta' });


SalaAluno.hasMany(SalaAlunoResposta, { foreignKey: 'sala_aluno_id', as: 'aluno_respostas' });
SalaAlunoResposta.belongsTo(SalaAluno, { foreignKey: 'sala_aluno_id', as: 'aluno' });

SalaPergunta.hasMany(SalaAlunoResposta, { foreignKey: 'sala_pergunta_id', as: 'aluno_respostas' });
SalaAlunoResposta.belongsTo(SalaPergunta, { foreignKey: 'sala_pergunta_id', as: 'sala_pergunta' });

Alternativa.hasMany(SalaAlunoResposta, { foreignKey: 'resposta_id', as: 'alternativa_respostas' });
SalaAlunoResposta.belongsTo(Alternativa, { foreignKey: 'resposta_id', as: 'alternativa' });


