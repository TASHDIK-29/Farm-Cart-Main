import { Cart } from './cart.model.js';
import { Product } from '../product/product.model.js';

const addToCart = async (req, res) => {
  try {
    const { consumerId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock or product not found' });
    }

    let cartItem = await Cart.findOne({ consumerId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ consumerId, productId, quantity });
    }

    res.status(201).json({ success: true, message: 'Added to cart successfully', data: cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConsumerCart = async (req, res) => {
  try {
    const { consumerId } = req.params;
    const cartItems = await Cart.find({ consumerId }).populate({
      path: 'productId',
      populate: { path: 'farmerId', select: 'name businessName' },
    });

    res.status(200).json({ success: true, data: cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    await Cart.findByIdAndDelete(cartItemId);
    res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
       return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cartItem = await Cart.findById(cartItemId).populate('productId');
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (cartItem.productId.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    // Re-populate for response or just send updated
    res.status(200).json({ success: true, message: 'Quantity updated successfully', data: cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const CartController = { addToCart, getConsumerCart, removeFromCart, updateCartItemQuantity };
