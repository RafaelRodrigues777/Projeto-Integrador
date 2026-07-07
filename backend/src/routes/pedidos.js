import { Router } from 'express';
import { RelatoriosController } from '../controllers/RegistroController.js';

const router = Router();
const controller = new RelatoriosController();

// =========================================================================
// HISTÓRICO DE PEDIDOS
// =========================================================================

// Rota que alimenta a tabela do seu Frontend com todos os dados interligados
router.get('/dashboard/pedidos-detalhes', controller.listarPedidosCompletos.bind(controller));

export default router;