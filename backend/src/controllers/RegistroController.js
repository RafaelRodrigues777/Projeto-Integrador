import { connectionComercial } from '../database/db.js';

class RelatoriosController {

    // ==========================
    // METODO PRINCIPAL: REGISTRAR PEDIDO
    // ==========================
    // ==========================
    // METODO PRINCIPAL: REGISTRAR PEDIDO (Corrigido)
    // ==========================
    async criar(req, res) {
        const {
            data_pedido,
            fk_id_cliente,
            fk_id_vendedor,
            fk_id_produto,
            quantidade,
            fk_id_tipo_pagamento,
            nota_satisfacao,
            observacao
        } = req.body;

        // Validação simples dos campos obrigatórios do pedido
        if (!data_pedido || !fk_id_cliente || !fk_id_vendedor || !fk_id_produto || !quantidade || !fk_id_tipo_pagamento || nota_satisfacao === undefined) {
            return res.status(400).send('Todos os campos obrigatórios do pedido devem ser preenchidos.');
        }

        // CORREÇÃO AQUI: Alterado de (data, ...) para (data_pedido, ...)
        const sql = `
            INSERT INTO registro (data_pedido, fk_id_cliente, fk_id_vendedor, fk_id_produto, quantidade, fk_id_tipo_pagamento, nota_satisfacao, observacao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connectionComercial.query(
            sql,
            [data_pedido, fk_id_cliente, fk_id_vendedor, fk_id_produto, quantidade, fk_id_tipo_pagamento, nota_satisfacao, observacao],
            (err, result) => {
                if (err) {
                    console.error("Erro ao inserir na tabela registro:", err);
                    return res.status(500).send('Erro ao salvar o pedido no banco de dados.');
                }
                return res.status(201).json({ id_registro: result.insertId, message: 'Pedido registrado com sucesso!' });
            }
        );
    }
    // ==========================
    // MÉTODOS DE LISTAGEM (Caso o seu frontend use para carregar as datalists)
    // ==========================
    async listarClientes(req, res) {
        const sql = 'SELECT id_cliente, nome_cliente FROM cliente ORDER BY nome_cliente ASC';
        connectionComercial.query(sql, (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    }

    async listarVendedores(req, res) {
        const sql = 'SELECT id_vendedor, nome_vendedor FROM vendedor ORDER BY nome_vendedor ASC';
        connectionComercial.query(sql, (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    }

    async listarProdutos(req, res) {
        const sql = 'SELECT id_produto, nome_produto, valor_unitario FROM produto ORDER BY nome_produto ASC';
        connectionComercial.query(sql, (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    }

    async listarTiposPagamento(req, res) {
        const sql = 'SELECT id_tipo_pagamento, nome_tipo FROM tipo_pagamento ORDER BY nome_tipo ASC';
        connectionComercial.query(sql, (err, results) => {
            if (err) return res.status(500).send(err);
            res.json(results);
        });
    }

    // ==========================
    // CADASTRAR CLIENTE 
    // ==========================
    async criarCliente(req, res) {
        const { nome_cliente, fk_id_localizacao } = req.body;

        if (!nome_cliente || !fk_id_localizacao) {
            return res.status(400).send('Nome do cliente e localização são obrigatórios.');
        }

        const sql = `
            INSERT INTO cliente (nome_cliente, fk_id_localizacao)
            VALUES (?, ?)
        `;

        connectionComercial.query(
            sql,
            [nome_cliente, fk_id_localizacao],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao cadastrar cliente.');
                }
                return res.status(201).json({ id_cliente: result.insertId });
            }
        );
    }

    // ==========================
    // CADASTRAR VENDEDOR
    // ==========================
    async criarVendedor(req, res) {
        const { nome_vendedor } = req.body;

        if (!nome_vendedor) {
            return res.status(400).send('Nome do vendedor é obrigatório.');
        }

        const sql = `
            INSERT INTO vendedor (nome_vendedor)
            VALUES (?)
        `;

        connectionComercial.query(
            sql,
            [nome_vendedor],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao cadastrar vendedor.');
                }
                return res.status(201).json({ id_vendedor: result.insertId });
            }
        );
    }

    // ==========================
    // CADASTRAR PRODUTO
    // ==========================
    async criarProduto(req, res) {
        const { nome_produto, valor_unitario, fk_id_categoria } = req.body;

        if (!nome_produto || valor_unitario === undefined || !fk_id_categoria) {
            return res.status(400).send('Todos os campos do produto são obrigatórios.');
        }

        const sql = `
            INSERT INTO produto (nome_produto, valor_unitario, fk_id_categoria)
            VALUES (?, ?, ?)
        `;

        connectionComercial.query(
            sql,
            [nome_produto, valor_unitario, fk_id_categoria],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao cadastrar produto.');
                }
                return res.status(201).json({ id_produto: result.insertId });
            }
        );
    }

    // ==========================
    // CADASTRAR CATEGORIA
    // ==========================
    async criarCategoria(req, res) {
        const { nome_categoria } = req.body;

        if (!nome_categoria) {
            return res.status(400).send('Informe o nome da categoria.');
        }

        const sql = `INSERT INTO categoria (nome_categoria) VALUES (?)`;

        connectionComercial.query(sql, [nome_categoria], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao cadastrar categoria.');
            }
            return res.status(201).json({ id_categoria: result.insertId });
        });
    }

    // ==========================
    // CADASTRAR LOCALIZAÇÃO
    // ==========================
    async criarLocalizacao(req, res) {
        const { cidade, estado } = req.body;

        if (!cidade || !estado) {
            return res.status(400).send('Cidade e Estado são obrigatórios.');
        }

        const sql = `INSERT INTO localizacao (cidade, estado) VALUES (?, ?)`;

        connectionComercial.query(sql, [cidade, estado], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao cadastrar localização.');
            }
            return res.status(201).json({ id_localizacao: result.insertId });
        });
    }

    // ==========================
    // CADASTRAR TIPO PAGAMENTO
    // ==========================
    async criarTipoPagamento(req, res) {
        const { nome_tipo } = req.body;

        if (!nome_tipo) {
            return res.status(400).send('Informe o tipo de pagamento.');
        }

        const sql = `
            INSERT INTO tipo_pagamento (nome_tipo)
            VALUES (?)
        `;

        connectionComercial.query(
            sql,
            [nome_tipo],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao cadastrar tipo de pagamento.');
                }
                return res.status(201).json({ id_tipo_pagamento: result.insertId });
            }
        );
    }
}

export { RelatoriosController };