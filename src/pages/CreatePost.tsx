import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { helpService } from '../services/api';
import { PostType, UrgencyLevel, CommunityPost } from '../types';
import { Sparkles, HelpCircle, HandHelping, Upload, Image as ImageIcon, X, HelpCircle as HelpIcon, Flame, Heart } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const { showToast, showModal } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<PostType>('Request');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Errands & Delivery');
  const [location, setLocation] = useState('');
  const [contactPreference, setContactPreference] = useState('Email');
  
  // Type-specific field states
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>('Medium');
  const [availability, setAvailability] = useState('');

  // Categories list
  const categories = [
    'Errands & Delivery',
    'Education & Tutoring',
    'Home Repair & Handyman',
    'Pet Care',
    'Yard Work',
    'Disaster Relief',
    'General Support'
  ];

  // Locations list for friendly suggestion
  const popularLocations = [
    'Downtown Plains',
    'Westside Suburbs',
    'Central Heights',
    'East Valley',
    'Southside Gate'
  ];

  // Form Validation
  const validateForm = () => {
    if (!title.trim()) {
      showToast('Please enter a descriptive title', 'warning');
      return false;
    }
    if (title.trim().length < 5) {
      showToast('Title must be at least 5 characters long', 'warning');
      return false;
    }
    if (!description.trim()) {
      showToast('Please fill out the description with necessary details', 'warning');
      return false;
    }
    if (description.trim().length < 15) {
      showToast('Description must be at least 15 characters long to guide coordinators', 'warning');
      return false;
    }
    if (!location.trim()) {
      showToast('Please specify your current location or neighborhood', 'warning');
      return false;
    }
    if (activeTab === 'Offer' && !availability.trim()) {
      showToast('Please specify your availability so neighbors know when you are free', 'warning');
      return false;
    }
    return true;
  };

  // Image Upload Handling (Frontend simulation preserving data URL for preview rendering)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image file is too large. Max size allowed is 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        showToast('Image uploaded and optimized locally!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please drop a valid image file', 'error');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image file is too large. Max size is 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        showToast('Image dropped and attached successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachedImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Attached image removed', 'info');
  };

  // Default Categories Fallback Images for community visual flair
  const getDefaultCategoryImage = (selectedCat: string) => {
    switch (selectedCat) {
      case 'Errands & Delivery':
        return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
      case 'Education & Tutoring':
        return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600';
      case 'Home Repair & Handyman':
        return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600';
      case 'Pet Care':
        return 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600';
      case 'Yard Work':
        return 'https://images.unsplash.com/photo-1558905611-0bbd9ea18ab2?auto=format&fit=crop&q=80&w=600';
      case 'Disaster Relief':
        return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600';
      default:
        return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const finalImage = imagePreview || getDefaultCategoryImage(category);
      
      const postData: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'saves'> = {
        type: activeTab,
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        contactPreference,
        status: 'Open',
        imageUrl: finalImage,
        userEmail: user?.email || 'anonymous@communityhelp.org',
        userName: user?.name || 'Anonymous Neighbor',
        userAvatar: user?.avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`
      };

      if (activeTab === 'Request') {
        postData.urgencyLevel = urgencyLevel;
      } else {
        postData.availability = availability.trim();
      }

      await helpService.createPost(postData);

      showModal(
        'Post Created Successfully!',
        activeTab === 'Request'
          ? `Your help ticket "${title}" has been published securely to the live dashboard. Interested coordinators can now review your location details.`
          : `Your service offer listing "${title}" is now active on the public feed. Thank you for declaring your skills to help out Mrs. Gable and other neighbors!`,
        'success',
        () => {
          navigate('/feed');
        }
      );

    } catch (err: any) {
      showToast(err.message || 'Failed to submit community post details', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Title Heading */}
        <div className="text-center mb-8 animate-in slide-in-from-top-6 duration-300">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>Publish on Community Board</span>
            <Sparkles className="h-6 w-6 text-emerald-600 animate-pulse" />
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            Provide descriptive instructions and schedule preferences so active neighbors can coordinate actions accurately & safely.
          </p>
        </div>

        {/* Tab Switcher Area */}
        <div className="bg-slate-200/60 p-1.5 rounded-2xl flex items-center gap-1.5 mb-8 border border-slate-300/40 shadow-xs">
          <button
            onClick={() => {
              setActiveTab('Request');
              setCategory('Errands & Delivery');
            }}
            disabled={loading}
            className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'Request'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-300/20'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpIcon className="h-4.5 w-4.5 text-rose-500" />
            <span>Create Help Request</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('Offer');
              setCategory('Errands & Delivery');
            }}
            disabled={loading}
            className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'Offer'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-300/20'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HandHelping className="h-4.5 w-4.5 text-emerald-600" />
            <span>Offer Volunteer Skills</span>
          </button>
        </div>

        {/* Primary Form Layout card */}
        <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-sm animate-in fade-in duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Topic Info Indicator Box */}
            <div className={`p-4 rounded-xl border flex gap-3 ${
              activeTab === 'Request'
                ? 'bg-rose-50/60 border-rose-100 text-rose-800'
                : 'bg-emerald-50/60 border-emerald-100 text-emerald-800'
            }`}>
              {activeTab === 'Request' ? (
                <>
                  <Flame className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold">Posting a Help Request:</span> Neighbors will evaluate this card based on geography and urgency. Highlight specific timeframes and heavy details below.
                  </div>
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 fill-emerald-100" />
                  <div className="text-xs">
                    <span className="font-bold">Declaring a Volunteer Service:</span> Explain what help you can provide, required toolsets (if any), and available days. Fulfilling errands supports mutual center safety.
                  </div>
                </>
              )}
            </div>

            {/* Title Input */}
            <Input
              id="title"
              label={activeTab === 'Request' ? "What do you need support with? (Title)" : "Your Service Offer (Title)"}
              type="text"
              placeholder={activeTab === 'Request' ? "e.g. Elderly grocery collection support from Safeway" : "e.g. Free Saturday lawn care & mowing"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />

            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 select-none">Help Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Geography / Location Suggested Pick */}
            <div className="space-y-2">
              <Input
                id="location"
                label="Location / Neighborhood"
                type="text"
                placeholder="e.g. Westside Plains or 42nd Ave, Downtown"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                required
              />
              {/* Suggester Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 self-center mr-1 uppercase">suggestions:</span>
                {popularLocations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    disabled={loading}
                    className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-250 border border-slate-200/80 rounded-md text-slate-600 transition-colors cursor-pointer"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency selection (only for Request) */}
            {activeTab === 'Request' && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Urgency Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Low', 'Medium', 'High'] as UrgencyLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgencyLevel(level)}
                      disabled={loading}
                      className={`py-3 px-4 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        urgencyLevel === level
                          ? level === 'High'
                            ? 'bg-rose-50 border-rose-300 text-rose-700 font-extrabold focus:ring-2 focus:ring-rose-100'
                            : level === 'Medium'
                            ? 'bg-amber-50 border-amber-300 text-amber-700 font-extrabold focus:ring-2 focus:ring-amber-100'
                            : 'bg-slate-100 border-slate-400 text-slate-800 font-extrabold'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${
                        level === 'High' ? 'bg-rose-500' : level === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} />
                      <span>{level}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Availability details (only for Offer) */}
            {activeTab === 'Offer' && (
              <Input
                id="availability"
                label="When are you available? (Availability Schedule)"
                type="text"
                placeholder="e.g. Saturdays (9 AM - 1 PM) or Sunday afternoons"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                disabled={loading}
                required
              />
            )}

            {/* Contact Preference dropdown list */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700 select-none">Contact Preference</label>
              <select
                value={contactPreference}
                onChange={(e) => setContactPreference(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all text-sm cursor-pointer"
              >
                <option value="Email">Email</option>
                <option value="Portal Chat">Portal Chat (Phase 3)</option>
                <option value="Text Message">Text Message</option>
                <option value="Phone Call">Phone Call</option>
              </select>
            </div>

            {/* Rich Detailed Description Block */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Detailed Description</label>
              <textarea
                placeholder={
                  activeTab === 'Request'
                    ? "Explain the task comprehensively. For example, mention if there are heavy items to lift, stairs involved, preferred timings, and any special instructions."
                    : "Describe what services you provide. Mention any tools, trucks, lawn mowers you bring, previous volunteer experience, and what area radii you cover."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                required
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all resize-none leading-relaxed"
              />
              <span className="text-[11px] text-slate-400 text-right">
                Min. 15 characters required. Current length: {description.trim().length}
              </span>
            </div>

            {/* Drag and Drop Image Upload (Frontend local persistence representation) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Attach Post Image (Optional)</label>
              
              {!imagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-emerald-50/10 cursor-pointer transition-all duration-250 animate-in fade-in"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                  />
                  <div className="bg-white p-3 rounded-xl border border-slate-150 shadow-sm text-slate-400 mb-3 hover:text-emerald-500 transform transition-transform group-hover:scale-105">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Drag & Drop an image here, or <span className="text-emerald-600 hover:underline">browse</span></p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG up to 2MB. Drag and drop is fully operational.</p>
                </div>
              ) : (
                <div className="border border-slate-200 bg-slate-50 rounded-2xl overflow-hidden p-3 relative animate-in zoom-in-95 duration-200">
                  <div className="h-48 sm:h-56 w-full rounded-xl overflow-hidden border border-slate-150 relative">
                    <img src={imagePreview} alt="Preview" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={removeAttachedImage}
                      className="absolute top-3 right-3 bg-slate-900/40 hover:bg-rose-600 text-white p-1.5 rounded-full transition-colors backdrop-blur-xs cursor-pointer"
                      title="Remove Image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-emerald-700 font-semibold px-1">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>Image attached and ready for community publication!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="font-semibold bg-white text-slate-700 px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="font-bold px-6 py-2.5"
              >
                {activeTab === 'Request' ? 'Publish Help Request' : 'Publish Volunteer Service'}
              </Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
};

export default CreatePost;
