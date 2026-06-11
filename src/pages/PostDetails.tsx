import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { helpService } from '../services/api';
import { CommunityPost } from '../types';
import { ArrowLeft, Clock, MapPin, Calendar, Heart, Bookmark, User as UserIcon, ShieldAlert, BadgeCheck, CheckCircle2, ChevronRight, Mail, Trash2, Edit2, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ConfirmDialog from '../components/common/ConfirmDialog';

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast, showModal } = useNotification();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [revealContact, setRevealContact] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Load post details
  const loadPost = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const fetchedPost = await helpService.getPostById(id);
      if (!fetchedPost) {
        showToast('Community post not found.', 'error');
        navigate('/feed');
        return;
      }
      setPost(fetchedPost);
    } catch {
      showToast('Error loading listing details', 'error');
      navigate('/feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  // Like status helper
  const handleLikeToggle = async () => {
    if (!post || !user) return;
    try {
      const updated = await helpService.toggleLikePost(post.id, user.email);
      setPost(updated);
      showToast(updated.likes.includes(user.email) ? 'Added to Liked' : 'Removed Like', 'success');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  // Save status helper
  const handleSaveToggle = async () => {
    if (!post || !user) return;
    try {
      const updated = await helpService.toggleSavePost(post.id, user.email);
      setPost(updated);
      showToast(updated.saves.includes(user.email) ? 'Saved' : 'Removed Save', 'success');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  // Delete handler details
  const handleDeletePost = async () => {
    if (!post) return;
    try {
      await helpService.deletePost(post.id);
      showModal(
        'Listing Deleted Successfully',
        'The help/volunteer listing has been permanently removed from the community feed database.',
        'success',
        () => navigate('/feed')
      );
    } catch {
      showToast('Failed to delete post.', 'error');
    }
  };

  // Status transitioner handler (Allowed ONLY for owner)
  const handleStatusChange = async (newStatus: 'Open' | 'Pending' | 'Resolved') => {
    if (!post) return;
    setStatusLoading(true);
    try {
      const updated = await helpService.updatePost(post.id, { status: newStatus });
      setPost(updated);
      showToast(`Listing status updated to: ${newStatus}`, 'success');
    } catch {
      showToast('Failed to update status', 'error');
    } finally {
      setStatusLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-6">
          <div className="h-6 bg-slate-200 rounded-sm w-32 animate-pulse mb-4" />
        </div>
        <LoadingSkeleton type="details" />
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user?.email === post.userEmail;
  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Headcrumbs row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/feed')}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold group cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Community Board</span>
          </button>

          {isOwner && (
            <button
              onClick={() => setDeleteDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Post</span>
            </button>
          )}
        </div>

        {/* Layout details card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          
          {/* Post cover image banner section */}
          {post.imageUrl && (
            <div className="h-64 sm:h-80 md:h-96 w-full relative overflow-hidden bg-slate-100 border-b border-slate-200">
              <img src={post.imageUrl} alt={post.title} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              
              {/* Overlay Badge details */}
              <span className={`absolute top-6 left-6 text-xs font-extrabold px-3.5 py-1.5 rounded-full border tracking-wider uppercase backdrop-blur-xs ${
                post.type === 'Request'
                  ? 'bg-rose-500/90 text-white border-rose-400'
                  : 'bg-emerald-500/90 text-white border-emerald-400'
              }`}>
                {post.type} LISTING
              </span>
            </div>
          )}

          {/* Primary details content */}
          <div className="p-6 sm:p-8 md:p-10 space-y-6">
            
            {/* Owner avatar & name block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="h-12 w-12 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-250 shrink-0 flex items-center justify-center">
                  {post.userAvatar ? (
                    <img src={post.userAvatar} alt={post.userName} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-6 w-6 text-slate-400" />
                  )}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold text-slate-800 leading-none">{post.userName}</span>
                    <BadgeCheck className="h-4.5 w-4.5 text-emerald-500 fill-emerald-50" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono mt-0.5 inline-block">Published on {formattedDate}</span>
                </div>
              </div>

              {/* Likes & Saves interactive totals in header */}
              <div className="flex items-center gap-1.5 self-start sm:self-center">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    user && post.likes.includes(user.email)
                      ? 'text-rose-600 bg-rose-50 border-rose-150'
                      : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`h-4.5 w-4.5 ${user && post.likes.includes(user.email) ? 'fill-current text-rose-500' : ''}`} />
                  <span>{post.likes.length}</span>
                </button>

                <button
                  onClick={handleSaveToggle}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    user && post.saves.includes(user.email)
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-150'
                      : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                  aria-label="Bookmark post"
                >
                  <Bookmark className={`h-4.5 w-4.5 ${user && post.saves.includes(user.email) ? 'fill-current text-emerald-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Post details body block */}
            <div className="space-y-4">
              
              {/* Category, Location, Urgent level list */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 text-sm">
                
                {/* Category tag */}
                <span className="bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {post.category}
                </span>

                {/* Geography location details */}
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  <span>{post.location}</span>
                </span>

                {/* Offer availability details */}
                {post.type === 'Offer' && post.availability && (
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                    <span>Availability: <span className="font-bold text-slate-800">{post.availability}</span></span>
                  </span>
                )}

                {/* Request urgency level details */}
                {post.type === 'Request' && post.urgencyLevel && (
                  <span className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${
                      post.urgencyLevel === 'High' ? 'bg-rose-500 animate-pulse' : post.urgencyLevel === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                    }`} />
                    <span className={`font-bold transition-colors ${
                      post.urgencyLevel === 'High' ? 'text-rose-600 font-extrabold' : post.urgencyLevel === 'Medium' ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      {post.urgencyLevel} Urgency Priority
                    </span>
                  </span>
                )}

              </div>

              {/* Title heading */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {post.title}
              </h1>

              {/* Description body content */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line pt-2">
                {post.description}
              </p>

            </div>

            {/* Owner controls component (Allowed ONLY for creator) */}
            {isOwner && post.type === 'Request' && (
              <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Owner Request Control Panel</h4>
                </div>
                
                <p className="text-xs text-slate-500 leading-normal">
                  Update the status of this ticket in real time to tell active neighbors if this errand is still open, in progress, or recently finalized.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 max-w-xs">
                    <select
                      value={post.status}
                      disabled={statusLoading}
                      onChange={(e) => handleStatusChange(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm cursor-pointer font-semibold"
                    >
                      <option value="Open">🟢 Ticket status: Open</option>
                      <option value="Pending">🟡 Ticket status: Pending (In Progress)</option>
                      <option value="Resolved">✅ Ticket status: Resolved (Success!)</option>
                    </select>
                  </div>

                  {statusLoading && (
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 animate-spin text-slate-500" /> Updating status...
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Contact preference display panel */}
            <div className={`p-6 rounded-2xl border ${
              post.type === 'Request' ? 'bg-rose-50/40 border-rose-100' : 'bg-emerald-50/40 border-emerald-100'
            } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2.5">
                  <Mail className={`h-4.5 w-4.5 ${post.type === 'Request' ? 'text-rose-500' : 'text-emerald-600'}`} />
                  <span>Secure Contact Preference Details</span>
                </h4>
                <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                  The listing creator prefers coordination via <span className="font-bold text-slate-800">{post.contactPreference}</span>. Verification ensures absolute neighbor safety.
                </p>
              </div>

              {!revealContact ? (
                <Button
                  variant={post.type === 'Request' ? 'primary' : 'secondary'}
                  className={`font-semibold text-xs py-2 px-4 shadow-sm shrink-0 border-none truncate cursor-pointer ${
                    post.type === 'Request' ? 'hover:bg-rose-600' : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                  onClick={() => {
                    setRevealContact(true);
                    showToast('Private coordinator details visible below!', 'success');
                  }}
                >
                  Reveal Coordinator info
                </Button>
              ) : (
                <div className="p-3 bg-white border border-slate-200.5 rounded-xl font-mono text-xs flex flex-col justify-center animate-in zoom-in-95 duration-200 self-start sm:self-center shrink-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 font-sans">verified email:</p>
                  <a href={`mailto:${post.userEmail}`} className="text-indigo-600 hover:underline font-bold font-mono">
                    {post.userEmail}
                  </a>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Delete confirmation dialog box */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeletePost}
        title="Confirm permanent deletion of listing?"
        message={`Are you fully confident you want to delete "${post.title}"? This listing will be immediately erased from the community feed database and can not be recovered.`}
        confirmText="Yes, delete permanently"
        isDanger={true}
      />

    </div>
  );
};

export default PostDetails;
