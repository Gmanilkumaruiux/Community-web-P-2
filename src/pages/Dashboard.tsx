import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { helpService } from '../services/api';
import { CommunityPost } from '../types';
import { 
  Heart, 
  PlusCircle, 
  HelpCircle, 
  HandHelping, 
  ListFilter, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Users, 
  BadgeHelp,
  Sparkles,
  RefreshCw,
  Search,
  Bookmark,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  CheckCircle2
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import PostCard from '../components/PostCard';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  // State Management
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'Requests' | 'Offers'>('Requests');

  // Stats Counters
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeServices: 0,
    yourPosts: 0,
    resolvedRequests: 0
  });

  // Fetch initial data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const allPosts = await helpService.getPosts();
      setPosts(allPosts);

      const userEmail = user?.email || '';
      const userCreatedCount = allPosts.filter(p => p.userEmail === userEmail).length;
      const totalRequestsCount = allPosts.filter(p => p.type === 'Request' && p.status === 'Open').length;
      const activeOffersCount = allPosts.filter(p => p.type === 'Offer').length;
      const resolvedRequestsCount = allPosts.filter(p => p.type === 'Request' && p.status === 'Resolved').length;

      setStats({
        totalRequests: totalRequestsCount,
        activeServices: activeOffersCount,
        yourPosts: userCreatedCount,
        resolvedRequests: resolvedRequestsCount
      });
    } catch (err: any) {
      showToast('Error displaying latest dashboard metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Likes and Saves logic triggers
  const handleLikeToggle = async (postId: string) => {
    if (!user) return;
    try {
      const updatedPost = await helpService.toggleLikePost(postId, user.email);
      setPosts((pList) => pList.map((p) => (p.id === postId ? updatedPost : p)));
      const isPostLiked = updatedPost.likes.includes(user.email);
      showToast(isPostLiked ? 'Added to Liked list' : 'Removed Like', 'success');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleSaveToggle = async (postId: string) => {
    if (!user) return;
    try {
      const updatedPost = await helpService.toggleSavePost(postId, user.email);
      setPosts((pList) => pList.map((p) => (p.id === postId ? updatedPost : p)));
      const isSaved = updatedPost.saves.includes(user.email);
      showToast(isSaved ? 'Bookmark added' : 'Bookmark removed', 'success');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  // Extract recent postings
  const recentRequests = posts.filter(p => p.type === 'Request').slice(0, 3);
  const recentOffers = posts.filter(p => p.type === 'Offer').slice(0, 3);
  const currentTabPosts = currentTab === 'Requests' ? recentRequests : recentOffers;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Block Header */}
        <div className="bg-white rounded-3xl border border-slate-205 p-6 sm:p-8 md:p-10 mb-8 relative overflow-hidden shadow-sm animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 z-10 relative">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-emerald-100">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                <span>Verified Neighbor Space</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Welcome back, {user?.name}!</span>
                <Sparkles className="h-6 w-6 text-amber-400 fill-amber-300 animate-pulse" />
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl leading-relaxed">
                Coordinate errands safely, support vulnerable neighbors with free deliveries, or publish your volunteer skills to strengthen neighborhood resilience.
              </p>
            </div>
            
            {/* Quick action buttons linking to clean Phase 2 creators */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/create-post">
                <Button
                  variant="primary"
                  className="gap-2 px-5 py-3 font-semibold shadow-md shadow-emerald-600/10"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Publish New Post</span>
                </Button>
              </Link>
              <Link to="/feed">
                <Button
                  variant="outline"
                  className="gap-2 bg-white text-slate-700 font-semibold border-slate-300 px-5 py-3 hover:bg-slate-50"
                >
                  <LayoutGrid className="h-5 w-5 text-slate-400" />
                  <span>Browse Feed</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-[50%] h-full bg-linear-to-l from-emerald-50/20 to-transparent -z-10" />
        </div>

        {/* Statistics board counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          
          <Card className="p-5 bg-white border-slate-205/85 hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Open Requests</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 mt-2">{stats.totalRequests}</h3>
              </div>
              <div className="bg-rose-50 border border-rose-100/60 text-rose-600 p-3 rounded-2xl shadow-2xs">
                <HelpCircle className="h-6 w-6" />
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-rose-600 font-bold mt-4 flex items-center gap-1.5 uppercase font-sans tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Needs Volunteers</span>
            </p>
          </Card>

          <Card className="p-5 bg-white border-slate-205/85 hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Offer Directory</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 mt-2">{stats.activeServices}</h3>
              </div>
              <div className="bg-emerald-50 border border-emerald-100/60 text-emerald-600 p-3 rounded-2xl shadow-2xs">
                <HandHelping className="h-6 w-6" />
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-600 font-bold mt-4 flex items-center gap-1.5 uppercase tracking-wide">
              <span>● Shared skillsets</span>
            </p>
          </Card>

          <Card className="p-5 bg-white border-slate-205/85 hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">My Publications</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 mt-2">{stats.yourPosts}</h3>
              </div>
              <div className="bg-indigo-50 border border-indigo-100/60 text-indigo-600 p-3 rounded-2xl shadow-2xs">
                <Bookmark className="h-6 w-6" />
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-indigo-600 font-bold mt-4 flex items-center gap-1.5 uppercase tracking-wide">
              <Link to="/my-posts" className="hover:underline flex items-center gap-0.5">
                <span>Manage publications</span> <ChevronRight className="h-3 w-3" />
              </Link>
            </p>
          </Card>

          <Card className="p-5 bg-white border-slate-205/85 hover:shadow-xs transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Resolved Jobs</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 mt-2">{stats.resolvedRequests}</h3>
              </div>
              <div className="bg-amber-50 border border-amber-100/60 text-amber-600 p-3 rounded-2xl shadow-2xs">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-amber-600 font-bold mt-4 flex items-center gap-1.5 uppercase tracking-wide">
              <span>★ center milestones</span>
            </p>
          </Card>

        </div>

        {/* Recent Platform activity boards */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Live Activities</h2>
            </div>

            {/* Toggle tabs for Requests vs Offers feed preview */}
            <div className="flex items-center gap-1 bg-slate-150 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setCurrentTab('Requests')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentTab === 'Requests'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Help Requests
              </button>
              <button
                onClick={() => setCurrentTab('Offers')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  currentTab === 'Offers'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Volunteer Services
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton type="card" count={3} />
          ) : currentTabPosts.length === 0 ? (
            <div className="bg-white p-10 border border-slate-200 rounded-2xl text-center">
              <p className="text-slate-500 text-sm font-sans">No listings registered under this category yet.</p>
              <Link to="/create-post" className="mt-3 inline-block">
                <Button variant="primary" size="sm">Publish The First Listing</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Grid of latest cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {currentTabPosts.map(post => (
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

              {/* View all community board link */}
              <div className="text-center pt-2">
                <Link to="/feed">
                  <Button variant="outline" className="gap-1.5 border-slate-300 bg-white text-indigo-700 font-bold hover:bg-slate-50 transition-colors">
                    <span>Explore All Neighborhood Boards</span>
                    <ChevronRight className="h-4.5 w-4.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
