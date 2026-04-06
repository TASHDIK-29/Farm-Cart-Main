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

  const handleRemove = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      setCartItems(prev => prev.filter(item => item._id !== cartItemId));
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async (cartItem: any) => {
    try {
      const orderPayload = {
        consumerId: user?.id,
        farmerId: cartItem.productId.farmerId._id,
        productId: cartItem.productId._id,
        quantity: cartItem.quantity,
        totalPrice: cartItem.quantity * cartItem.productId.price,
      };

      const { data } = await api.post('/orders', orderPayload);
      if (data.success) {
        toast.success(`Order placed for ${cartItem.productId.title}!`);
        await handleRemove(cartItem._id); // Clear item from cart after checkout
      }
    } catch (error) {
      toast.error('Checkout failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your cart...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">
          Your cart is currently empty. Head over to the shop to find fresh produce!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow p-5 border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-gray-800 line-clamp-1">{item.productId.title}</h3>
                <p className="text-green-700 font-semibold mt-1 text-lg">
                  ${item.productId.price} <span className="text-sm font-normal text-gray-500">/{item.productId.unit}</span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Farmer: <span className="font-medium text-gray-800">{item.productId.farmerId?.businessName || item.productId.farmerId?.name}</span>
                </p>
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700 flex justify-between items-center shadow-inner">
                    <span>Quantity: <strong className="text-gray-900">{item.quantity}</strong></span>
                    <span>Total: <strong className="text-gray-900">${(item.quantity * item.productId.price).toFixed(2)}</strong></span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => handleCheckout(item)}
                  className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded shadow-sm hover:bg-green-700 transition"
                >
                  Checkout Item
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="w-full bg-red-50 text-red-600 font-medium py-2 px-4 rounded shadow-sm hover:bg-red-100 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}