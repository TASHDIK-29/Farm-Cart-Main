'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const { data } = await api.get(`/cart/${user?.id}`);
      setCartItems(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutFarmer = async (farmerId: string, items: any[]) => {
    if (!deliveryAddress.trim()) {
      toast.error('Please provide a delivery address before checkout.');
      return;
    }
    
    try {
      const orderItems = items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      }));
      
      const totalPrice = items.reduce((sum, item) => sum + (item.quantity * item.productId.price), 0);

      const orderPayload = {
        consumerId: user?.id,
        farmerId: farmerId,
        items: orderItems,
        totalPrice,
        deliveryAddress,
      };

      const { data } = await api.post('/orders', orderPayload);
      if (data.success) {
        toast.success(`Order placed with farmer successfully!`);
        for (const item of items) {
          await handleRemove(item._id, false); // Clear item from cart after checkout without individual toasts
        }
        toast.success('Cart updated');
        loadCart();
      }
    } catch (error) {
      toast.error('Checkout failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRemove = async (cartItemId: string, showToast = true) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      setCartItems(prev => prev.filter(item => item._id !== cartItemId));
      if (showToast) toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) return;
    try {
      const { data } = await api.patch(`/cart/${cartItemId}`, { quantity: newQuantity });
      if (data.success) {
        setCartItems(prev => prev.map(item => item._id === cartItemId ? { ...item, quantity: newQuantity } : item));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your cart...</div>;

  const groupedCartItems = cartItems.reduce((acc, item) => {
    const farmerId = item.productId.farmerId._id;
    if (!acc[farmerId]) {
      acc[farmerId] = {
        farmerId: farmerId,
        farmerName: item.productId.farmerId.businessName || item.productId.farmerId.name,
        items: []
      };
    }
    acc[farmerId].items.push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Your Shopping Cart</h1>
      
      {Object.keys(groupedCartItems).length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">
          Your cart is currently empty. Head over to the shop to find fresh produce!
        </div>
      ) : (
        <div className="space-y-10">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Details</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address <span className="text-red-500">*</span></label>
            <textarea
              rows={3}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your full delivery address"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          {Object.values(groupedCartItems).map((group: any) => {
            const groupTotal = group.items.reduce((sum, item) => sum + (item.quantity * item.productId.price), 0);

            return (
              <div key={group.farmerId} className="bg-white rounded-xl shadow p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Order from: {group.farmerName}</h2>
                  <button
                    onClick={() => handleCheckoutFarmer(group.farmerId, group.items)}
                    className="bg-green-600 text-white font-medium py-2 px-6 rounded shadow hover:bg-green-700 transition"
                  >
                    Checkout all from {group.farmerName} (${groupTotal.toFixed(2)})
                  </button>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <div key={item._id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800 line-clamp-1">{item.productId.title}</h3>
                        <p className="text-green-700 font-semibold mt-1 text-lg">
                          ${item.productId.price} <span className="text-sm font-normal text-gray-500">/{item.productId.unit}</span>
                        </p>
                        <div className="mt-4 p-3 bg-white rounded text-sm text-gray-700 flex justify-between items-center shadow-sm">
                            <span className="flex items-center gap-2">
                              Quantity:
                              <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300">-</button>
                              <strong className="text-gray-900 w-4 text-center">{item.quantity}</strong>
                              <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300">+</button>
                            </span>
                            <span>Total: <strong className="text-gray-900">${(item.quantity * item.productId.price).toFixed(2)}</strong></span>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex flex-col gap-2">
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="w-full bg-red-50 text-red-600 font-medium py-2 px-4 rounded shadow-sm hover:bg-red-100 transition"
                        >
                          Remove from Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}