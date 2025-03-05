import Usuario from "../models/Usuario.js";

const XP_BASE = 200;
const XP_MULTIPLICADOR = 1.5;

function calcularXpNecessario(nivel) {
    return Math.round(XP_BASE * Math.pow(XP_MULTIPLICADOR, nivel - 1));
}

function calcularNivel(xpTotal, nivelUsuario) {
    while (xpTotal >= calcularXpNecessario(nivelUsuario + 1)) {
        nivelUsuario++;
    }
    return nivelUsuario;
}

async function adicionarXp(req, res) {
    const { id } = req.params;
    const { xpGanho } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    usuario.experiencia += xpGanho;
    usuario.nivel = calcularNivel(usuario.experiencia, usuario.nivel);

    try {
        await usuario.validate();
    } catch (error) {
        return res.status(400).json({ error: 'Informações de usuário inválidas: ' + error.message });
    }
    console.log('usuario pos validate', usuario);
    try {
        await usuario.save();
        res.json(usuario.toJSON());
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário: ' + error.message });
    }

    return usuario;
}

export default {
    adicionarXp
};
