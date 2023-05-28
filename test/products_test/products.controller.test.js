const request = require('supertest');
const testConfig = require('../../testConfig');
beforeAll(async () => {
  await testConfig.setupDatabase();
});

const {getProduct, createProduct } = require('../../products/products.controller.js');
describe('Prueba unitaria del método createProduct (controlador) - respuesta exitosa', () => {
  test('Debería retornar un producto y un status 200', async () => {
    // Arrange
    const req = {
      body: {
        name: 'product example',
        comments: 'mensaje',
        category: [],
        price: 5000,
        rating: 10,
        userId: 1,
        enabled: true,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Act
    await createProduct(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'product example',
        comments: 'mensaje',
        category: [],
        price: 5000,
        rating: 10,
        userId: 1,
        enabled: true,
      })
    );
  });
});
