import { Router } from 'express'
import { listarProdutos, excluirProduto } from '../controllers/ProdutoController.js'

const router = Router()

// Rota para buscar todos os produtos (usada para preencher a tabela)
router.get('/produtos', listarProdutos)

// Rota para excluir um produto individual pelo ID (ativada pelo botão de lixeira)
router.delete('/produtos/:id', excluirProduto)

export default router