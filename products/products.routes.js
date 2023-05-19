import { authMiddleware } from '../middlewares/auth';
import {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  getProductCategories,
} from './products.controller';
import { Router } from 'express';
const router = Router();

// Endpoint GET /prueba
router.get('/', getProducts);
router.get('/:id', getProduct); // Read unidad
router.get('/:id/categories', getProductCategories); // Read categories from user

// Endpoint POST /prueba
router.post('/', authMiddleware, createProduct); // create

// Endpoint PATCH /prueba
router.put('/:id', authMiddleware, updateProduct); // update

// Endpoint DELETE /prueba
router.delete('/:id', authMiddleware, deleteProduct); // delete

export default router;
