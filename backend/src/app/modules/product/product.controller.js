import { Product } from './product.model.js';

const createProduct = async (req, res) => {
  try {
    const { farmerId, title, description, category, price, stock } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newProduct = await Product.create({
      farmerId,
      title,
      description,
      category,
      price: Number(price),
      stock: Number(stock),
      imageUrl,
    });

    res.status(201).json({ success: true, message: 'Product added successfully', data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFarmerProducts = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const products = await Product.find({ farmerId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const products = await Product.find(query)
      .populate('farmerId', 'name businessName averageRating location')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const ProductController = { createProduct, getFarmerProducts, getAllProducts };
