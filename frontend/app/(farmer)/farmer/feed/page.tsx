'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';

export default function FarmerFeed() {
  const [text, setText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const { user } = useAuth();
  
  const fetchPosts = async () => {
    if (!user || user.role !== 'farmer') return;
    try {
      const res = await api.get(`/content/farmer/${user.id}`);
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !mediaFile) return;

    if (!user || user.role !== 'farmer') {
      alert('You must be logged in as a farmer to post.');
      return;
    }
    
    const farmerId = user.id; 
    
    const formData = new FormData();
    formData.append('farmerId', farmerId);
    formData.append('text', text);
    if (mediaFile) {
      formData.append('mediaFile', mediaFile);
    }

    try {
      const res = await api.post('/content', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Post created:', res.data);
      setText('');
      setMediaFile(null);
      alert('Post created successfully!');
      fetchPosts(); // refresh feed
    } catch (error) {
      console.error('Failed to post', error);
      alert('Failed to post snippet.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto rounded overflow-hidden shadow-lg p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4 text-green-800">Timeline Update</h2>
      <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 rounded">
        <textarea
          className="w-full text-gray-800 p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          rows={4}
          placeholder="What's happening on the farm today?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        
        <div className="flex items-center gap-4 mb-4">
          <input
            type="file"
            accept="image/*,video/*"
            className="flex-1 border p-2 text-gray-600 rounded bg-gray-50"
            onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
          />
        </div>

        <button 
          type="submit" 
          className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800 w-full"
        >
          Post Update
        </button>
      </form>
      
      <h2 className="text-xl font-bold mb-4 text-green-800 border-b pb-2">Your Feed</h2>
      {posts.length === 0 ? (
        <div className="text-gray-500 italic">No posts made yet. Create one above!</div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="border border-gray-200 p-4 rounded bg-gray-50 shadow-sm text-gray-800">
              <p className="mb-4">{post.text}</p>
              {post.mediaUrl && post.mediaType === 'image' && (
                <img 
                  src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + post.mediaUrl} 
                  alt="Post content" 
                  className="rounded max-w-full h-auto"
                />
              )}
              {post.mediaUrl && post.mediaType === 'video' && (
                <video 
                  src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + post.mediaUrl} 
                  controls 
                  className="rounded w-full"
                />
              )}
              <small className="text-gray-500 mt-2 block border-t pt-2">
                {new Date(post.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
