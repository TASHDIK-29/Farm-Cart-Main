'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/content/timeline');
        // Filter out posts that don't have farmerId populated properly just in case
        const validPosts = data.data.filter((p: any) => p.farmerId);
        // Ensure most recent posts first
        validPosts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(validPosts);
      } catch (error) {
        console.error('Failed to fetch feed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold text-green-800 mb-3 tracking-tight">Farmer Feed</h1>
      <p className="text-gray-600 mb-8 border-b pb-6 text-lg">Check out the latest updates, harvest pictures, and videos from our local farmers.</p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 italic bg-gray-50 rounded-2xl border border-dashed">
          <p className="text-xl">No posts on the feed yet.</p>
          <p className="mt-2 text-sm">Support your local farmers and wait for their updates!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post._id} className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col group">
              <div className="flex items-center justify-between p-5 border-b bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-green-100 flex items-center justify-center text-xl font-bold text-green-700 ring-2 ring-green-500/20">
                    {post.farmerId.profileImage ? (
                      <img src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + post.farmerId.profileImage} alt={post.farmerId.businessName} className="w-full h-full object-cover" />
                    ) : (
                      post.farmerId.businessName?.charAt(0) || 'F'
                    )}
                  </div>
                  <div>
                    <a href={`/shop/farmer/${post.farmerId._id}`} className="font-bold text-gray-900 text-lg hover:text-green-700 hover:underline transition-colors">
                      {post.farmerId.businessName || post.farmerId.name?.firstName}
                    </a>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <span>{new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                      <span>•</span>
                      <span className="flex items-center text-yellow-500 font-medium">⭐ {post.farmerId.averageRating || 'New'}/10</span>
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-green-50">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <div className="p-5 text-gray-800">
                <p className="mb-4 whitespace-pre-wrap text-base leading-relaxed">{post.text}</p>
                {post.mediaUrl && (
                  <div className="mt-4 rounded-xl overflow-hidden border bg-gray-50/80">
                    {post.mediaType === 'video' ? (
                      <video 
                        src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + post.mediaUrl} 
                        controls 
                        className="w-full max-h-[500px] object-contain bg-black rounded-xl"
                      />
                    ) : (
                      <img 
                        src={(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000') + post.mediaUrl} 
                        alt="Farmer Update" 
                        className="w-full max-h-[500px] object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                      />
                    )}
                  </div>
                )}
              </div>
              
              <div className="px-5 py-4 border-t bg-gray-50/30 flex items-center justify-between text-gray-500">
                <div className="flex gap-6">
                  <button className="flex items-center gap-2 hover:text-red-500 transition-colors font-medium text-sm group">
                    <Heart size={20} className="group-hover:fill-red-100" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors font-medium text-sm group">
                    <MessageCircle size={20} className="group-hover:fill-blue-100" />
                    <span>Comment</span>
                  </button>
                </div>
                <button className="flex items-center gap-2 hover:text-green-600 transition-colors font-medium text-sm">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}