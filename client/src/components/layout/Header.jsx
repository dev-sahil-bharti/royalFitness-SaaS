import React from 'react';
import { Menu, Search, Bell, Calendar as CalendarIcon } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 bg-[#131b2c]/80 backdrop-blur-md border-b border-card-dark flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-card-dark rounded-lg text-slate-400 md:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-slate-200">Dashboard</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden md:flex relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search here..." 
            className="bg-bg-dark text-sm text-slate-200 placeholder-slate-500 rounded-lg pl-10 pr-4 py-2 border border-card-dark focus:outline-none focus:border-brand-yellow/50 transition-colors w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-card-dark rounded-lg text-slate-400 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-brand-yellow text-slate-900 text-[10px] font-bold flex items-center justify-center rounded-full">
            5
          </span>
        </button>

        {/* Date */}
        <div className="hidden md:flex items-center gap-2 bg-bg-dark border border-card-dark rounded-lg px-4 py-2">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">20 May 2024</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
