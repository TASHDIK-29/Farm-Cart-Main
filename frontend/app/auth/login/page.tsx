'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const user = { id: response.data.userId || '-', role: response.data.role, email }; 
        login(user, response.data.token);

        if (response.data.role === 'farmer') {
          router.push('/farmer/dashboard');
        } else {
          router.push('/shop');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    }
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gray-50 text-gray-800">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">Login to Farm-Cart</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500 bg-white text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500 bg-white text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800">
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account? <Link href="/auth/register" className="text-green-600 hover:underline">Register</Link>
        </p>
      </div>
    </main>
  );
}
