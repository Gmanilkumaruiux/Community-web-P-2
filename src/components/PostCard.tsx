import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, MapPin, Calendar, Clock, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { CommunityPost } from '../types';
import { useAuth } from '../context/AuthContext';
import Card from './common/Card';
import Button from './common/Button';

interface PostCardProps {
  post: CommunityPost;
  onLikeToggle?: (id: string) => void;
  onSaveToggle?: (id: string) => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLikeToggle,
  onSaveToggle,
  isLiked = false,
  isSaved = false,
}) => {
  const { user } = useAuth();

  // Categories helper to map visually matching styles
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Errands & Delivery':
        return 'bg-amber-50 text-amber-700 border-amber-100/60';
      case 'Education & Tutoring':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100/60';
      case 'Home Repair & Handyman':
        return 'bg-stone-50 text-stone-700 border-stone-150';
      case 'Pet Care':
        return 'bg-pink-50 text-pink-700 border-pink-100/60';
      case 'Yard Work':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100/60';
      case 'Disaster Relief':
        return 'bg-rose-50 text-rose-700 border-rose-100/60';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="hover:shadow-md transition-all duration-300 border-slate-200/80 bg-white flex flex-col justify-between h-full relative overflow-hidden group">
      
      {/* Visual Accent depending on type */}
      <div className={`absolute top-0 left-0 w-full h-[3px] ${
        post.type === 'Request' ? 'bg-rose-500' : 'bg-emerald-500'
      }`} />

      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between gap-4">
        <div>
          {/* Header metadata: Author Avatar, Name, Type Badge */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-9 w-9 rounded-full overflow-hidden bg-slate-100 border border-slate-150 flex items-center justify-center shrink-0">
                {post.userAvatar ? (
                  <img src={post.userAvatar} alt={post.userName} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-bold text-slate-600 text-xs uppercase">
                    {post.userName.slice(0, 2)}
                  </span>
                )}
              </span>
              <div>
                <p className="text-sm font-bold text-slate-800 line-clamp-1">{post.userName}</p>
                <p className="text-[10px] font-medium text-slate-400 font-mono tracking-wider">
                  {post.userEmail === user?.email ? 'YOU' : 'COMMUNITY'}
                </p>
              </div>
            </div>

            {/* Type badge (Request / Offer) */}
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border tracking-wide uppercase shadow-2xs ${
              post.type === 'Request'
                ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
            }`}>
              {post.type}
            </span>
          </div>

          {/* Post Image (Frontend upload mock display) */}
          {post.imageUrl && (
            <div className="mb-4 h-40 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50 relative">
              <img src={post.imageUrl} alt={post.title} referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103" />
              
              {/* Request status overlays on image */}
              {post.type === 'Request' && (
                <span className={`absolute bottom-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md border text-white tracking-widest uppercase ${
                  post.status === 'Resolved'
                    ? 'bg-emerald-600 border-emerald-500 shadow-sm'
                    : post.status === 'Pending'
                    ? 'bg-amber-600 border-amber-500 shadow-sm'
                    : 'bg-rose-600 border-rose-500 shadow-sm'
                }`}>
                  {post.status}
                </span>
              )}
            </div>
          )}

          {/* Category & Status (if no image) */}
          {!post.imageUrl && (
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${getCategoryStyles(post.category)}`}>
                {post.category}
              </span>
              
              {post.type === 'Request' && (
                <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border tracking-widest uppercase ${
                  post.status === 'Resolved'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : post.status === 'Pending'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {post.status}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug line-clamp-2 hover:text-emerald-700 transition-colors">
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </h4>

          {/* Description */}
          <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
            {post.description}
          </p>

          {/* Category overlay for posts with image */}
          {post.imageUrl && (
            <div className="mt-3">
              <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${getCategoryStyles(post.category)}`}>
                {post.category}
              </span>
            </div>
          )}
        </div>

        {/* Footer info and CTA controls */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-3 justify-end">
          {/* Location / Date details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-600">{post.location}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{formattedDate}</span>
            </span>
            {post.type === 'Request' && post.urgencyLevel && (
              <span className="flex items-center gap-1 ml-auto">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  post.urgencyLevel === 'High' ? 'bg-rose-500' : post.urgencyLevel === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
                <span className={`font-bold uppercase text-[9px] tracking-wider ${
                  post.urgencyLevel === 'High' ? 'text-rose-600' : post.urgencyLevel === 'Medium' ? 'text-amber-600' : 'text-slate-500'
                }`}>
                  {post.urgencyLevel} Urgency
                </span>
              </span>
            )}
            
            {post.type === 'Offer' && post.availability && (
              <span className="flex items-center gap-1 ml-auto text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                <Clock className="h-3 w-3 text-slate-400" />
                <span className="truncate max-w-[100px]">{post.availability}</span>
              </span>
            )}
          </div>

          {/* Action Row: Likes, Saves, View Details CTA */}
          <div className="flex items-center justify-between border-t border-slate-50/50 pt-3">
            <div className="flex items-center gap-1.5">
              {/* Like Button */}
              <button
                onClick={() => onLikeToggle && onLikeToggle(post.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isLiked
                    ? 'text-rose-600 bg-rose-50 border-rose-150 animate-pulse'
                    : 'text-slate-500 bg-slate-50 border-slate-200/60 hover:text-rose-600 hover:bg-rose-50/50 hover:border-rose-100'
                }`}
                aria-label="Like post"
              >
                <Heart className={`h-4 w-4 transition-transform ${isLiked ? 'scale-110 fill-current' : 'group-hover:scale-105'}`} />
                <span className="font-mono">{post.likes.length}</span>
              </button>

              {/* Save Button */}
              <button
                onClick={() => onSaveToggle && onSaveToggle(post.id)}
                className={`flex items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isSaved
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-150'
                    : 'text-slate-500 bg-slate-50 border-slate-200/60 hover:text-emerald-700 hover:bg-emerald-50/50 hover:border-emerald-100'
                }`}
                aria-label="Save post"
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* View Details Link */}
            <Link to={`/post/${post.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="group/btn gap-1 font-semibold text-xs py-1.5 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 pr-2 cursor-pointer bg-white"
              >
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover/btn:translate-x-0.5 group-hover/btn:text-emerald-600 transition-all shrink-0" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default PostCard;
