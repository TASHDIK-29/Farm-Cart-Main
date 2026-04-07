'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';

export default function FarmerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Vegetables', price: '', stock: '' });
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    if (!user || user.role !== 'farmer') return;
    try {
      const res = await api.get(`/products/farmer/${user.id}`);
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setFormData({ title: '', description: '', category: 'Vegetables', price: '', stock: '' });
    setImage(null);
    setEditingId(null);
  };

  const handleEdit = (product: any) => {
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
    setImage(null);
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        alert('Product deleted!');
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const data = new FormData();
    data.append('farmerId', user.id);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (image) data.append('image', image);

    try {
      let res;
      if (editingId) {
        res = await api.put(`/products/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        res = await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      if (res.data.success) {
        alert(`Product ${editingId ? 'updated' : 'added'}!`);
        clearForm();
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
      alert(`Failed to ${editingId ? 'update' : 'add'} product`);
    }
  };

  return (
    <div className="text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-green-800">My Inventory Management</h2>
      
      {/* Add Product Form */}
      <div className="bg-white p-6 rounded shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50" placeholder="e.g. Fresh Organic Tomatoes" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select required name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50">
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Dairy</option>
              <option>Grains</option>
              <option>Meat & Poultry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (per unit)</label>
            <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock Available</label>
            <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50" placeholder="Quantity available" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50" rows={2} placeholder="Describe the product quality, origin, etc."></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full p-2 border rounded bg-gray-50" />
          </div>
          <div className="md:col-span-2 flex gap-4">
            <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition shadow">
              {editingId ? '💾 Update Product' : '🚀 Publish Product'}
            </button>
            {editingId && (
              <button type="button" onClick={clearForm} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition shadow">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List */}
      <h3 className="text-xl font-bold mb-4 text-green-800 border-b pb-2">Active Listings</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p className="text-gray-500 italic md:col-span-3">No products available. Add one above.</p>
        ) : (
          products.map(p => (
            <div key={p._id} className="bg-white rounded overflow-hidden shadow border border-gray-200">
               {p.imageUrl ? (
                 <img src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + p.imageUrl} alt={p.title} className="w-full h-48 object-cover" />
               ) : (
                 <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
               )}
               <div className="p-4">
                 <div className="flex justify-between items-center mb-2">
                   <h4 className="font-bold text-lg">{p.title}</h4>
                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">{p.category}</span>
                 </div>
                 <p className="text-sm text-gray-600 line-clamp-2 mb-4">{p.description}</p>
                 <div className="flex justify-between items-center border-t pt-3">
                   <span className="font-bold text-green-700">${p.price.toFixed(2)}</span>
                   <span className="text-sm text-gray-500">Stock: {p.stock}</span>
                 </div>
                 <div className="flex justify-between items-center border-t mt-3 pt-3 gap-2">
                   <button onClick={() => handleEdit(p)} className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 transition">
                     Edit
                   </button>
                   <button onClick={() => handleDelete(p._id)} className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-100 transition">
                     Delete
                   </button>
                 </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
