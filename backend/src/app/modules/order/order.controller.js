import { Order } from './order.model.js';
import { Product } from '../product/product.model.js';

const createOrder = async (req, res) => {
  try {
    const { consumerId, farmerId, productId, quantity, totalPrice } = req.body;
    
    // Decrement product stock
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock or product not found' });
    }
    product.stock -= quantity;
    await product.save();

    const newOrder = await Order.create({
      consumerId,
      farmerId,
      productId,
      quantity,
      totalPrice,
      status: 'pending' // Update to pending status
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipping', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getConsumerOrders = async (req, res) => {
  try {
    const { consumerId } = req.params;
    const orders = await Order.find({ consumerId })
      .populate('farmerId', 'name businessName')
      .populate('productId', 'title imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFarmerOrders = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const orders = await Order.find({ farmerId })
      .populate('consumerId', 'name email')
      .populate('productId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const OrderController = { createOrder, getConsumerOrders, getFarmerOrders, updateOrderStatus };
