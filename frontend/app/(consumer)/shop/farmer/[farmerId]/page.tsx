'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function FarmerProfile() {
  const { farmerId } = useParams();
  
  const [farmer, setFarmer] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'posts'>('products');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const [farmerRes, productsRes, postsRes] = await Promise.all([
          api.get(`/auth/farmer/${farmerId}`),
          api.get(`/products/farmer/${farmerId}`),
          api.get(`/content/farmer/${farmerId}`)
        ]);
        
        if (farmerRes.data.success) setFarmer(farmerRes.data.data);
        if (productsRes.data.success) setProducts(productsRes.data.data);
        if (postsRes.data.success) setPosts(postsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch farmer profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmerData();
  }, [farmerId]);

  if (loading) return <div className="text-center py-20 font-medium text-gray-500">Loading farmer profile...</div>;
  if (!farmer) return <div className="text-center py-20 font-medium text-red-500">Farmer not found.</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header Profile Section */}
      <div className="bg-white rounded-xl shadow p-8 mb-8 border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
        <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden bg-green-100 flex items-center justify-center text-4xl font-bold text-green-700 shadow-sm">
          {farmer.profileImage ? (
            <img src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + farmer.profileImage} alt={farmer.businessName} className="w-full h-full object-cover" />
          ) : (
            farmer.businessName?.charAt(0) || 'F'
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{farmer.businessName || farmer.name?.firstName}</h1>
          <p className="text-lg text-gray-600 mb-4">{farmer.description || 'Welcome to my Farm-Cart profile!'}</p>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-700 justify-center md:justify-start">
            <span className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full border border-yellow-200 shadow-sm">
              ⭐ {farmer.averageRating || 0} / 10 Average Rating
            </span>
            <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full border border-blue-200 shadow-sm">
              📍 {farmer.location || 'Unknown Location'}
            </span>
            <span className="bg-green-50 text-green-800 px-3 py-1 rounded-full border border-green-200 shadow-sm">
              🛍️ {products.length} Products
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab('products')} 
          className={`flex-1 py-3 font-semibold text-lg transition-colors ${activeTab === 'products' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500 hover:text-green-600'}`}
        >
          Farm Products
        </button>
        <button 
          onClick={() => setActiveTab('posts')} 
          className={`flex-1 py-3 font-semibold text-lg transition-colors ${activeTab === 'posts' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500 hover:text-green-600'}`}
        >
          Farmer Feed & Updates
        </button>
      </div>

      {/* Content */}
      <div className="py-4">
        {activeTab === 'products' && (
          <div>
            {products.length === 0 ? (
              <div className="text-center py-20 text-gray-500 italic">No products available from this farmer.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(p => (
                  <div 
                    key={p._id} 
                    className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer flex flex-col"
                    onClick={() => window.location.href = `/shop/product/${p._id}`}
                  >
                    {p.imageUrl ? (
                      <img src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + p.imageUrl} alt={p.title} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-green-50 flex items-center justify-center text-green-800 text-3xl">🥦</div>
                    )}
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="mb-2">
                        <h4 className="font-bold text-gray-800 line-clamp-1" title={p.title}>{p.title}</h4>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                         <p>Current Stock: <span className="font-semibold">{p.stock}</span></p>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-auto">
                        <span className="font-bold text-green-700 text-lg">${p.price.toFixed(2)}</span>
                        <button 
                          className="bg-green-100 text-green-800 px-3 py-1 border border-green-200 hover:bg-green-700 hover:text-white hover:border-green-700 rounded text-sm font-medium transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="max-w-2xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-gray-500 italic">This farmer hasn't posted any updates yet.</div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <div key={post._id} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 text-gray-800">
                      <p className="text-xs text-gray-400 mb-3">{new Date(post.createdAt).toLocaleDateString()}</p>
                      <p className="mb-4 whitespace-pre-wrap">{post.text}</p>
                      {post.mediaUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden border">
                          {post.mediaType === 'video' ? (
                            <video 
                              src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + post.mediaUrl} 
                              controls 
                              className="w-full max-h-96 object-contain bg-black"
                            />
                          ) : (
                            <img 
                              src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + post.mediaUrl} 
                              alt="Farmer Update" 
                              className="w-full max-h-96 object-contain bg-gray-100"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}