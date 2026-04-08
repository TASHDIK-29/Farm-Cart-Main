'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function FarmerSidebar() {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => 
    pathname === path 
      ? 'bg-green-800 text-white rounded-lg' 
      : 'text-green-100 hover:bg-green-600 hover:text-white rounded-lg transition-colors';

  return (
    <aside className="w-64 bg-green-700 text-white min-h-screen flex flex-col shadow-xl fixed left-0 top-0">
      <div className="p-6">
        <Link href="/farmer/dashboard" className="text-2xl font-bold flex items-center gap-3">
          <span>👨‍🌾</span> 
          <span>Farmer Portal</span>
        </Link>
      </div>
      
      <div className="flex-1 px-4 py-6 space-y-2 flex flex-col">
        <Link href="/farmer/dashboard" className={`px-4 py-3 flex items-center font-medium ${isActive('/farmer/dashboard')}`}>
          Dashboard
        </Link>
        <Link href="/farmer/products" className={`px-4 py-3 flex items-center font-medium ${isActive('/farmer/products')}`}>
          My Products
        </Link>
        <Link href="/farmer/feed" className={`px-4 py-3 flex items-center font-medium ${isActive('/farmer/feed')}`}>
          My Feed
        </Link>
        <Link href="/farmer/orders" className={`px-4 py-3 flex items-center font-medium ${isActive('/farmer/orders')}`}>
          Manage Orders
        </Link>
      </div>
      
      <div className="p-4 border-t border-green-600">
        <div className="mb-4 px-2 hidden sm:block">
          <p className="text-sm text-green-200">Logged in as:</p>
          <p className="font-medium truncate" title={user?.email || ''}>{user?.email || 'Welcome'}</p>
        </div>
        <button 
          onClick={logout}
          className="w-full bg-green-800 hover:bg-green-900 text-white px-4 py-2 flex justify-center items-center rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}