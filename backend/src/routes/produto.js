import { Router } from 'express'
import { listarProdutos } from '../controllers/ProdutoController.js'

const router = Router()

// Deixamos apenas a rota de listagem (GET)
router.get('/produtos', listarProdutos)

export default router