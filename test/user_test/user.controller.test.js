const request = require('supertest');
const testConfig = require('../../testConfig');
beforeAll(async () => {
  await testConfig.setupDatabase();
});
const { login, getUser, createUser } = require('../../users/user.controller.js');
describe('Prueba unitaria del método createUser (controlador) - respuesta exitosa', () => {
  test('Debería retornar un usuario y un status 200', async () => {
    // Arrange
    const req = {
      body: {
        email: 'test@example.com',
        phone: '123456789',
        password: 'password123',
        address: [],
        name: 'John Doe',
        enable: true,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Act
    await createUser(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        phone: '123456789',
        password: 'password123',
        address: [],
        name: 'John Doe',
        enable: true,
      })
    );
  });
});
