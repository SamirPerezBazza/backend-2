const request = require('supertest');
const testConfig = require('../../testConfig.js');
beforeAll(async () => {
  await testConfig.setupDatabase();
});
import app from '../../index.js';
const http = require('http');
//create

let server;
beforeAll((done) => {
  const port = 8081;
  server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
    done();
  });
});

afterAll((done) => {
  server.close(done);
});
//read

describe('Prueba unitaria del endpoint GET /users/:id - respuesta exitosa', () => {
  test('Debería obtener el usuario y retornar un status 200', async () => {
    const response = await request(app).get('/users/6473c9c21291c91d965b1d22');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        _id: '6473c9c21291c91d965b1d22',
        email: 'test@example.com',
        phone: '789546',
        password: 'password123',
        address: [],
        name: 'expample',
        enable: true,
      })
    );
  });
});

describe('Prueba unitaria del endpoint GET /users/:id - respuesta errónea', () => {
  test('Debería retornar un status 500 con un mensaje de error', async () => {
    const response = await request(app).get('/users/123');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: expect.any(String) });
  });
});

describe('Prueba unitaria del endpoint GET /users/count - respuesta exitosa', () => {
  test('Debería obtener el número de usuarios y retornar un status 200', async () => {
    const response = await request(app).get('/users/count');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ users: expect.any(Number) });
  });
});

//create
describe('Prueba unitaria del endpoint POST /users - respuesta exitosa', () => {
  test('Debería crear un usuario y retornar un status 200', async () => {
    const response = await request(app).post('/users/').send({
      email: 'test@example.com',
      phone: '123456789',
      password: 'password123',
      address: [],
      name: 'John Doe',
      enable: true,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
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
describe('Prueba unitaria del endpoint POST /users - respuesta errónea', () => {
  test('Debería retornar un status 500 con un mensaje de error', async () => {
    const response = await request(app).post('/users/').send({
      email: 'test@example.com',
      phone: '123456789',
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: expect.any(String) });
  });
});

//update

describe('Prueba unitaria del endpoint PUT /users/:id - respuesta exitosa', () => {
  test('Debería actualizar el usuario y retornar un status 200', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDcxNWIyYTM1N2Q2M2FkZDBiMTc2NDYiLCJpYXQiOjE2ODUyMjcwMDl9.FMlruRjos6q7CLW7eB-ir9ZkquCQNypmoXijWYc4Vn4';
    const response = await request(app)
      .put('/users/647277e0f5a30ed11da08336/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: [
          { address: 'Calle 123', city: 'Ciudad A' },
          { address: 'Calle 456', city: 'Ciudad B' },
        ],
        phone: '0000000',
        password: 'newpassword',
        name: 'newname',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: expect.objectContaining({
        _id: '647277e0f5a30ed11da08336',
        address: [expect.any(String), expect.any(String)], //los string pertenecen a los id de las direcciones
        phone: '0000000',
        password: 'newpassword',
        name: 'newname',
      }),
    });
  });
});

describe('Prueba unitaria del endpoint PUT /users/:id - respuesta errónea', () => {
  test('Debería retornar un status 500 con un mensaje de error', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDcxNWIyYTM1N2Q2M2FkZDBiMTc2NDYiLCJpYXQiOjE2ODUyMjcwMDl9.FMlruRjos6q7CLW7eB-ir9ZkquCQNypmoXijWYc4Vn4';
    const response = await request(app)
      .put('/users/647277e0f5a30ed11da08336/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 12345,
        address: 'main St',
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: expect.any(String) });
  });
});

//delete

describe('Prueba unitaria del endpoint DELETE /users/:id - respuesta exitosa', () => {
  test('Debería deshabilitar el usuario y retornar un status 200', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDcxNWIyYTM1N2Q2M2FkZDBiMTc2NDYiLCJpYXQiOjE2ODUyMjcwMDl9.FMlruRjos6q7CLW7eB-ir9ZkquCQNypmoXijWYc4Vn4';
    const response = await request(app)
      .delete('/users/6473c2290a3053c7b54b953d')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User disabled' });
  });
});

describe('Prueba unitaria del endpoint DELETE /users/:id - respuesta errónea', () => {
  test('Debería retornar un status 500 con un mensaje de error', async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDcxNWIyYTM1N2Q2M2FkZDBiMTc2NDYiLCJpYXQiOjE2ODUyMjcwMDl9.FMlruRjos6q7CLW7eB-ir9ZkquCQNypmoXijWYc4Vn4';
    const response = await request(app)
      .delete('/users/123')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: expect.any(String) });
  });
});
