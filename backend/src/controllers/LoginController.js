import { connectionLogin } from '../database/db.js'

export const loginUser = (req, res) => {
    const { email, senha } = req.body

    connectionLogin.query('SELECT * FROM `user` WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error("Erro no banco de dados durante o login:", err);
            return res.status(500).json({ message: "Erro ao buscar usuário" })
        }

        if (result.length === 0) {
            return res.status(401).json({ message: "Email ou senha inválidos" })
        }

        const user = result[0]

        if (user.password !== senha) {
            return res.status(401).json({ message: "Email ou senha inválidos" })
        }

        // Retorna o sucesso e os dados em JSON puro para o Fetch
        return res.status(200).json({ 
            message: "Login realizado com sucesso",
            usuario: {
                id_user: user.id_user,
                email: user.email
            }
        })
    })
}