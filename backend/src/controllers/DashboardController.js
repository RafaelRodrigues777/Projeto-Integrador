import { connectionComercial } from '../database/db.js';

// ==================== CARDS ====================

export const getFaturamento = (req, res) => {
    const sql = `
        SELECT COALESCE(SUM(valor_total), 0) AS total
        FROM registro
    `;

    connectionComercial.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json({ total: result[0].total });
    });
};

export const getPedidos = (req, res) => {
    connectionComercial.query(
        `SELECT COUNT(*) AS total FROM registro`,
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            res.json({ total: result[0].total });
        }
    );
};

export const getClientes = (req, res) => {
    connectionComercial.query(
        `SELECT COUNT(*) AS total FROM cliente`,
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            res.json({ total: result[0].total });
        }
    );
};

export const getProdutos = (req, res) => {
    connectionComercial.query(
        `SELECT COUNT(*) AS total FROM produto`,
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            res.json({ total: result[0].total });
        }
    );
};

// ==================== PRODUTOS MAIS VENDIDOS ====================

export const getProdutosMaisVendidos = (req, res) => {

    const sql = `
        SELECT
            p.nome_produto,
            COALESCE(SUM(r.quantidade),0) AS total_vendido
        FROM produto p
        LEFT JOIN registro r
            ON r.fk_id_produto = p.id_produto
        GROUP BY
            p.id_produto,
            p.nome_produto
        ORDER BY total_vendido DESC;
    `;

    connectionComercial.query(sql, (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

};

// ==================== RECEITA POR VENDEDOR ====================

export const getVendedoresReceita = (req, res) => {

    const sql = `
        SELECT
            v.nome_vendedor,
            COALESCE(SUM(r.valor_total),0) AS total_receita
        FROM vendedor v
        LEFT JOIN registro r
            ON r.fk_id_vendedor = v.id_vendedor
        GROUP BY
            v.id_vendedor,
            v.nome_vendedor
        ORDER BY total_receita DESC;
    `;

    connectionComercial.query(sql, (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

};

// ==================== RECEITA POR ESTADO ====================

export const getDesempenhoRegioes = (req, res) => {

    const sql = `
        SELECT
            l.estado,
            COALESCE(SUM(r.valor_total),0) AS total_receita
        FROM localizacao l
        LEFT JOIN cliente c
            ON c.fk_id_localizacao = l.id_localizacao
        LEFT JOIN registro r
            ON r.fk_id_cliente = c.id_cliente
        GROUP BY
            l.estado
        ORDER BY total_receita DESC;
    `;

    connectionComercial.query(sql, (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

};

// ==================== FATURAMENTO X SATISFAÇÃO ====================

export const getFaturamentoSatisfacao = (req, res) => {

    const sql = `
        SELECT
            nota_satisfacao,
            ROUND(AVG(valor_total), 2) AS media_faturamento,
            COUNT(*) AS total_pedidos,
            ROUND(MIN(valor_total), 2) AS menor_valor,
            ROUND(MAX(valor_total), 2) AS maior_valor
        FROM registro
        WHERE nota_satisfacao IS NOT NULL
          AND valor_total IS NOT NULL
        GROUP BY nota_satisfacao
        ORDER BY nota_satisfacao;
    `;

    connectionComercial.query(sql, (err, result) => {

        if (err) {
            console.error("Erro ao buscar faturamento por satisfação:", err);
            return res.status(500).json({
                message: "Erro ao consultar os dados."
            });
        }

        return res.status(200).json(result);

    });

};