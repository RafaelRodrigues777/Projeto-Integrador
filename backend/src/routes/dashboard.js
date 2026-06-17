import express from 'express'
import { getFaturamento, getPedidos, getClientes, getProdutos, getProdutosMaisVendidos, getVendedoresReceita, getDesempenhoRegioes, getFaturamentoSatisfacao } from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/dashboard/faturamento', getFaturamento)
router.get('/dashboard/pedidos', getPedidos)
router.get('/dashboard/clientes', getClientes)
router.get('/dashboard/produtos', getProdutos)

router.get('/dashboard/produtos-mais-vendidos', getProdutosMaisVendidos)
router.get('/dashboard/vendedores-receita', getVendedoresReceita)
router.get('/dashboard/desempenho-regioes', getDesempenhoRegioes)
router.get('/dashboard/faturamento-satisfacao', getFaturamentoSatisfacao)

export default router