import Session from '../models/Session.js'


async function authenticate(req, res, next) {


    if (!req.cookies.Authentication) {
        return res.status(401).send('Você não está autenticado! Faça login para acessar esta página!')
    }

    const session = await Session.findOne({ where: { uuid: req.cookies.Authentication } })


    if (!session) {
        return res.status(401).send('Você não está autenticado! Faça login para acessar esta página!')
    }

    if (session.expires < new Date()) {
        await session.destroy()
        return res.status(401).send('Sua sessão expirou! Faça login novamente')
    }

    const user = await session.getUsuario()

    req.user = user
    next()
}

function authorize(...userTypes) {
    return (req, res, next) => {
        
        if (!userTypes.includes(req.user.type)) {
            return res.status(403).send('Você não tem permissão para acessar esta página!')
        }
    
        next()
    }
}
export default { authenticate, authorize }