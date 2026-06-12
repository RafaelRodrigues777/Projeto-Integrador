import {connectionLogin} from '../database/db.js'

export const loginUser = (req, res) => {
    const {email, senha} = req.body

    connectionLogin.query('SELECT * FROM `user` WHERE email = ?', [email], (err, result) => {
        if(err){
            return res.status(500).send({message: "Erro ao buscar usuário"})
        }

        if(result.length === 0){
            return res.status(401).send({message: "Email ou senha inválidos"})
        }

        const user = result[0]

        if(user.password !== senha){
            return res.status(401).send({message: "Email ou senha inválidos"})
        }

        return res.status(200).send({message: "Login realizado com sucesso"})
    })
}