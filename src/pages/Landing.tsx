import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Users, HandHelping, ShieldCheck, ArrowRight, MessageSquareCode, Flame, HelpCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-white via-emerald-50/20 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Headline badge */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold px-4 py-1.5 mb-8 rounded-full shadow-xs">
            <Flame className="h-4 w-4 text-emerald-600 fill-emerald-100" />
            <span>Connecting Neighbors, Building Resilience</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            The Safe Way to <br />
            <span className="text-emerald-600">Give & Get Community Help</span>
          </h1>
          
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Need support with errands? Or looking to share your skills as a volunteer? Join our trusted neighborhood network to coordinate mutual aid securely.
          </p>

          {/* Action buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-[180px] justify-between group py-3.5">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform ml-2 shrink-0 text-emerald-100" />
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-[180px] py-3.5">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Platform Trust Grid Stats */}
          <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200/60 pt-10">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">1,240+</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Active Volunteers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">3,892</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Requests Closed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">100%</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Secure Accounts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">24/7</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">Trust Moderation</span>
            </div>
          </div>

        </div>

        {/* Decorative ambient blobs */}
        <div className="absolute top-1/2 left-[-15%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full filter blur-3xl -z-10 animate-pulse duration-5000"></div>
        <div className="absolute bottom-1 right-[-10%] w-[35%] h-[35%] bg-teal-100/35 rounded-full filter blur-3xl -z-10 animate-pulse duration-[7000ms]"></div>
      </section>

      {/* 2. Platform Introduction Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              A Platform Built on Trust, Unity, and Care
            </h2>
            <div className="w-12 h-1 bg-emerald-500 mx-auto mt-4 rounded-full" />
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              We understand that asking for aid can sometimes feel intimidating, and offering aid can feel difficult to coordinate. Our streamlined portal cuts through administrative stress so neighbors can support neighbors directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-emerald-50 text-emerald-700 flex items-center justify-center rounded-xl border border-emerald-100">
                  <span className="font-bold font-mono">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Sign Up Securing Your Email</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Create a verified email account to enter the community workspace. Security verification maintains member safety across all coordination points.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-emerald-50 text-emerald-700 flex items-center justify-center rounded-xl border border-emerald-100">
                  <span className="font-bold font-mono">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Post Request or Offer Services</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Instantly create help tickets with categories, descriptions, and contact info, or declare your skills to help on the open community board.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-emerald-50 text-emerald-700 flex items-center justify-center rounded-xl border border-emerald-100">
                  <span className="font-bold font-mono">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Directly Resolve & Build Connection</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Once a match is made, members coordinate directly to fulfill requests. Update ticket statuses in real time to display local achievements!
                  </p>
                </div>
              </div>
            </div>

            {/* Platform UI Showcase Mock Callout */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-150 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-slate-400 font-mono">Community Feed Preview</span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                  <div className="flex gap-2 items-center text-xs text-emerald-700 font-semibold mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>RECENT OPEN REQUEST</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Grocery Run for Elder Center</h4>
                  <p className="text-xs text-slate-500 mt-1">Need help collecting fresh vegetables for Saturday meals.</p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex gap-2 items-center text-xs text-indigo-600 font-semibold mb-1">
                    <span>ACTIVE SKILL OFFER</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Youth Mathematics Mentoring</h4>
                  <p className="text-xs text-slate-500 mt-1">Free virtual tutoring classes for grade school children.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed with Every Neighbor in Mind
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-605 leading-relaxed">
              Our Phase 2 live community architecture makes neighborhood interactions simple, straightforward, and secure. Focus purely on mutual coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Find Community Support */}
            <Card className="hover:shadow-md transition-all h-full bg-white flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 mb-6">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Find Community Support</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Post detailed support tickets specifying task categories (Errands, Home repair, pets, tutoring). Your requests are instantly listed on our live dashboard for active review.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                  Simple Tickets <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>

            {/* Offer Help */}
            <Card className="hover:shadow-md transition-all h-full bg-white flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 mb-6">
                  <HandHelping className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Offer Help & Skills</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Have surplus time, supplies, or skills? Let the community know! Publish your available service details on the board so coordinators can reach out to match roles.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                  Active Direct Matching <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>

            {/* Secure Communication */}
            <Card className="hover:shadow-md transition-all h-full bg-white flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Transparency</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Only authentic registered platform users can see coordinator details. Keeping records authenticated prevents automated bot scrapers from extracting private user contact metrics.
                </p>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                  100% Secure Sessions <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Bottom Call To Action Banner */}
      <section className="bg-emerald-700 text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Ready to Bring Your Neighbors Closer?
          </h2>
          <p className="mt-4 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Create an account in less than a minute. Log in to post support tickets, review skills requested nearby, or declare your availability to help out.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-[180px] text-emerald-800 bg-white hover:bg-emerald-50 py-3.5">
                Register Now
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-[180px] border-white/60 hover:bg-emerald-800 text-white py-3.5">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[150%] bg-white/5 rounded-full transform rotate-12 -z-0"></div>
      </section>

    </div>
  );
};

export default Landing;
