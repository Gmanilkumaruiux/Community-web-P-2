import React from 'react';
import { Heart, Mail, Phone, MapPin, Eye, Lock, RefreshCw } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const Footer: React.FC = () => {
  const { showModal } = useNotification();

  const handleOpenPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    showModal(
      'Privacy Policy',
      'The Community Help Platform is committed to safeguarding your personal data. We require user registrations only to support communication authenticity between helper volunteers and request creators. We never sell or share user data with any advertising networks.',
      'success'
    );
  };

  const handleOpenTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    showModal(
      'Terms of Service',
      'By using this platform, you agree to coordinate support activities respectfully, truthfully, and safely. Under no circumstances should members distribute spam, inappropriate content, or misleading requests.',
      'success'
    );
  };

  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-slate-905 overflow-hidden">
      {/* Decorative subtle ambient soft glow behind the footer */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* About Section */}
          <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-900/65 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-1.5 rounded-xl flex items-center justify-center shadow-md shadow-emerald-600/10 shrink-0">
                <Heart className="h-4.5 w-4.5 fill-current text-white" />
              </div>
              <span className="text-base font-extrabold tracking-tight">
                Community<span className="text-emerald-450 font-medium">Board</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mt-1">
              A community-first mutual aid platform offering a secure, user-friendly hub for neighbors to coordinate assistance, share critical skills, support local mutual requests, and look out for one another.
            </p>
          </div>
 
          {/* Quick Links Section */}
          <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-900/65 flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest text-emerald-450">
              Legals & Verification
            </h4>
            <ul className="space-y-3 mt-1">
              <li>
                <a
                  href="#privacy"
                  onClick={handleOpenPrivacy}
                  className="text-sm text-slate-400 hover:text-white transition-all flex items-center gap-2.5 cursor-pointer group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform shrink-0" />
                  <span className="group-hover:underline">Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={handleOpenTerms}
                  className="text-sm text-slate-400 hover:text-white transition-all flex items-center gap-2.5 cursor-pointer group"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform shrink-0" />
                  <span className="group-hover:underline">Terms of Service</span>
                </a>
              </li>
              <li>
                <div className="text-xs bg-emerald-500/5 text-emerald-400 hover:text-emerald-350 transition-colors inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-500 animate-spin-slow" /> 
                  <span className="font-semibold tracking-wide uppercase text-[10px]">Phase 2 Live Local Build</span>
                </div>
              </li>
            </ul>
          </div>
 
          {/* Contact Section */}
          <div className="bg-slate-900/30 p-6 rounded-2xl border border-slate-900/65 flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest text-emerald-450">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm mt-1">
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                  <Mail className="h-4 w-4 text-emerald-500" />
                </div>
                <a href="mailto:support@communityhelp.org" className="text-slate-450 hover:text-white transition-colors">
                  support@communityhelp.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                  <Phone className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-slate-400">+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                </div>
                <span className="text-slate-400 truncate text-[13px]">128 Unity Way, San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>
 
        <div className="border-t border-slate-900 mt-12 pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Community Help & Coordination Hub. All rights reserved.</p>
          <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-full border border-slate-800/80 text-slate-450 shadow-xs">
            <span className="font-semibold text-[11px] tracking-wide">Made for and by Neighbors</span>
            <Heart className="h-3 w-3 text-emerald-500 fill-emerald-500 animate-pulse shrink-0" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
