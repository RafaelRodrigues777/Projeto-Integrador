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
// Adicione esta função logo abaixo do seu listarProdutos
export const excluirProduto = (req, res) => {
    const { id } = req.params;

    // Se o ID não chegou ou veio vazio por algum motivo, avisa logo o frontend
    if (!id || id === 'undefined') {
        return res.status(400).send('ID do produto inválido ou não enviado.');
    }

    const sql = `DELETE FROM produto WHERE id_produto = ?`;

    connectionComercial.query(sql, [id], (err, result) => {
        if (err) {
            console.error("ERRO REAL AO EXCLUIR PRODUTO:", err);
            
            // Se for erro de chave estrangeira (produto com pedido)
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).send('Não é possível excluir este produto pois ele já possui pedidos registrados.');
            }
            
            // Retorna qualquer outro erro real do MySQL para o frontend ver no alert
            return res.status(400).send(`Erro no Banco (${err.code}): ${err.sqlMessage}`);
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).send('Produto não encontrado no banco de dados.');
        }

        return res.status(200).send('Produto excluído com sucesso!');
    });
}