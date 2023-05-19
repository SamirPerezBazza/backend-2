import Orders from './orders.model.js';
import Products from '../products/products.model.js';

export const createOrder = async (req, res) => {
  try {
    const { client, restaurant, products: productList } = req.body;

    //products: {id: "1", quantity: 2}
    const productIds = productList.map((product) => product.id);

    const products = await Products.find({ _id: { $in: productIds } }).lean();

    if (!products) {
      return res.status(404).json({ message: `Products not found` });
    }

    const mappedProducts = products.map((product) => ({
      ...product,
      quantity: productList.find((p) => p.id == product._id).quantity,
    }));

    const total = mappedProducts.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    const order = await Orders.create({
      client,
      restaurant,
      total,
      products: mappedProducts,
    });

    return res.status(201).json({ message: 'Order created' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Orders.findById(id);

    if (!order) {
      return res.status(404).json({ message: `Order ${id} not found` });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Orders.find();

    if (!orders) {
      return res.status(404).json({ message: `Orders not found` });
    }
    const filteredOrders = orders.filter((order) => order.status == 0);

    return res.status(200).json(filteredOrders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id, status, products: productList = [], ...otherValues } = req.body;
    // use bits 1 | 2 | 4 | 8 | 16
    // 0: pending
    // 1: accepted
    // 2: ready for pickup
    // 3: on the way
    // 4: delivered

    const order = await Orders.findById(id);

    // Order not found
    if (!order) {
      return res.status(404).json({ message: `Order ${id} not found` });
    }

    // Order already cancelled
    if (order.status == 5) {
      return res.status(403).json({ message: `Order ${id} has been cancelled` });
    }

    if (order.status == 4) {
      return res.status(403).json({ message: `Order ${id} has been delivered` });
    }

    // Order immutable once sent
    if (order.status >= 3 && productList?.length > 1) {
      return res.status(403).json({ message: `Order cannot be changed once sent` });
    }

    // Order cannot be set to "on the way" without a delivery person
    if (status == 3 && !order.dasher) {
      return res.status(403).json({ message: `Order cannot be sent without a delivery person` });
    }

    const productIds = productList.map((product) => product.id);

    const products = await Products.find({ _id: { $in: productIds } }).lean();

    if (!products) {
      return res.status(404).json({ message: `Products not found` });
    }

    const mappedProducts = products.map((product) => ({
      ...product,
      quantity: productList.find((p) => p.id == product._id).quantity,
    }));

    const total = mappedProducts.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    const updatedOrder = await Orders.findByIdAndUpdate(id, {
      status,
      products: status < 3 ? mappedProducts : order.products,
      total: status < 3 ? total : order.total,
      ...otherValues,
    });

    return res.status(200).json({ message: `Order ${id} updated successfully` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const disableProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.query;

    const currentOrder = await Orders.findById(id).lean();

    if (!currentOrder) {
      return res.status(403).json({ message: `Order ${id} not found` });
    }

    if (currentOrder.status >= 3) {
      return res.status(403).json({
        message: `Products cannot be changed once the order has been sent, delivered or canceled`,
      });
    }

    const newProducts = currentOrder.products.map((product) => ({
      ...product,
      enabled: product._id.toString() !== productId,
    }));

    const order = await Orders.findByIdAndUpdate(id, {
      products: newProducts,
    });

    return res.status(200).json({ message: `Product ${productId} disabled successfully` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
