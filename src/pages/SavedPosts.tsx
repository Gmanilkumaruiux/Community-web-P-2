import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { helpService } from '../services/api';
import { CommunityPost } from '../types';
import { Bookmark, Heart, Loader, Compass, Search } from 'lucide-react';
import PostCard from '../components/PostCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { useNavigate, Link } from 'react-router-dom';

const SavedPosts: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'liked'>('bookmarks');

  // Load posts
  const fetchSavedPosts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allPosts = await helpService.getPosts();
      setPosts(allPosts);
    } catch {
      showToast('Could not fetch saved listings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, [user]);

  // Likes and Saves logic triggers
  const handleLikeToggle = async (postId: string) => {
    if (!user) return;
    try {
      const updatedPost = await helpService.toggleLikePost(postId, user.email);
      setPosts((pList) => pList.map((p) => (p.id === postId ? updatedPost : p)));
      
      if (activeTab === 'liked' && !updatedPost.likes.includes(user.email)) {
        showToast('Removed from liked listings list.', 'info');
      }
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleSaveToggle = async (postId: string) => {
    if (!user) return;
    try {
      const updatedPost = await helpService.toggleSavePost(postId, user.email);
      setPosts((pList) => pList.map((p) => (p.id === postId ? updatedPost : p)));

      if (activeTab === 'bookmarks' && !updatedPost.saves.includes(user.email)) {
        showToast('Removed bookmark successfully.', 'info');
      }
    } catch {
      showToast('Action failed', 'error');
    }
  };

  // Filter lists based on type & user
  const bookmarkedPosts = posts.filter((p) => user && p.saves.includes(user.email));
  const likedPosts = posts.filter((p) => user && p.likes.includes(user.email));

  const displayList = activeTab === 'bookmarks' ? bookmarkedPosts : likedPosts;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header element */}
        <div className="bg-sky-950 rounded-3xl text-white p-6 sm:p-10 mb-8 relative overflow-hidden shadow-lg shadow-sky-950/15 animate-in slide-in-from-top-4 duration-300">
          <div className="max-w-2xl z-10 relative">
            <span className="inline-flex items-center gap-1.5 bg-sky-900 border border-sky-800 text-sky-100 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Bookmark className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span>Personal Bookmarks</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Saved Listings</h1>
            <p className="text-sm sm:text-base text-sky-200 mt-2 leading-relaxed">
              Find lists or support requests you bookmarked or liked earlier. Keeping track of contact preferences allows you to follow up on open center errands easily.
            </p>
          </div>

          {/* Decorative design pattern */}
          <div className="absolute top-[-40%] right-[-10%] w-[50%] h-[180%] bg-white/5 rounded-full transform rotate-45 pointer-events-none" />
        </div>

        {/* Tab switch control navigation */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-205 max-w-sm mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Bookmarked ({bookmarkedPosts.length})</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('liked')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'liked'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Liked ({likedPosts.length})</span>
          </button>
        </div>

        {/* Display grids or Skeletons loading states */}
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium justify-center">
              <Loader className="h-4 w-4 animate-spin text-sky-600" />
              <span>Fetching your bookmarked items...</span>
            </div>
            <LoadingSkeleton type="card" count={2} />
          </div>
        ) : displayList.length === 0 ? (
          <div className="py-10">
            <EmptyState
              title={activeTab === 'bookmarks' ? "No Bookmarks Saved" : "No Liked Listings"}
              description={
                activeTab === 'bookmarks'
                  ? "You haven't bookmarked any help requests or service offers. Explore the community board to save listings for offline follow-ups."
                  : "Double tap or click the Heart icon on post cards to build up lists you like."
              }
              iconName="Bookmark"
              actionText="Browse Community Board"
              onActionClick={() => navigate('/feed')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in duration-300">
            {displayList.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLikeToggle={handleLikeToggle}
                onSaveToggle={handleSaveToggle}
                isLiked={user ? post.likes.includes(user.email) : false}
                isSaved={user ? post.saves.includes(user.email) : false}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SavedPosts;
