import { Order } from './order.model.js';
import { Product } from '../product/product.model.js';

const createOrder = async (req, res) => {
  try {
    const { consumerId, farmerId, items, totalPrice, deliveryAddress } = req.body;
    
    if (!deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Delivery address is required' });
    }

    // Check product stock (decrement happens when farmer accepts)
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock or product not found for one of the items` });
      }
    }

    const newOrder = await Order.create({
      consumerId,
      farmerId,
      items,
      totalPrice,
      deliveryAddress,
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

    const order = await Order.findById(orderId);
    
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // When status changes from pending to shipping (or processing), farmer is accepting the order
    if (order.status === 'pending' && (status === 'shipping' || status === 'processing')) {
      // Phase 1: Verify all stock is still available before making any deductions
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: 'Insufficient stock to accept this order' });
        }
      }

      // Phase 2: Deduct stock after validation passes
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();
      }
    }

    order.status = status;
    await order.save();

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
      .populate('items.productId', 'title imageUrl')
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
      .populate('items.productId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const OrderController = { createOrder, getConsumerOrders, getFarmerOrders, updateOrderStatus };
