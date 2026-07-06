import { Router } from 'express';
import { RelatoriosController } from '../controllers/RegistroController.js';

const router = Router();
const controller = new RelatoriosController();

// ==========================
// REGISTRO (PEDIDO)
// ==========================
router.post('/dashboard/registro', controller.criar.bind(controller));

// ==========================
// LISTAGENS
// ==========================
router.get('/clientes', controller.listarClientes.bind(controller));
router.get('/vendedores', controller.listarVendedores.bind(controller));
router.get('/produtos', controller.listarProdutos.bind(controller));
router.get('/tipos-pagamento', controller.listarTiposPagamento.bind(controller));

// ==========================
// CADASTROS
// ==========================
router.post('/clientes', controller.criarCliente.bind(controller));

router.post('/vendedores', controller.criarVendedor.bind(controller));

router.post('/produtos', controller.criarProduto.bind(controller));

router.post('/categorias', controller.criarCategoria.bind(controller));

router.post('/localizacoes', controller.criarLocalizacao.bind(controller));

router.post('/tipos-pagamento', controller.criarTipoPagamento.bind(controller));

export default router;