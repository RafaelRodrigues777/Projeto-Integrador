import { connectionComercial } from '../database/db.js'

export const listarProdutos = (req, res) => {
    const querySql = `
        SELECT 
            p.id_produto, 
            p.nome_produto, 
            c.nome_categoria, 
            p.valor_unitario 
        FROM produto p 
        INNER JOIN categoria c ON p.fk_id_categoria = c.id_categoria
        ORDER BY p.id_produto ASC
    `

    connectionComercial.query(querySql, (err, result) => {
        if (err) {
            // Se der erro no MySQL, vai aparecer detalhado no seu terminal do VS Code
            console.error("ERRO REAL DO MYSQL:", err)
            return res.status(500).send({ message: "Erro ao buscar produtos" })
        }

        if (result.length === 0) {
            return res.status(200).send([])
        }
        return res.status(200).send(result)
    })
}