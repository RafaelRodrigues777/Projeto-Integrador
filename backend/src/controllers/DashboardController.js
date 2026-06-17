import { connectionComercial } from '../database/db.js'

export const getFaturamento = (req, res) => {
    connectionComercial.query('SELECT SUM(valor_total) AS total FROM registro', (err, result) => {
        if (err) return res.status(500).send({ message: "Erro ao buscar faturamento" })
        return res.status(200).send({ total: result[0].total ?? 0 })
    })
}

export const getPedidos = (req, res) => {
    connectionComercial.query('SELECT COUNT(*) AS total FROM registro', (err, result) => {
        if (err) return res.status(500).send({ message: "Erro ao buscar pedidos" })
        return res.status(200).send({ total: result[0].total ?? 0 })
    })
}

export const getClientes = (req, res) => {
    connectionComercial.query('SELECT COUNT(*) AS total FROM cliente', (err, result) => {
        if (err) return res.status(500).send({ message: "Erro ao buscar clientes" })
        return res.status(200).send({ total: result[0].total ?? 0 })
    })
}

export const getProdutos = (req, res) => {
    connectionComercial.query('SELECT COUNT(*) AS total FROM produto', (err, result) => {
        if (err) return res.status(500).send({ message: "Erro ao buscar produtos" })
        return res.status(200).send({ total: result[0].total ?? 0 })
    })
}
export const getProdutosMaisVendidos = (req, res) => {
    const query = `
        SELECT p.nome_produto, SUM(r.quantidade) AS total_vendido
        FROM registro r
        JOIN produto p ON r.fk_id_produto = p.id_produto
        GROUP BY p.id_produto, p.nome_produto
        ORDER BY total_vendido DESC
        LIMIT 10
    `
    connectionComercial.query(query, (err, result) => {
        if (err) return res.status(500).send({ message: "Erro ao buscar produtos mais vendidos" })
        return res.status(200).send(result)
    })
}

export const getVendedoresReceita = (req, res) => {
    const query = `
        SELECT v.nome_vendedor, SUM(r.valor_total) AS total_receita
        FROM registro r
        JOIN vendedor v ON r.fk_id_vendedor = v.id_vendedor
        GROUP BY v.id_vendedor, v.nome_vendedor
        ORDER BY total_receita DESC
    `
    connectionComercial.query(query, (err, result) => {
        if (err) return res.status(500).send({ message: "Erro ao buscar receita por vendedor" })
        return res.status(200).send(result)
    })
}

export const getDesempenhoRegioes = (req, res) => {
    const query = `
        SELECT l.estado, SUM(r.valor_total) AS total_receita
        FROM registro r
        JOIN cliente c ON r.fk_id_cliente = c.id_cliente
        JOIN localizacao l ON c.fk_id_localizacao = l.id_localizacao
        GROUP BY l.estado
        ORDER BY total_receita DESC
    `
    connectionComercial.query(query, (err, result) => {
        if (err) return res.status(500).send({ message: "Erro ao buscar desempenho por região" })
        return res.status(200).send(result)
    })
}

export const getFaturamentoSatisfacao = (req, res) => {
    const query = `
        SELECT nota_satisfacao, AVG(valor_total) AS media_faturamento, COUNT(*) AS total_pedidos
        FROM registro
        GROUP BY nota_satisfacao
        ORDER BY nota_satisfacao ASC
    `
    connectionComercial.query(query, (err, result) => {
        if (err) return res.status(500).send({ message: "Erro ao buscar relação faturamento/satisfação" })
        return res.status(200).send(result)
    })
}