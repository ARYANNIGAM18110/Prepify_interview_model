import React from 'react';
import {
  Briefcase,
  Search,
  BookOpen,
  Bot,
  Building,
  User,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenLogin,
  onOpenSignup,
  onShowToast
}) {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onShowToast) onShowToast('Logged out securely.');
    if (activeTab === 'dashboard') setActiveTab('home');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Briefcase },
    { id: 'internships', label: 'Internships', icon: Search },
    { id: 'dashboard', label: 'My Dashboard', icon: User, requiresAuth: true },
    { id: 'learning', label: 'Learning Hub', icon: BookOpen },
    { id: 'interview', label: 'AI Interview Prep', icon: Bot },
    { id: 'company', label: 'For Companies', icon: Building }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-purple-200">
            P
          </div>
          <div>
            <span className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Prepify
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Placement & Internship Gateway
            </span>
          </div>
        </div>

        {/* Universal Search */}
        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, skills, or companies..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* User Auth Section */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1.5 rounded-lg text-sm font-semibold">
                <User className="w-4 h-4 text-purple-600" />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition"
              >
                Log In
              </button>
              <button
                onClick={onOpenSignup}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 rounded-lg shadow-sm transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="border-t border-slate-100 bg-slate-50/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 sm:gap-4 py-1 text-sm font-medium">
          {navItems.map((tab) => {
            if (tab.requiresAuth && !currentUser) return null;
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-purple-700 bg-purple-100/70 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
