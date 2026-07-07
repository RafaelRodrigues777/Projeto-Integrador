import { Router } from 'express';
import { loginUser } from '../controllers/LoginController.js';

const router = Router();

// Define a rota POST /login na raiz do roteador
router.post('/login', loginUser);

export default router;