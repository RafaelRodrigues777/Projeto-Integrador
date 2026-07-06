import { Router } from 'express'
import { RelatoriosController } from '../controllers/RegistroController.js'

const router = Router()
const controller = new RelatoriosController()

router.post('/dashboard/registro',  controller.criar.bind(controller))
router.get('/clientes',             controller.listarClientes.bind(controller))
router.get('/vendedores',           controller.listarVendedores.bind(controller))
router.get('/produtos',             controller.listarProdutos.bind(controller))
router.get('/tipos-pagamento',      controller.listarTiposPagamento.bind(controller))

export default router