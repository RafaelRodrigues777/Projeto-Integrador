import { Router } from 'express'
import { RelatoriosController } from '../controllers/RegistroController.js'

const router = Router()
const controller = new RelatoriosController()

router.post('/dashboard/registro', controller.criar)

router.get('/clientes', controller.listarClientes)
router.get('/vendedores', controller.listarVendedores)
router.get('/produtos', controller.listarProdutos)
router.get('/tipos-pagamento', controller.listarTiposPagamento)

export default router