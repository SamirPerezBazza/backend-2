const request = require('supertest');
const testConfig = require('../../testConfig');
beforeAll(async () => {
  await testConfig.setupDatabase();
});

const {deleteProduct, updateProduct, getProductCategories, getProducts, getProduct, createProduct } = require('../../products/products.controller.js');


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



describe('Prueba unitaria del método getProduct (controlador) - respuesta exitosa', () => {
    test('Debería retornar un producto y un status 200', async () => {
      // Arrange
      const productId = '123456789'; // ID del producto a obtener
      const productData = {
        // Datos del producto a crear
        name: 'product example',
        comments: 'mensaje',
        category: [],
        price: 5000,
        rating: 10,
        userId: 1,
        enabled: true,
      };
      await Product.create({ _id: productId, ...productData }); // Crear el producto en la base de datos
  
      const req = {
        params: {
          id: productId,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Act
      await getProduct(req, res);
  
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(productData));
    });
  });


  
describe('Prueba unitaria del método getProducts (controlador) - respuesta exitosa', () => {
    test('Debería retornar una lista de productos y un status 200', async () => {
      // Arrange
      const product1 = {
        name: 'Product 1',
        category: ['Category A'],
        price: 100,
        rating: 4.5,
        userId: 'user1',
        enabled: true,
      };
  
      const product2 = {
        name: 'Product 2',
        category: ['Category B'],
        price: 200,
        rating: 3.8,
        userId: 'user2',
        enabled: true,
      };
  
      await Product.create(product1);
      await Product.create(product2);
  
      const req = {
        query: {
          userId: 'user1', // Filtro por userId
          category: 'Category A', // Filtro por categoría
          search: '', // Sin filtro de búsqueda
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Act
      await getProducts(req, res);
  
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining(product1),
        ])
      );
      expect(res.json).not.toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining(product2),
        ])
      );
    });
  });


  describe('Prueba unitaria del método getProductCategories (controlador) - respuesta exitosa', () => {
    test('Debería retornar una lista de categorías y un status 200', async () => {
      // Arrange
      const userId = 'user1'; // ID del usuario
      const category1 = 'Category A';
      const category2 = 'Category B';
  
      await Product.create({
        name: 'Product 1',
        category: [category1],
        userId: userId,
      });
  
      await Product.create({
        name: 'Product 2',
        category: [category1, category2],
        userId: userId,
      });
  
      const req = {
        params: {
          id: userId,
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Act
      await getProductCategories(req, res);
  
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([category1, category2]));
    });
  });

  describe('Prueba unitaria del método updateProduct (controlador) - respuesta exitosa', () => {
    test('Debería retornar el producto actualizado y un status 200', async () => {
      // Arrange
      const productId = 'product1';
      const updatedProductData = {
        name: 'Updated Product',
        price: 200,
      };
  
      await Product.create({
        _id: productId,
        name: 'Product',
        price: 100,
      });
  
      const req = {
        params: {
          id: productId,
        },
        body: updatedProductData,
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Act
      await updateProduct(req, res);
  
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ product: updatedProductData }));
    });
  });


  
describe('Prueba unitaria del método deleteProduct (controlador) - respuesta exitosa', () => {
    test('Debería retornar un mensaje de producto deshabilitado y un status 200', async () => {
      // Arrange
      const productId = 'product1';
  
      await Product.create({
        _id: productId,
        name: 'Product',
        enabled: true,
      });
  
      const req = {
        params: {
          id: productId,
        },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      // Act
      await deleteProduct(req, res);
  
      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: `Product ${productId} disabled` });
    });
  });