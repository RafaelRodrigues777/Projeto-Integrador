import { connectionComercial } from '../database/db.js'

class RelatoriosController {

  // Salva o novo registro no banco de dados
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
    } = req.body

    if (
      !data_pedido          ||
      !fk_id_cliente        ||
      !fk_id_vendedor       ||
      !fk_id_produto        ||
      !quantidade           ||
      !fk_id_tipo_pagamento ||
      nota_satisfacao === undefined
    ) {
      return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos.')
    }

    const sql = `
      INSERT INTO registro 
        (data_pedido, fk_id_cliente, fk_id_vendedor, fk_id_produto, quantidade, fk_id_tipo_pagamento, nota_satisfacao, observacao) 
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?)
    `

    connectionComercial.query(
      sql,
      [data_pedido, fk_id_cliente, fk_id_vendedor, fk_id_produto, quantidade, fk_id_tipo_pagamento, nota_satisfacao, observacao ?? null],
      (err, result) => {
        if (err) {
          console.error('Erro ao inserir registro:', err)
          return res.status(500).send('Erro ao salvar o registro no banco de dados.')
        }
        return res.status(201).send('Pedido registrado com sucesso!')
      }
    )
  }

  // Clientes para o <select> do front — DISTINCT evita repetições
  async listarClientes(req, res) {
    const sql = 'SELECT DISTINCT id_cliente, nome_cliente FROM cliente ORDER BY nome_cliente ASC'
    connectionComercial.query(sql, (err, results) => {
      if (err) return res.status(500).json({ erro: err.message })
      return res.json(results)
    })
  }

  // Vendedores para o <select> do front — DISTINCT evita repetições
  async listarVendedores(req, res) {
    const sql = 'SELECT DISTINCT id_vendedor, nome_vendedor FROM vendedor ORDER BY nome_vendedor ASC'
    connectionComercial.query(sql, (err, results) => {
      if (err) return res.status(500).json({ erro: err.message })
      return res.json(results)
    })
  }

  // Produtos para o <select> do front
  async listarProdutos(req, res) {
    const sql = 'SELECT DISTINCT id_produto, nome_produto FROM produto ORDER BY nome_produto ASC'
    connectionComercial.query(sql, (err, results) => {
      if (err) return res.status(500).json({ erro: err.message })
      return res.json(results)
    })
  }

  // Tipos de pagamento para o <select> do front
  async listarTiposPagamento(req, res) {
    const sql = 'SELECT DISTINCT id_tipo_pagamento, nome_tipo FROM tipo_pagamento ORDER BY nome_tipo ASC'
    connectionComercial.query(sql, (err, results) => {
      if (err) return res.status(500).json({ erro: err.message })
      return res.json(results)
    })
  }
}

export { RelatoriosController }