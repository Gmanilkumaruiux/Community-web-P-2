import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { helpService } from '../services/api';
import { CommunityPost } from '../types';
import { Layers, Plus, CheckCircle2, AlertCircle, Sparkles, Activity, FileText } from 'lucide-react';
import PostCard from '../components/PostCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useNavigate, Link } from 'react-router-dom';

const MyPosts: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Request' | 'Offer'>('All');

  // Load user posts
  const fetchMyPosts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allPosts = await helpService.getPosts();
      // Filter for posts created by current user
      const filtered = allPosts.filter((p) => p.userEmail === user.email);
      setPosts(filtered);
    } catch {
      showToast('Error loading your posts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [user]);

  // Likes and Saves logic triggers
  const handleLikeToggle = async (postId: string) => {
    if (!user) return;
    try {
      const updatedPost = await helpService.toggleLikePost(postId, user.email);
      setPosts((pList) => pList.map((p) => (p.id === postId ? updatedPost : p)));
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleSaveToggle = async (postId: string) => {
    if (!user) return;
    try {
      const updatedPost = await helpService.toggleSavePost(postId, user.email);
      setPosts((pList) => pList.map((p) => (p.id === postId ? updatedPost : p)));
    } catch {
      showToast('Action failed', 'error');
    }
  };

  // Filtered list
  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'All') return true;
    return post.type === activeTab;
  });

  // Calculate high-level stats
  const totalCreated = posts.length;
  const requests = posts.filter((p) => p.type === 'Request');
  const offers = posts.filter((p) => p.type === 'Offer');
  const resolvedRequests = requests.filter((r) => r.status === 'Resolved').length;
  const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
  const openRequests = requests.filter((r) => r.status === 'Open').length;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with profile stats */}
        <div className="bg-emerald-900 rounded-3xl text-white p-6 sm:p-10 mb-8 relative overflow-hidden shadow-lg shadow-emerald-950/15">
          <div className="max-w-2xl z-10 relative">
            <span className="inline-flex items-center gap-1.5 bg-emerald-800/80 border border-emerald-700/60 text-emerald-100 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              <span>Personal Console</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">My Community Posts</h1>
            <p className="text-sm sm:text-base text-emerald-100 mt-2 leading-relaxed font-sans">
              Welcome, <span className="font-extrabold text-white">{user?.name}</span>! Track the progress of help tickets you've published, resolve tasks, and check active volunteer listings.
            </p>
          </div>

          <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:block">
            <Link to="/create-post">
              <Button variant="secondary" className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 border-none font-bold shadow-md shadow-indigo-600/30 px-6 py-3">
                <Plus className="h-5 w-5" />
                <span>Create Post</span>
              </Button>
            </Link>
          </div>

          {/* Background decoration */}
          <div className="absolute top-[-50%] right-[-15%] w-[45%] h-[180%] bg-white/5 rounded-full transform rotate-12 pointer-events-none" />
        </div>

        {/* Dynamic Statistics Block widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-2xs">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <Layers className="h-5.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Listings</p>
              <h4 className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{totalCreated}</h4>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-2xs">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <Activity className="h-5.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Errands</p>
              <h4 className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{openRequests + pendingRequests}</h4>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-2xs">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              <CheckCircle2 className="h-5.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved Jobs</p>
              <h4 className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{resolvedRequests}</h4>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-2xs">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-105">
              <Sparkles className="h-5.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills Offered</p>
              <h4 className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{offers.length}</h4>
            </div>
          </div>

        </div>

        {/* Tab switch navigation bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
            {(['All', 'Request', 'Offer'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`py-2 px-4.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === type
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {type === 'All' ? 'All My Listings' : type === 'Request' ? 'My Help Requests' : 'My Service Offers'}
              </button>
            ))}
          </div>

          <Link href="/create-post" to="/create-post" className="block lg:hidden">
            <Button variant="primary" size="sm" className="gap-1.5 py-2 font-bold select-none cursor-pointer">
              <Plus className="h-4 w-4" /> <span>Add Listing</span>
            </Button>
          </Link>
        </div>

        {/* Grid display logic */}
        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : filteredPosts.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title={activeTab === 'All' ? "You Haven't Posted Anything Yet" : activeTab === 'Request' ? "No Registered Help Requests" : "No Service Offers Registered"}
              description={activeTab === 'All' ? "Get started by declaring a volunteer service or submitting a request for assistance with shopping, chores, tutoring, etc." : "Create one now to notify neighboring coordinators safely."}
              iconName="FileText"
              actionText="Publish Your First Post"
              onActionClick={() => navigate('/create-post')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in duration-300">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLikeToggle={handleLikeToggle}
                onSaveToggle={handleSaveToggle}
                isLiked={post.likes.includes(user?.email || '')}
                isSaved={post.saves.includes(user?.email || '')}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyPosts;
