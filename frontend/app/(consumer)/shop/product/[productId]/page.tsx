'use client';
import { useState, useEffect } from 'react';
import api from '../../../../../lib/api';
import { useAuth } from '../../../../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetails() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/${productId}`);
      if (res.data.success) {
        setProduct(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch product details', error);
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (user.role !== 'consumer') {
      alert("Please login as a consumer to add items to your cart.");
      return;
    }

    setAddingToCart(true);
    try {
      const res = await api.post('/cart', {
        consumerId: user.id,
        productId: product._id,
        quantity: quantity,
      });
      
      if (res.data.success) {
        alert("Added to cart successfully!");
        router.push('/shop/cart');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add to cart.");
    }
    setAddingToCart(false);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  return (
    <div className="py-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/shop" className="text-green-700 hover:underline flex items-center gap-1">
          <span aria-hidden="true">&larr;</span> Back to Shop
        </Link>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row">
        <div className="md:w-1/2 h-80 md:h-auto relative bg-gray-100 flex items-center justify-center">
          {product.imageUrl ? (
            <img 
              src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + product.imageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-8xl">🥦</div>
          )}
        </div>

        <div className="p-8 md:w-1/2 flex flex-col">
          <div className="mb-2 uppercase text-sm tracking-widest text-green-700 font-bold">
            {product.category}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <Link href={`/shop/farmer/${product.farmerId?._id}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors -ml-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                {product.farmerId?.profilePicture ? (
                  <img src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + product.farmerId.profilePicture} alt="Farmer" className="w-full h-full rounded-full object-cover" />
                ) : (
                  product.farmerId?.name?.firstName?.[0] || 'F'
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 leading-tight">
                  {product.farmerId?.businessName || `${product.farmerId?.name?.firstName} ${product.farmerId?.name?.lastName}`}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <span>📍 {product.farmerId?.location}</span>
                  <span className="mx-1">&bull;</span>
                  <span>⭐ {product.farmerId?.averageRating}/10</span>
                </p>
              </div>
            </Link>
          </div>

          <div className="mb-8 flex-grow">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description || 'No description provided.'}
            </p>
          </div>

          <div className="mt-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-gray-500 mb-1">Price</p>
                <p className="text-4xl font-bold text-green-700">${product.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 mb-1">Availability</p>
                <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-12 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                  disabled={quantity <= 1}
                >
                  &minus;
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= product.stock) {
                      setQuantity(val);
                    }
                  }}
                  className="w-16 h-full text-center focus:outline-none font-semibold text-gray-800"
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 h-full hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                  disabled={quantity >= product.stock}
                >
                  &#43;
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addingToCart}
                className={`flex-1 h-12 rounded-lg font-bold text-lg transition-colors flex items-center justify-center ${
                  product.stock > 0 
                  ? 'bg-green-700 hover:bg-green-800 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {addingToCart ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}