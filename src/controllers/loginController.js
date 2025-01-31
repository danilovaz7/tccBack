import Usuario from "../models/Usuario.js"
import jwt from 'jsonwebtoken';


async function login(req, res) {
    const { matricula, senha } = req.body

    if (!matricula || !senha) {
        return res.status(400).json({ error: 'Campos faltando' })
    }

    const user = await Usuario.findOne({
        where: {
            matricula,
            senha,
        }
    });

    if (!user) {
        return res.status(404).json({ error: 'matricula ou senha errados' })
    }
  

    const token = jwt.sign(JSON.stringify({id:user.id,idTipo:user.tipo_usuario_id}), 'SECRET_KEY');

    return res.status(200).json({
        token,
    })
}
 
export default { 
   login
}