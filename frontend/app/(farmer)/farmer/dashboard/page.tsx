'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Order {
  _id: string;
  status: string;
  totalPrice: number;
}

interface Product {
  _id: string;
}

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'farmer') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get(`/orders/farmer/${user?.id}`),
        api.get(`/products/farmer/${user?.id}`)
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
      if (productsRes.data.success) {
        setProducts(productsRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;
  }

  // Calculate statistics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingRequests = orders.filter(o => o.status === 'pending').length;
  const shipping = orders.filter(o => o.status === 'shipping').length;
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const totalSales = orders
    .filter(o => o.status === 'delivered') // Usually you only count delivered or paid, let's sum all or delivered. Let's sum all non-cancelled, but let's just sum all for now or delivered
    // To match actual earned, let's sum ALL orders for total sales/revenue or delivered. Let's do all.
    .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const StatCard = ({ title, value, icon, bgColor, textColor }: any) => (
    <div className={`p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between ${bgColor}`}>
      <div>
        <p className={`text-sm font-medium mb-1 ${textColor}`}>{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`text-4xl ${textColor} opacity-80`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name?.firstName || 'Farmer'}! Here&apos;s what&apos;s happening on your farm.</p>
        </div>
        <Link 
          href="/farmer/feed" 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
        >
          Post an Update
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Sales (Delivered)" 
          value={`$${totalSales.toFixed(2)}`} 
          icon="💰" 
          bgColor="bg-emerald-50" 
          textColor="text-emerald-700" 
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders} 
          icon="🛒" 
          bgColor="bg-blue-50" 
          textColor="text-blue-700" 
        />
        <StatCard 
          title="Total Products" 
          value={totalProducts} 
          icon="📦" 
          bgColor="bg-purple-50" 
          textColor="text-purple-700" 
        />
        <StatCard 
          title="Pending Requests" 
          value={pendingRequests} 
          icon="⌛" 
          bgColor="bg-amber-50" 
          textColor="text-amber-700" 
        />
        <StatCard 
          title="Shipping" 
          value={shipping} 
          icon="🚚" 
          bgColor="bg-indigo-50" 
          textColor="text-indigo-700" 
        />
        <StatCard 
          title="Successfully Delivered" 
          value={delivered} 
          icon="✅" 
          bgColor="bg-teal-50" 
          textColor="text-teal-700" 
        />
      </div>

      {/* Quick Actions / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Order #{order._id.slice(-6)}</p>
                    <p className="text-xs text-gray-500">${order.totalPrice?.toFixed(2)} • {order.status}</p>
                  </div>
                  <Link 
                    href="/farmer/orders" 
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No orders yet.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/farmer/products" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-green-50 hover:text-green-700 transition">
              <span className="text-2xl mb-2">➕</span>
              <span className="text-sm font-medium text-gray-700">Add Product</span>
            </Link>
            <Link href="/farmer/orders" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-green-50 hover:text-green-700 transition">
              <span className="text-2xl mb-2">📋</span>
              <span className="text-sm font-medium text-gray-700">Manage Orders</span>
            </Link>
            <Link href="/farmer/feed" className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl hover:bg-green-50 hover:text-green-700 transition">
              <span className="text-2xl mb-2">📸</span>
              <span className="text-sm font-medium text-gray-700">Post Timeline</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}