'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function FarmerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const { data } = await api.get(`/orders/farmer/${user?.id}`);
      setOrders(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status });
      if (data.success) {
        toast.success(`Order marked as ${status}`);
        loadOrders();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Manage Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">
          No orders received yet. 
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
             <div key={order._id} className="bg-white p-6 shadow-sm border border-gray-200 rounded-lg flex flex-col md:flex-row gap-6 justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Order ID: {order._id}</p>
                <div className="mb-2">
                  <h4 className="text-lg font-bold text-gray-800">Items Ordered:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-4 mb-2">
                    {order.items && order.items.map((item: any, idx: number) => (
                      <li key={idx}>
                        <span className="font-semibold">{item.productId?.title || 'Unknown Product'}</span> 
                        {' '} (Qty: {item.quantity}) - ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-green-700 font-medium my-1">Total Earned: ${order.totalPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-700 mt-2">Customer: <span className="font-semibold">{order.consumerId?.name?.firstName || order.consumerId?.name} ({order.consumerId?.email})</span></p>
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                  <span className="font-semibold">Delivery Address:</span><br/>
                  {order.deliveryAddress || 'Not provided'}
                </div>
                <p className="text-xs text-gray-400 mt-2">Ordered at: {new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex flex-col gap-2 md:w-1/4">
                 <div className="mb-2">
                   <h5 className="font-bold text-sm text-gray-600 mb-1">Current Status:</h5>
                   <span className={`inline-block px-3 py-1 font-bold text-xs rounded-full uppercase tracking-wide
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'shipping' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                   `}>
                     {order.status}
                   </span>
                 </div>
                 
                 {order.status === 'pending' && (
                   <button
                     onClick={() => handleUpdateStatus(order._id, 'shipping')}
                     className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded shadow-sm text-sm transition"
                   >
                     Accept & Ship Order
                   </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}