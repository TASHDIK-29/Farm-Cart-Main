'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function FarmerNavbar() {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path ? 'border-b-2 border-white pb-1' : 'hover:text-green-200';

  return (
    <nav className="bg-green-700 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/farmer/dashboard" className="text-xl font-bold">
            👨‍🌾 Farmer Portal
          </Link>
          <div className="hidden md:flex gap-4 items-center text-sm font-medium">
            <Link href="/farmer/dashboard" className={isActive('/farmer/dashboard')}>Dashboard</Link>
            <Link href="/farmer/products" className={isActive('/farmer/products')}>My Products</Link>
            <Link href="/farmer/orders" className={isActive('/farmer/orders')}>Manage Orders</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium hidden sm:inline">
            {user?.email || 'Welcome'}
          </span>
          <button 
            onClick={logout}
            className="bg-green-800 hover:bg-green-900 px-4 py-2 rounded text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
