import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { helpService } from '../services/api';
import { CommunityPost, PostType } from '../types';
import { Search, MapPin, ListFilter, SlidersHorizontal, Plus, Loader, RefreshCw, Layers, Compass } from 'lucide-react';
import PostCard from '../components/PostCard';
import Button from '../components/common/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { Link } from 'react-router-dom';

const CommunityFeed: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  // Core feed states
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState<'All' | PostType>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'nearest'>('latest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Load feed details
  const fetchFeed = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    else setLoading(true);

    try {
      const feedPosts = await helpService.getPosts();
      setPosts(feedPosts);
    } catch (err: any) {
      showToast('Could not load community feed entries.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // Likes and Saves state updates
  const handleLikeToggle = async (postId: string) => {
    if (!user) {
      showToast('Please sign in to like community posts!', 'warning');
      return;
    }
    try {
      const updatedPost = await helpService.toggleLikePost(postId, user.email);
      setPosts((pList) => pList.map((p) => (p.id === postId ? updatedPost : p)));
      const isPostLiked = updatedPost.likes.includes(user.email);
      showToast(isPostLiked ? 'Post added to your liked community list!' : 'Like removed', 'success');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleSaveToggle = async (postId: string) => {
    if (!user) {
      showToast('Please sign in to save community posts!', 'warning');
      return;
    }
    try {
      const updatedPost = await helpService.toggleSavePost(postId, user.email);
      setPosts((pList) => pList.map((p) => (p.id === postId ? updatedPost : p)));
      const isPostSaved = updatedPost.saves.includes(user.email);
      showToast(isPostSaved ? 'Post saved to your bookmarks!' : 'Bookmark removed', 'success');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  // Extract list of all unique categories & locations currently in database for filters
  const categoriesList = ['All', 'Errands & Delivery', 'Education & Tutoring', 'Home Repair & Handyman', 'Pet Care', 'Yard Work', 'Disaster Relief', 'General Support'];
  
  // Dynamic Locations discovery from active posts plus popular options
  const locationsList = ['All', ...Array.from(new Set(posts.map((p) => p.location)))];

  // Filters logic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || post.location === selectedLocation;
    const matchesType = selectedType === 'All' || post.type === selectedType;

    return matchesSearch && matchesCategory && matchesLocation && matchesType;
  });

  // Sorting logic
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'popular') {
      // Sort by likes length descending
      return b.likes.length - a.likes.length;
    }
    if (sortBy === 'nearest') {
      // Nearest: items closest to user location if we can guess, or simple alphabetically for simulation
      const userLocPart = (user?.name ? 'Downtown' : 'Westside').toLowerCase();
      const aMatches = a.location.toLowerCase().includes(userLocPart) ? 1 : 0;
      const bMatches = b.location.toLowerCase().includes(userLocPart) ? 1 : 0;
      return bMatches - aMatches;
    }
    // Default: 'latest' (Date Created)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Pagination calculation
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Area */}
        <div className="bg-indigo-900 rounded-3xl text-white p-6 sm:p-10 mb-8 relative overflow-hidden shadow-lg shadow-indigo-950/15">
          <div className="max-w-2xl z-10 relative">
            <span className="inline-flex items-center gap-1.5 bg-indigo-800/80 border border-indigo-700/60 text-indigo-100 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
              <Compass className="h-3.5 w-3.5 text-emerald-400" />
              <span>Explore Neighbor Needs</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Community Help Board</h1>
            <p className="text-sm sm:text-base text-indigo-200 mt-2 leading-relaxed">
              Find open help requests around your neighborhood or explore skilled lists offered by active volunteers. Fast coordination creates secure matching.
            </p>
          </div>
          
          <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:block">
            <Link to="/create-post">
              <Button variant="secondary" className="gap-2 bg-emerald-500 text-white hover:bg-emerald-600 border-none font-bold shadow-md shadow-emerald-600/30 px-6 py-3">
                <Plus className="h-5 w-5" />
                <span>Publish Listing</span>
              </Button>
            </Link>
          </div>

          {/* Background mesh decoration */}
          <div className="absolute top-[-40%] right-[-10%] w-[50%] h-[180%] bg-white/5 rounded-full transform rotate-45 pointer-events-none" />
        </div>

        {/* Toolbar & Filters Column */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 mb-8">
          
          {/* Main search and Type switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* SEARCH INPUT BAR */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="Search community posts by title, short summary, or username..."
                value={searchQuery}
                aria-label="Search posts"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset page on filter change
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-slate-930 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm transition-all bg-slate-50/50"
              />
            </div>

            {/* TYPE BADGES FILTER */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start lg:self-center border border-slate-200">
              {(['All', 'Request', 'Offer'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {type === 'All' ? 'All Formats' : type === 'Request' ? 'Help Requests' : 'Service Offers'}
                </button>
              ))}
            </div>

            {/* Refresh Live Button */}
            <button
              onClick={() => fetchFeed(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100 transition-colors cursor-pointer self-start lg:self-center"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Board</span>
            </button>
          </div>

          {/* Auxiliary Dropdown Filter options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1 border-t border-slate-100/80">
            
            {/* Category Filter option */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ListFilter className="h-3.5 w-3.5" /> Category Filter
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-250 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm cursor-pointer"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location filter opt */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Location Radius
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-slate-250 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm cursor-pointer"
              >
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? 'All Neighborhoods' : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting criteria */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Sorting Criteria
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-250 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm cursor-pointer"
              >
                <option value="latest">Latest Activities</option>
                <option value="popular">Most Popular (Likes)</option>
                <option value="nearest">Nearest (Neighborhood suggestions)</option>
              </select>
            </div>

            {/* Count Indicator stats column */}
            <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center justify-between border border-slate-200">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Results Found</p>
                <h4 className="text-xl font-extrabold text-slate-800 font-mono mt-0.5">{filteredPosts.length}</h4>
              </div>
              <Layers className="h-7 w-7 text-indigo-200" />
            </div>

          </div>

        </div>

        {/* Live Loading state or Posts Grid render */}
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium justify-center pb-3">
              <Loader className="h-4 w-4 animate-spin text-indigo-600" />
              <span>Querying live community feed database...</span>
            </div>
            <LoadingSkeleton type="card" count={4} />
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="py-10">
            <EmptyState
              title="No Matching Listings Found"
              description="There are currently no community requests or services matching those exact filters. Try broadening your keywords, resetting drop-downs, or post a new request!"
              iconName="Compass"
              actionText="Reset All Filters"
              onActionClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLocation('All');
                setSelectedType('All');
                setSortBy('latest');
              }}
            />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Grid display cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              {currentPosts.map((post) => (
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

            {/* Custom Pagination widget */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 pt-6 border-t border-slate-200/60 font-mono text-sm leading-none">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Prev
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePageChange(idx + 1)}
                    className={`h-11 w-11 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                      currentPage === idx + 1
                        ? 'bg-indigo-600 text-white font-extrabold border-transparent'
                        : 'border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 bg-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CommunityFeed;
