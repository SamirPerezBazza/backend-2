import Product from './products.model';

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
    });
    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: `Product ${req.params.id} not found` });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { userId, category, search } = req.query;

    let searchValues = [];

    if (userId) searchValues.push({ userId });
    if (category) searchValues.push({ category });
    if (search) searchValues.push({ name: { $regex: search || '', $options: 'i' } });

    const products = await Product.find(searchValues.length > 0 ? { $or: searchValues } : {}).sort({
      rating: -1,
    });
    if (!products) {
      return res.status(404).json({ message: `Products not found` });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.find({ userId: req.params.id }).distinct('category').sort({
      rating: -1,
    });
    if (!categories) {
      return res.status(404).json({ message: `Categories not found` });
    }
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: `Product ${req.params.id} not found` });
    }
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      enabled: false,
    });
    if (!product) {
      return res.status(404).json({ message: `Product ${req.params.id} not found` });
    }
    return res.status(200).json({ message: `Product ${req.params.id} disabled` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
