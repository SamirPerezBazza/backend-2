import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import userRoutes from './users/user.routes';
import orderRoutes from './orders/orders.routes';
import productRoutes from './products/products.routes';

config();

// Creacion del app
const app = express();

// Conexión a MongoDB usando mongoose
mongoose
  .connect(process.env.MONGO_URL || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected.');
  })
  .catch((err) => {
    console.log('There was an error with connection!');
    console.log(err);
  });

// Middlewares
app.use(cors());
app.use(express.json());

/* function unless(pred, middleware) {
  return (req, res, next) => {
    if (pred(req)) {
      next(); // Skip this middleware.
    } else {
      middleware(req, res, next); // Allow this middleware.
    }
  };
} */
// ignore maths from auth middleware
const unless = function (paths, middleware) {
  return function (req, res, next) {
    const pathCheck = paths.some((path) => path.path === req.path && path.method === req.method);
    pathCheck ? next() : middleware(req, res, next);
  };
};

/* app.use(
  unless(
    [
      { path: '/users', method: 'POST' },
      { path: '/users/login', method: 'POST' },
      { path: '/users/:id', method: 'GET' },
    ],
    authMiddleware
  )
); */

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Endpoint para 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found.' });
});

// Inicia app en puerto 8080
app.listen(8080);
