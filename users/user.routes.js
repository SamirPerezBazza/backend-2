import { authMiddleware } from '../middlewares/auth';
import { createUser, deleteUser, getUser, getUserCount, patchUser, login } from './user.controller';
import { Router } from 'express';
const router = Router();

// Endpoint GET /prueba
router.post('/login', login);
router.get('/count', getUserCount);
router.get('/:id', getUser);

// Endpoint POST /prueba
router.post('/', createUser);

router.put('/:id', authMiddleware, patchUser);

// Endpoint DELETE /prueba
router.delete('/:id', authMiddleware, deleteUser);

export default router;
