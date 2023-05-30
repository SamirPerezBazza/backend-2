import Orders from './orders.model.js';
import Products from '../products/products.model.js';

export const createOrder = async (req, res) => {
  try {
    const { client, product, amount, comments = '' } = req.body;

    if (client !== req.userId) return res.status(403).json({ message: 'Forbidden' });

    if (!client) return res.status(400).json({ message: 'Client is required' });
    // if (!seller) return res.status(400).json({ message: 'Seller is required' });
    if (!product) return res.status(400).json({ message: 'Product is required' });
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    const dbProduct = await Products.findById(product);

    const total = dbProduct.price * amount;

    const order = await Orders.create({
      client,
      seller: dbProduct.userId,
      total,
      product,
      amount,
      comments,
    });

    return res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Orders.findById(id);

    if (order.client.toString() !== req.userId)
      return res.status(403).json({ message: 'Forbidden' });

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
    const { client, startDate, endDate } = req.query;

    let searchValues = [];
    const createdAt = {};

    console.log(endDate);

    if (client) searchValues.push({ client });
    if (startDate) createdAt['$gte'] = new Date(`${startDate}T00:00:00.000Z`);
    if (endDate) createdAt['$lte'] = new Date(`${endDate}T23:59:59.999Z`);
    if (startDate || endDate) searchValues.push({ createdAt });

    console.log(createdAt);

    const orders = await Orders.find(searchValues.length > 0 ? { $or: searchValues } : {});

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id, client, seller, ...otherValues } = req.body;

    if (client !== req.userId) return res.status(403).json({ message: 'Forbidden' });

    const order = await Orders.findById(id);

    // Order not found
    if (!order) {
      return res.status(404).json({ message: `Order ${id} not found` });
    }

    // Order already cancelled
    if (order.status === 4) {
      return res.status(403).json({ message: `Order ${id} has been cancelled` });
    }

    if (order.status === 3) {
      return res.status(403).json({ message: `Order ${id} has been delivered` });
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      id,
      {
        ...otherValues,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: `Order ${id} updated successfully`, order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const disableProducts = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { productId } = req.query;

//     const currentOrder = await Orders.findById(id).lean();

//     if (!currentOrder) {
//       return res.status(403).json({ message: `Order ${id} not found` });
//     }

//     if (currentOrder.status >= 3) {
//       return res.status(403).json({
//         message: `Products cannot be changed once the order has been sent, delivered or canceled`,
//       });
//     }

//     const newProducts = currentOrder.products.map((product) => ({
//       ...product,
//       enabled: product._id.toString() !== productId,
//     }));

//     const order = await Orders.findByIdAndUpdate(id, {
//       products: newProducts,
//     });

//     return res.status(200).json({ message: `Product ${productId} disabled successfully` });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
