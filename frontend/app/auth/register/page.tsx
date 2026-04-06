'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';

export default function Register() {
  const [role, setRole] = useState<'consumer' | 'farmer'>('consumer');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    businessName: '',
    description: '',
    location: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const payload = {
      name: {
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
      email: formData.email,
      password: formData.password,
      role,
      ...(role === 'farmer' && {
        businessName: formData.businessName,
        description: formData.description,
        location: formData.location,
      }),
    };

    try {
      const response = await api.post('/auth/register', payload);
      if (response.data.success) {
        alert('Registration Successful! Please login.');
        router.push('/auth/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <main className="flex justify-center items-center py-10 bg-gray-50 text-gray-800 min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg mt-4 mb-4">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">Create an Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="flex gap-4 mb-6">
          <button 
            type="button" 
            onClick={() => setRole('consumer')}
            className={`flex-1 py-2 rounded font-medium ${role === 'consumer' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            I am a Consumer
          </button>
          <button 
            type="button" 
            onClick={() => setRole('farmer')}
            className={`flex-1 py-2 rounded font-medium ${role === 'farmer' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            I am a Farmer
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" required name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          {role === 'farmer' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Business/Farm Name</label>
                <input required name="businessName" value={formData.businessName} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input required name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows={3}></textarea>
              </div>
            </>
          )}

          <button type="submit" className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/auth/login" className="text-green-600 hover:underline">Login here</Link>
        </p>
      </div>
    </main>
  );
}
