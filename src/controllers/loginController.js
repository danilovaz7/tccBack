import Usuario from "../models/Usuario.js"
import jwt from 'jsonwebtoken';


async function login(req, res) {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ error: 'Campos faltando' })
    }

    const user = await Usuario.findOne({
        where: {
            email,
            senha,
        }
    });

    if (!user) {
        return res.status(404).json({ error: 'email ou senha errados' })
    }
  
    const token = jwt.sign(JSON.stringify({id:user.id,idTipo:user.tipo_usuario_id}),process.env.SECRET_KEY);

    return res.status(200).json({
        token,
    })
}
 
export default { 
   login
}