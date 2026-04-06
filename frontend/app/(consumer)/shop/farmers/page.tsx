'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/api';

import Link from 'next/link';

export default function FarmersIndex() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await api.get('/auth/farmers');
        if (res.data.success) {
          setFarmers(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch farmers', error);
      }
      setLoading(false);
    };

    fetchFarmers();
  }, []);

  return (
    <div className="py-6">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-green-800">Top Rated Farmers 👨‍🌾</h2>
        <p className="text-gray-600 mt-2">Discover and connect directly with the finest, most trusted local farmers based on consumer ratings.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Curating the best...</div>
      ) : farmers.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No farmers registered yet. Check back later!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {farmers.map((farmer, index) => (
            <Link key={farmer._id} href={`/shop/farmer/${farmer._id}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow-md h-full hover:shadow-xl transition border border-green-50 p-6 flex flex-col items-center text-center relative group cursor-pointer">
                {/* Ranking Badge */}
                <div className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-green-700'}`}>
                  {index + 1}
                </div>
                
                <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-sm mb-4 overflow-hidden">
                  {farmer.profileImage ? (
                     <img src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + farmer.profileImage} alt={farmer.businessName} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-green-100 flex items-center justify-center text-3xl">👨‍🌾</div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-800">{farmer.businessName || farmer.name?.firstName}</h3>
                <p className="text-green-600 font-semibold mb-2">⭐ {farmer.averageRating}/10</p>
                
                <p className="text-gray-500 text-sm italic mb-4 line-clamp-2">
                  " {farmer.description || 'Dedicated to providing fresh and quality products.'} "
                </p>

                <div className="mt-auto w-full pt-4 border-t border-gray-100 text-gray-600 font-medium text-sm flex flex-col items-center justify-center gap-1">
                  <span>📍 {farmer.location}</span>
                </div>

                {/* View Profile hover effect placeholder */}
                <div className="absolute inset-0 rounded-lg bg-green-800 bg-opacity-90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition font-bold text-lg pointer-events-none">
                  View Profile & Feed
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
