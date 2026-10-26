import React from 'react';
import { Mail } from 'lucide-react';

const messages = [
  {
    id: 1,
    name: 'Rohit Mehta',
    message: 'I have a query regarding personal training...',
    time: '10:20 AM',
    unread: true,
    color: 'bg-indigo-500'
  },
  {
    id: 2,
    name: 'Anjali Desai',
    message: 'What are the timings for yoga classes?',
    time: '09:15 AM',
    unread: true,
    color: 'bg-emerald-500'
  },
  {
    id: 3,
    name: 'Karan Gupta',
    message: 'I want to know about the discount...',
    time: 'Yesterday',
    unread: false,
    color: 'bg-blue-500'
  },
  {
    id: 4,
    name: 'Meera Joshi',
    message: 'How can I upgrade my membership?',
    time: 'Yesterday',
    unread: false,
    color: 'bg-orange-500'
  }
];

const RecentMessages = () => {
  return (
    <div className="bg-[#131b2c] p-6 rounded-2xl border border-card-dark flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-200">Recent Messages</h3>
        <button className="text-xs text-slate-400 hover:text-brand-yellow transition-colors bg-bg-dark border border-card-dark px-3 py-1.5 rounded-lg">
          View All
        </button>
      </div>
      
      <div className="flex flex-col gap-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-4 group cursor-pointer hover:bg-card-dark p-2 -mx-2 rounded-xl transition-colors">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${msg.color}`}>
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${msg.unread ? 'font-bold text-white' : 'font-semibold text-slate-200 group-hover:text-white transition-colors'}`}>
                {msg.name}
              </p>
              <p className={`text-xs truncate ${msg.unread ? 'text-slate-300' : 'text-slate-400'}`}>
                {msg.message}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] text-slate-400">{msg.time}</span>
              {msg.unread && (
                <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
