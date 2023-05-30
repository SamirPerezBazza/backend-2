const request = require('supertest');
const testConfig = require('../../testConfig');
const mongoose = require('mongoose');
beforeAll(async () => {
  await testConfig.setupDatabase();
});
import app from '../../index.js';
const http = require('http');

//create

let server;
beforeAll((done) => {
  const port = 3030;
  server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
    done();
  });
});

afterAll((done) => {
  server.close(done);
});
describe('Prueba unitaria del endpoint POST /orders - respuesta exitosa', () => {
  test('Debería crear una orden y retornar un status 201', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDc1MmM4YTM3ZjkzNjJiZDNkYzRiYjMiLCJpYXQiOjE2ODU0MDA3Mjl9.tJKthFcgDHMDM5M1Ye49dmlKl3VU3shJ3HWZxyzWlII';
    const response = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        client: '64752c8a37f9362bd3dc4bb3', // ID del cliente
        seller: '647523a96d180c30b8de47a6', // ID del vendedor
        product: '647523e46d180c30b8de47aa', // ID del producto
        amount: 2,
        comments: 'Comentarios adicionales',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Order created',
        order: expect.objectContaining({
          client: '64752c8a37f9362bd3dc4bb3', // ID del cliente
          seller: '647523a96d180c30b8de47a6', // ID del vendedor
          product: '647523e46d180c30b8de47aa', // ID del producto
          amount: 2,
          comments: 'Comentarios adicionales',
        }),
      })
    );
  });
});

describe('Prueba unitaria del endpoint POST /orders - respuesta errónea', () => {
  test('Debería retornar un status 500 con un mensaje de error', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDc1MmM4YTM3ZjkzNjJiZDNkYzRiYjMiLCJpYXQiOjE2ODU0MDA3Mjl9.tJKthFcgDHMDM5M1Ye49dmlKl3VU3shJ3HWZxyzWlII';
    const response = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        client: '64752c8a37f9362bd3dc4bb3', // ID del cliente
        seller: '647523a96d180c30b8de47a6', // ID del vendedor
        amount: 2,
        comments: 'Comentarios adicionales',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Product is required' });
  });
});

//read

describe('Prueba unitaria del endpoint GET /orders/:id - respuesta exitosa', () => {
  test('Debería retornar una orden y un status 200', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDc1MmM4YTM3ZjkzNjJiZDNkYzRiYjMiLCJpYXQiOjE2ODU0MDA3Mjl9.tJKthFcgDHMDM5M1Ye49dmlKl3VU3shJ3HWZxyzWlII';
    const response = await request(app)
      .get('/orders/6475486dd95055414e70f68d')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        client: '64752c8a37f9362bd3dc4bb3', // ID del cliente
        product: '647523e46d180c30b8de47aa', // ID del producto
      })
    );
  });
});

describe('Prueba unitaria del endpoint GET /orders/:id - respuesta exitosa', () => {
  test('Debería retornar una orden y un status 200', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDcxNWIyYTM1N2Q2M2FkZDBiMTc2NDYiLCJpYXQiOjE2ODU0MDg3MDN9.glHMPIllyugZzG5JqrxCfiM5qurbXVfM2BuJ76Tu7-M';
    const response = await request(app)
      .get('/orders/6475486dd95055414e70f68d')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Forbidden' });
  });
});
