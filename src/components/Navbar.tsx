import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  Heart, 
  LogOut, 
  LayoutDashboard, 
  Home as HomeIcon, 
  Compass, 
  PlusCircle, 
  Bookmark, 
  FileText,
  User as UserIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  ChevronDown,
  Calendar
} from 'lucide-react';
import Button from './common/Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setShowProfileDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setShowProfileDropdown(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => {
    return `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
      isActive(path)
        ? 'text-emerald-700 bg-emerald-50 font-bold shadow-xs'
        : 'text-slate-605 hover:text-slate-900 hover:bg-slate-50'
    }`;
  };

  const mobileLinkClass = (path: string) => {
    return `block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
      isActive(path)
        ? 'text-emerald-700 bg-emerald-50 border-l-4 border-emerald-600 pl-3 font-bold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-1.5 rounded-xl group-hover:scale-105 transition-all duration-350 shadow-md shadow-emerald-600/10 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 100 100"
                  className="h-5 w-5 text-white"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#d1fae5" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M50 22 C32 22, 20 38, 20 54 C20 70, 50 86, 50 86 C50 86, 80 70, 80 54 C80 38, 68 22, 50 22 Z"
                    stroke="url(#logo-gradient)"
                    strokeWidth="8.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M38 58 L50 46 L62 58"
                    stroke="url(#logo-gradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M44 58 L44 70 L56 70 L56 58"
                    stroke="url(#logo-gradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="50"
                    cy="35"
                    r="6.5"
                    fill="url(#logo-gradient)"
                  />
                </svg>
              </div>
              <span className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                Community<span className="text-emerald-650 font-medium font-sans">Board</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            <Link to="/" className={linkClass('/')}>
              <HomeIcon className="h-4 w-4 text-slate-400" /> <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={linkClass('/dashboard')}>
                  <LayoutDashboard className="h-4 w-4 text-slate-400" /> <span>Dashboard</span>
                </Link>

                <Link to="/feed" className={linkClass('/feed')}>
                  <Compass className="h-4 w-4 text-slate-400" /> <span>Board Feed</span>
                </Link>

                <Link to="/create-post" className={linkClass('/create-post')}>
                  <PlusCircle className="h-4 w-4 text-emerald-500 animate-pulse" /> <span>Create Post</span>
                </Link>

                <Link to="/my-posts" className={linkClass('/my-posts')}>
                  <FileText className="h-4 w-4 text-slate-400" /> <span>My Posts</span>
                </Link>

                <Link to="/saved-posts" className={linkClass('/saved-posts')}>
                  <Bookmark className="h-4 w-4 text-slate-400" /> <span>Saved</span>
                </Link>
                
                {/* User Dropdown Trigger */}
                <div className="h-5 w-[1px] bg-slate-250/60 mx-1.5" />
                
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                    title="View details & logout"
                  >
                    <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-550 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-emerald-300 uppercase shrink-0">
                      {user?.name ? user.name.slice(0, 2) : 'US'}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 max-w-[85px] truncate hidden lg:inline">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Popup Box */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2.5 w-76 bg-white/95 rounded-2xl border border-slate-100 shadow-xl shadow-slate-900/10 py-4 px-4 z-50 divide-y divide-slate-100 animate-in fade-in-50 zoom-in-95 duration-200 backdrop-blur-md">
                      {/* Dropdown Card Header Details */}
                      <div className="pb-3.5">
                        <div className="flex items-center gap-3">
                          <span className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-sm border border-emerald-200 uppercase shrink-0">
                            {user?.name ? user.name.slice(0, 2) : 'US'}
                          </span>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-slate-900 truncate leading-snug">{user?.name}</h4>
                            <p className="text-[11px] font-mono text-emerald-600 tracking-wide mt-0.5 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md inline-block">
                              Active Member
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown User Info Blocks */}
                      <div className="py-3 space-y-2.5">
                        <div className="flex items-center gap-2.5 text-slate-600">
                          <MailIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <div className="overflow-hidden">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Email Address</p>
                            <p className="text-xs text-slate-700 truncate">{user?.email}</p>
                          </div>
                        </div>

                        {user?.mobile && (
                          <div className="flex items-center gap-2.5 text-slate-600">
                            <PhoneIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Mobile Number</p>
                              <p className="text-xs text-slate-700 font-semibold">{user.mobile}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2.5 text-slate-600">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Joined Hub</p>
                            <p className="text-xs text-slate-705">
                              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'June 2026'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Logout Action section */}
                      <div className="pt-2.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-605 hover:text-rose-700 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border border-rose-100/50"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Logout Hub Session</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="h-5 w-[1px] bg-slate-200 mx-1" />
                <Link to="/login" className={linkClass('/login')}>
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="font-semibold py-1.5 px-3.5 cursor-pointer text-xs shadow-xs shadow-emerald-600/5">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
              aria-expanded="false"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white animate-in slide-in-from-top-3 duration-250">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={mobileLinkClass('/')}
            >
              <span className="flex items-center gap-2.5">
                <HomeIcon className="h-5 w-5" /> Home
              </span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClass('/dashboard')}
                >
                  <span className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-5 w-5" /> Dashboard
                  </span>
                </Link>

                <Link
                  to="/feed"
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClass('/feed')}
                >
                  <span className="flex items-center gap-2.5">
                    <Compass className="h-5 w-5" /> Board Feed
                  </span>
                </Link>

                <Link
                  to="/create-post"
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClass('/create-post')}
                >
                  <span className="flex items-center gap-2.5">
                    <PlusCircle className="h-5 w-5" /> Create Post
                  </span>
                </Link>

                <Link
                  to="/my-posts"
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClass('/my-posts')}
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="h-5 w-5" /> My Posts
                  </span>
                </Link>

                <Link
                  to="/saved-posts"
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClass('/saved-posts')}
                >
                  <span className="flex items-center gap-2.5">
                    <Bookmark className="h-5 w-5" /> Saved Listings
                  </span>
                </Link>
                
                <div className="border-t border-slate-100 my-2 pt-2">
                  <div className="px-4 py-3 bg-slate-50/70 rounded-xl mx-2 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-xs border border-emerald-200 uppercase">
                        {user?.name ? user.name.slice(0, 2) : 'US'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-0.5">Member Account</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-2.5 border-t border-slate-200/50 space-y-1.5">
                      <p className="text-[11px] text-slate-505 flex items-center gap-1.5">
                        <MailIcon className="h-3 w-3 shrink-0 text-slate-400" /> {user?.email}
                      </p>
                      {user?.mobile && (
                        <p className="text-[11px] text-slate-505 flex items-center gap-1.5">
                          <PhoneIcon className="h-3 w-3 shrink-0 text-slate-400" /> {user.mobile}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-3 mt-3">
                    <Button 
                      variant="danger" 
                      onClick={handleLogout} 
                      className="w-full gap-2 py-2.5 text-xs font-bold"
                    >
                      <LogOut className="h-4 w-4" /> Logout Session
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-100 mt-3 pt-3 px-3 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full py-2.5 text-xs">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full py-2.5 text-xs">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
