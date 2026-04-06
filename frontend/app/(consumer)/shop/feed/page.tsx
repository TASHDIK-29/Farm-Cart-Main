'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/content/timeline');
        // Filter out posts that don't have farmerId populated properly just in case
        setPosts(data.data.filter((p: any) => p.farmerId));
      } catch (error) {
        console.error('Failed to fetch feed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center py-20 font-medium text-gray-500">Loading farmer updates...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-green-800 mb-2">Farmer Feed</h1>
      <p className="text-gray-600 mb-8 border-b pb-4">Check out the latest updates, harvest pictures, and videos from our local farmers.</p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 italic">No posts on the feed yet. Support your local farmers!</div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post._id} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-green-100 flex items-center justify-center text-xl font-bold text-green-700">
                  {post.farmerId.profileImage ? (
                    <img src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + post.farmerId.profileImage} alt={post.farmerId.businessName} className="w-full h-full object-cover" />
                  ) : (
                    post.farmerId.businessName?.charAt(0) || 'F'
                  )}
                </div>
                <div>
                  <a href={`/shop/farmer/${post.farmerId._id}`} className="font-bold text-gray-800 hover:text-green-700 hover:underline">
                    {post.farmerId.businessName || post.farmerId.name?.firstName}
                  </a>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()} • ⭐ {post.farmerId.averageRating}/10
                  </p>
                </div>
              </div>
              
              <div className="p-4 text-gray-800">
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
  );
}