import jwt from 'jsonwebtoken';

export async function authenticate(req, res, next) {
    // Obtém o token diretamente do cookie

    const token = req.cookies.token;

    // Se não houver token, retorna 403
    if (!token) {
        return res.status(403).json({ message: "Forbidden", error: "Token is missing" });
    }

    try {
        // Verifica e decodifica o token JWT, usando a chave secreta armazenada em `process.env.JWT_SECRET`
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
 
        // Anexa o usuário decodificado à requisição, incluindo o tipo do usuário
        req.user = decoded;
        // Exemplo: Acessando o tipo de usuário (se necessário)
      

        // Chama o próximo middleware ou rota
        next();
    } catch (error) {
        // Se o token for inválido ou expirado, retorna erro 401
        let errorMessage = "Unauthorized";
        let errorDetail = error.message;

        // Se o erro for de token expirado, informe especificamente
        if (error.name === 'TokenExpiredError') {
            errorMessage = "Token Expired";
            errorDetail = "The token has expired.";
        }

        return res.status(401).json({ message: errorMessage, error: errorDetail });
    }
}
