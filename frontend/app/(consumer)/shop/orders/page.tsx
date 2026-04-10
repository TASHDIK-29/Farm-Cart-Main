'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingData, setRatingData] = useState<{ [key: string]: { score: number, review: string } }>({});

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/orders/consumer/${user.id}`);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleRatingChange = (orderId: string, field: string, value: any) => {
    setRatingData({
      ...ratingData,
      [orderId]: { ...ratingData[orderId], [field]: value }
    });
  };

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: 'delivered' });
      if (res.data.success) {
        alert('Order marked as delivered!');
        fetchOrders();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update order status.');
    }
  };

  const submitRating = async (orderId: string, farmerId: string, status: string) => {
    if (status !== 'delivered') {
      alert("You can only rate an order after it has been delivered.");
      return;
    }
    const data = ratingData[orderId];
    if (!data || !data.score) {
      alert("Please provide a rating out of 10.");
      return;
    }
    try {
      const res = await api.post('/ratings', {
        orderId,
        consumerId: user?.id,
        farmerId,
        score: data.score,
        review: data.review || ''
      });
      if (res.data.success) {
        alert('Rating submitted! The farmer’s global rating has been updated.');
        fetchOrders(); // Assuming we'd track if rated in production, but let's just refresh.
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit rating.');
    }
  };

  if (loading) return <div className="text-center py-20">Loading your cart history...</div>;

  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-6 text-green-800 border-b pb-4">My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-gray-500 italic pb-6">You haven't made any purchases yet. Go to the shop to buy some fresh produce!</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 shadow-sm border border-gray-200 rounded-lg flex flex-col md:flex-row gap-6 justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Order ID: {order._id}</p>
                <div className="mb-2">
                  <h4 className="text-lg font-bold text-gray-800">Items:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-4 mb-2">
                    {order.items && order.items.map((item: any, idx: number) => (
                      <li key={idx}>
                        <span className="font-semibold">{item.productId?.title || 'Unknown Product'}</span> 
                        {' '} (Qty: {item.quantity}) - ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-green-700 font-medium my-1">Total: ${order.totalPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-700 mt-2">Farmer: <span className="font-semibold">{order.farmerId?.businessName || order.farmerId?.name}</span></p>
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                  <span className="font-semibold">Delivery Address:</span><br/>
                  {order.deliveryAddress || 'Not provided'}
                </div>
                <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wide">
                  {order.status}
                </span>
                <p className="text-xs text-gray-400 mt-2">Ordered at: {new Date(order.createdAt).toLocaleString()}</p>
              </div>

              {/* Rating Section strictly for demo */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 md:w-1/3">
                {order.status === 'shipping' && (
                  <button 
                    onClick={() => handleMarkAsDelivered(order._id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition text-sm shadow-sm mb-4"
                  >
                    Mark as Delivered
                  </button>
                )}
                <h5 className="text-sm font-bold text-gray-700 mb-2">Leave a Rating</h5>
                <label className="text-xs text-gray-500 block mb-1">Score (1-10)</label>
                <input 
                  type="number" 
                  min="1" max="10" 
                  className="w-full p-2 border rounded mb-2 text-sm"
                  placeholder="e.g. 10"
                  onChange={(e) => handleRatingChange(order._id, 'score', e.target.value)}
                  disabled={order.status !== 'delivered'}
                />
                <label className="text-xs text-gray-500 block mb-1">Review (Optional)</label>
                <textarea 
                  className="w-full p-2 border rounded mb-3 text-sm h-12"
                  placeholder="How was the product?"
                  onChange={(e) => handleRatingChange(order._id, 'review', e.target.value)}
                  disabled={order.status !== 'delivered'}
                ></textarea>
                <button 
                  onClick={() => submitRating(order._id, order.farmerId._id, order.status)}
                  disabled={order.status !== 'delivered'}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-4 rounded transition text-sm shadow-sm disabled:opacity-50"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
