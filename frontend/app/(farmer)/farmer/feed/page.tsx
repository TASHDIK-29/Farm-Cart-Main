'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Video, Send } from 'lucide-react';

export default function FarmerFeed() {
  const [text, setText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'global' | 'my-posts'>('global');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const fetchPosts = async () => {
    if (!user || user.role !== 'farmer') return;
    setLoading(true);
    try {
      const endpoint = viewMode === 'my-posts' ? `/content/farmer/${user.id}` : '/content/timeline';
      const res = await api.get(endpoint);
      if (res.data.success) {
        const validPosts = res.data.data.filter((p: any) => p.farmerId);
        validPosts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(validPosts);
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user, viewMode]);

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
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-extrabold mb-4 text-green-800 flex items-center gap-2">
          Share an Update
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full text-gray-800 p-4 mb-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-none bg-gray-50 hover:bg-white"
            rows={3}
            placeholder="What's happening on the farm today? Share your harvest, stories, or upcoming products..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                <ImageIcon size={18} className="text-green-600" />
                <span className="text-sm font-medium">Photo/Video</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                />
              </label>
              {mediaFile && (
                <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  <span className="truncate max-w-[120px]">{mediaFile.name}</span>
                  <button type="button" onClick={() => setMediaFile(null)} className="ml-2 font-bold hover:text-green-900">&times;</button>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={!text && !mediaFile}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <Send size={18} />
              Post
            </button>
          </div>
        </form>
      </div>
      
      <div className="flex items-center justify-between mb-6 border-b pb-4 px-2">
        <h2 className="text-2xl font-extrabold text-gray-800">Community Feed</h2>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('global')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'global' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            All Farmers
          </button>
          <button 
            onClick={() => setViewMode('my-posts')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'my-posts' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Posts
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed text-gray-500">
          <p className="text-lg font-medium">{viewMode === 'my-posts' ? "You haven't posted anything yet." : "No posts in the community yet."}</p>
          <p className="text-sm mt-2">{viewMode === 'my-posts' ? "Share your first update above!" : "Be the first one to post an update!"}</p>
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
                    <span className="font-bold text-gray-900 text-lg">
                      {post.farmerId.businessName || post.farmerId.name?.firstName} {post.farmerId._id === user?.id && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">You</span>}
                    </span>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <span>{new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                      {post.farmerId.averageRating && (
                        <>
                          <span>•</span>
                          <span className="flex items-center text-yellow-500 font-medium">⭐ {post.farmerId.averageRating}/10</span>
                        </>
                      )}
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
                  <button className="flex items-center gap-2 hover:text-red-500 transition-colors font-medium text-sm group/btn">
                    <Heart size={20} className="group-hover/btn:fill-red-100" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500 transition-colors font-medium text-sm group/btn">
                    <MessageCircle size={20} className="group-hover/btn:fill-blue-100" />
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
