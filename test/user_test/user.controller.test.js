const testConfig = require('../../testConfig');
beforeAll(async () => {
  await testConfig.setupDatabase();
});
const {
  getUser,
  createUser,
  patchUser,
  deleteUser,
  getUserCount,
} = require('../../users/user.controller.js');
//Read test

describe('Prueba unitaria del método getUser (controlador) - respuesta exitosa', () => {
  test('Debería obtener el usuario y retornar un status 200', async () => {
    const req = {
      params: { id: '6473c9c21291c91d965b1d22' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '6473c9c21291c91d965b1d22',
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

describe('Prueba unitaria del método getUser (controlador) - respuesta errónea', () => {
  test('Debería retornar un status 500 con un mensaje de error', async () => {
    const req = {
      params: { id: '123' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
  });
});

describe('Prueba unitaria del método getUserCount (controlador) - respuesta exitosa', () => {
  test('Debería obtener el número de usuarios y retornar un status 200', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getUserCount(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ users: expect.any(Number) });
  });
});

describe('Prueba unitaria del método getUserCount (controlador) - respuesta erronea', () => {
  test('esta prueba no aplica porque no requiere que se le introduzca ningun dato por ende no falla', async () => {
    //no aplica
  });
});

//Create test

describe('Prueba unitaria del método createUser (controlador) - respuesta exitosa', () => {
  test('Debería retornar un usuario y un status 200', async () => {
    const mail = generateRandomEmail();
    const req = {
      body: {
        email: mail,
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

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mail,
        phone: '123456789',
        password: 'password123',
        address: [],
        name: 'John Doe',
        enable: true,
      })
    );
  });
});

describe('Prueba unitaria del método createUser (controlador) - respuesta errónea', () => {
  test('Debería retornar un status 400 con un mensaje de error', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        phone: '123456789',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
  });
});

//update

describe('Prueba unitaria del método patchUser (controlador) - respuesta exitosa', () => {
  test('Debería actualizar el usuario y retornar un status 200', async () => {
    const req = {
      params: { id: '647277e0f5a30ed11da08336' },
      body: {
        address: [
          { address: 'Calle 123', city: 'Ciudad A' },
          { address: 'Calle 456', city: 'Ciudad B' },
        ],
        phone: '0000000',
        password: 'newpassword',
        name: 'newname',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await patchUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({
          id: '647277e0f5a30ed11da08336',
          address: [expect.any(Object), expect.any(Object)], //los object pertenecen a los id de las direcciones
          phone: '0000000',
          password: 'newpassword',
          name: 'newname',
        }),
      })
    );
  });
});

describe('Prueba unitaria del método patchUser (controlador) - respuesta errónea', () => {
  test('Debería retornar un status 500 con un mensaje de error', async () => {
    const req = {
      params: { id: '647277e0f5a30ed11da08336' },
      body: {
        name: 12345,
        address: 'main St',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await patchUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
  });
});

//delete

describe('Prueba unitaria del método deleteUser (controlador) - respuesta exitosa', () => {
  test('Debería deshabilitar el usuario y retornar un status 200', async () => {
    const req = {
      params: { id: '647277e0f5a30ed11da08336' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User disabled' });
  });
});

describe('Prueba unitaria del método deleteUser (controlador) - respuesta errónea', () => {
  test('Debería retornar un status 500 con un mensaje de error', async () => {
    const req = {
      params: { id: '123' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
  });
});

function generateRandomEmail() {
  const name = Math.random().toString(36).substring(2, 10); // Genera un nombre aleatorio
  const domain = Math.random().toString(36).substring(2, 10); // Genera un dominio aleatorio
  const email = `${name}@${domain}.com`; // Combina el nombre y el dominio

  return email;
}
