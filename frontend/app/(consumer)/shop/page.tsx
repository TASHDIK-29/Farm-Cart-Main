'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { Filter, SortDesc, SortAsc } from 'lucide-react';

export default function ShopIndex() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Filter & Sort state
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('rating-desc');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', {
        params: { search: searchTerm, category: category === 'All' ? '' : category }
      });
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Reset filters when category changes
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSortBy('rating-desc');
    fetchProducts();
  }, [category]);

  const triggerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const filteredAndSortedProducts = products.filter(p => {
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    if (minRating && (p.farmerId?.averageRating || 0) < Number(minRating)) return false;
    return true;
  }).sort((a, b) => {
    const ratingA = a.farmerId?.averageRating || 0;
    const ratingB = b.farmerId?.averageRating || 0;
    if (sortBy === 'rating-desc') return ratingB - ratingA;
    if (sortBy === 'rating-asc') return ratingA - ratingB;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'price-asc') return a.price - b.price;
    return 0;
  });

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-green-800">Fresh Marketplace</h2>
        
        <form onSubmit={triggerSearch} className="flex w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="border border-gray-300 p-2.5 rounded-l-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-green-700 text-white px-5 rounded-r-lg hover:bg-green-800 transition-colors font-medium border border-green-700">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 overflow-x-auto pb-2">
        {['All', 'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Meat & Poultry'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all shadow-sm ${category === cat ? 'bg-green-700 text-white ring-2 ring-green-700 ring-offset-1' : 'bg-white text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {category !== 'All' && (
        <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-2xl mb-8 flex flex-col md:flex-row flex-wrap gap-6 items-end">
          <div className="flex items-center gap-2 text-green-800 font-bold mb-2 md:mb-0 md:w-full lg:w-auto">
            <Filter size={20} />
            <span>Filters & Sorting</span>
          </div>
          
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Max Price ($)</label>
              <input 
                type="number" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
                className="border border-gray-300 p-2 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" 
                min="0" 
                placeholder="Any"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Min Farmer Rating</label>
              <select 
                value={minRating} 
                onChange={(e) => setMinRating(e.target.value)} 
                className="border border-gray-300 p-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              >
                <option value="">Any Rating</option>
                <option value="9">⭐ 9.0+</option>
                <option value="8">⭐ 8.0+</option>
                <option value="7">⭐ 7.0+</option>
                <option value="5">⭐ 5.0+</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
              <label className="px-2 text-sm font-medium text-gray-600 flex items-center gap-1">
                <SortDesc size={16} /> Sort by
              </label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="border-none p-1.5 rounded bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer font-medium text-sm"
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"></div>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map(p => (
            <div key={p._id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer flex flex-col" onClick={() => router.push(`/shop/product/${p._id}`)}>
              {p.imageUrl ? (
                 <img src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + p.imageUrl} alt={p.title} className="w-full h-48 object-cover" />
               ) : (
                 <div className="w-full h-48 bg-green-50 flex items-center justify-center text-green-800 text-3xl">🥦</div>
               )}
               <div className="p-4 flex-grow flex flex-col">
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
  );
}
