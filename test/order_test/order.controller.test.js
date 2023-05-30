const testConfig = require('../../testConfig');
beforeAll(async () => {
  await testConfig.setupDatabase();
});
const { createOrder, getOrder } = require('../../orders/orders.controller.js');
const mongoose = require('mongoose');

//Create
describe('Prueba unitaria del método createOrder (controlador) - respuesta exitosa', () => {
  test('Debería crear una orden y retornar un status 201', async () => {
    const req = {
      userId: '64752c8a37f9362bd3dc4bb3', // ID del usuario actual
      body: {
        client: '64752c8a37f9362bd3dc4bb3', // ID del cliente
        seller: '64700c8a37f9362bd3dc4bb3', // ID del vendedor
        product: '647523e46d180c30b8de47aa', // ID del producto
        amount: 2,
        comments: 'Comentarios adicionales',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order created',
      order: expect.objectContaining({
        client: new mongoose.Types.ObjectId('64752c8a37f9362bd3dc4bb3'), // ID del cliente
        seller: new mongoose.Types.ObjectId('647523a96d180c30b8de47a6'), // ID del vendedor
        product: new mongoose.Types.ObjectId('647523e46d180c30b8de47aa'), // ID del producto
        amount: 2,
        comments: 'Comentarios adicionales',
      }),
    });
  });
});

describe('Prueba unitaria del método createOrder (controlador) - respuesta errónea', () => {
  test('Debería retornar un status 500 con un mensaje de error', async () => {
    const req = {
      userId: '64752c8a37f9362bd3dc4bb3', // ID del usuario actual
      body: {
        client: '64752c8a37f9362bd3dc4bb3', // ID del cliente
        seller: '64700c8a37f9362bd3dc4bb3', // ID del producto
        amount: 2,
        comments: 'Comentarios adicionales',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Product is required' });
  });
});

//read

describe('Prueba unitaria del método getOrder (controlador) - respuesta exitosa', () => {
  test('Debería retornar una orden y un status 200', async () => {
    const req = {
      userId: '64752c8a37f9362bd3dc4bb3', // ID del usuario actual
      params: {
        id: '6475486dd95055414e70f68d', // ID de la orden a buscar
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        client: new mongoose.Types.ObjectId('64752c8a37f9362bd3dc4bb3'), // ID del cliente
        product: new mongoose.Types.ObjectId('647523e46d180c30b8de47aa'), // ID del producto
      })
    );
  });
});

describe('Prueba unitaria del método getOrder (controlador) - respuesta errónea', () => {
  test('Debería retornar un status 500 con un mensaje de error', async () => {
    const req = {
      userId: '64752c8a37f9362bd3dc4bb2', // ID del usuario actual
      params: {
        id: '6475486dd95055414e70f68d', // ID de la orden a buscar
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await getOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
  });
});
