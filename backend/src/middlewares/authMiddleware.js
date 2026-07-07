export const verificarAutenticacaoBasica = (req, res, next) => {
    // Pega o ID do usuário enviado pelo cabeçalho customizado
    const userId = req.headers['user-id'];

    // Se não enviou o ID, bloqueia o acesso na hora
    if (!userId || userId === 'undefined') {
        return res.status(401).json({ message: "Acesso negado. Usuário não autenticado." });
    }

    // Se o ID existe, o Express deixa a requisição passar para o controller
    next();
};