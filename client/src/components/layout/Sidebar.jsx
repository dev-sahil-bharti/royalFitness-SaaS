import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  CreditCard,
  Calendar,
  UserCircle,
  CheckSquare,
  Dumbbell,
  Apple,
  Image,
  MessageSquare,
  Star,
  PieChart,
  Settings,
  ChevronDown
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Users / Members', icon: Users, path: '/users' },
    { name: 'Membership Plans', icon: CreditCard, path: '/plans' },
    { name: 'Trainers', icon: UserCircle, path: '/trainers' },
    { name: 'Bookings', icon: Calendar, path: '/bookings' },
    { name: 'Payments', icon: CreditCard, path: '/payments' },
    { name: 'Attendance', icon: CheckSquare, path: '/attendance' },
    { name: 'Workout Plans', icon: Dumbbell, path: '/workout-plans' },
    { name: 'Diet Plans', icon: Apple, path: '/diet-plans' },
    { name: 'Gallery', icon: Image, path: '/gallery' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Reviews', icon: Star, path: '/reviews' },
    { name: 'Reports', icon: PieChart, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-[#131b2c] flex flex-col border-r border-card-dark fixed left-0 top-0 overflow-y-auto md:flex">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <Dumbbell className="text-brand-yellow w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold tracking-wider text-brand-yellow">GYM</h1>
          <p className="text-xs text-slate-400 tracking-widest">DASHBOARD</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-brand-yellow text-slate-900 shadow-lg shadow-brand-yellow/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-card-dark'
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile Area */}
      <div className="p-4 mt-auto border-t border-card-dark">
        <Link to="/profile" className="flex items-center justify-between p-2 rounded-xl hover:bg-card-dark cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <img
              src="https://sahilbharti.netlify.app/img/headerProfile.jpg"
              alt="Admin"
              className="w-10 h-10 rounded-full border-2 border-card-dark object-cover"
            />
            <div className="text-left">
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
