'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function ShopIndex() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', {
        params: { search: searchTerm, category: category }
      });
      if (res.data.success) {
        // Sorting by farmer's average rating primarily so that highly rated 
        // farmers' products naturally feature higher in standard searches
        const fetchedProducts = res.data.data.sort((a: any, b: any) => {
          const ratingA = a.farmerId?.averageRating || 0;
          const ratingB = b.farmerId?.averageRating || 0;
          return ratingB - ratingA;
        });
        setProducts(fetchedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const triggerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = async (product: any) => {
    if (!user || user.role !== 'consumer') {
      alert("Please login as a consumer to add items to your cart.");
      return;
    }

    try {
      const res = await api.post('/cart', {
        consumerId: user.id,
        productId: product._id,
        quantity: 1, // Defaulting to 1 for quick add
      });
      
      if (res.data.success) {
        alert("Added to cart successfully!");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add to cart.");
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-green-800">Fresh Marketplace</h2>
        
        <form onSubmit={triggerSearch} className="flex w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="border p-2 rounded-l w-full md:w-64 focus:outline-none focus:border-green-600 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-green-700 text-white px-4 rounded-r hover:bg-green-800">
            🔍
          </button>
        </form>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['All', 'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Meat & Poultry'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${category === cat ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-green-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading fresh produce...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              {p.imageUrl ? (
                 <img src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + p.imageUrl} alt={p.title} className="w-full h-48 object-cover" />
               ) : (
                 <div className="w-full h-48 bg-green-50 flex items-center justify-center text-green-800 text-3xl">🥦</div>
               )}
               <div className="p-4">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-gray-800 line-clamp-1" title={p.title}>{p.title}</h4>
                 </div>
                 
                 <div className="text-sm text-gray-600 mb-3">
                    <p>👨‍🌾 <span className="font-medium">{p.farmerId?.businessName || p.farmerId?.name?.firstName}</span> &bull; ⭐ {p.farmerId?.averageRating}/10</p>
                    <p>📍 {p.farmerId?.location}</p>
                 </div>
                 
                 <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-auto">
                   <span className="font-bold text-green-700 text-lg">${p.price.toFixed(2)}</span>
                   <button 
                     onClick={() => handleAddToCart(p)}
                     className="bg-green-100 text-green-800 px-3 py-1 border border-green-200 hover:bg-green-700 hover:text-white hover:border-green-700 rounded text-sm font-medium transition"
                   >
                     Add to Cart
                   </button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
