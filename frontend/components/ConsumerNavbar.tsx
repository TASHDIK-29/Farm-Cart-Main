'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';

export default function ConsumerNavbar() {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path ? 'border-b-2 border-green-600 pb-1 text-green-600 font-semibold' : 'text-gray-600 hover:text-green-600';

  return (
    <nav className="bg-white shadow p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/shop" className="text-xl font-bold text-green-700 flex items-center gap-2">
            🛒 Farm-Cart
          </Link>
          <div className="hidden md:flex gap-6 items-center text-sm font-medium ml-4">
            <Link href="/shop" className={isActive('/shop')}>Shop</Link>
            <Link href="/shop/feed" className={isActive('/shop/feed')}>Feed</Link>
            <Link href="/shop/farmers" className={isActive('/shop/farmers')}>Top Farmers</Link>
            <Link href="/shop/cart" className={isActive('/shop/cart')}>Cart</Link>
            <Link href="/shop/orders" className={isActive('/shop/orders')}>My Orders</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-700 hidden sm:block">
            {user ? `Hi, ${user.email.split('@')[0]}` : 'Guest'}
          </div>
          {user ? (
            <button 
              onClick={logout}
              className="border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded text-sm transition"
            >
              Logout
            </button>
          ) : (
            <Link 
              href="/auth/login"
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-sm transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
