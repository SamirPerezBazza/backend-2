import { authMiddleware } from '../middlewares/auth';
import {
  createOrder,
  getOrders,
  getOrder,
  disableProducts,
  updateOrder,
} from './orders.controller';
import { Router } from 'express';
const router = Router();

// Endpoint GET /prueba ??? req.qyuery req.params
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrder);

// Endpoint POST /prueba
router.post('/', authMiddleware, createOrder);

// Endpoint PATCH /prueba
router.put('/', authMiddleware, updateOrder);

export default router;
