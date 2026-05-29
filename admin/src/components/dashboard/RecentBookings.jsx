import React from 'react';

const getStatusStyle = (status) => {
  switch (status) {
    case 'Approved':
    case 'Completed':
    case 'Confirmed':
      return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    case 'Pending':
      return 'text-brand-yellow bg-brand-yellow/10 border-brand-yellow/20';
    case 'Cancelled':
    case 'Rejected':
      return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    default:
      return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
};

const RecentBookings = ({ bookings = [] }) => {
  const displayBookings = bookings.length > 0 ? bookings : [
    {
      _id: 1,
      user: { name: 'Rahul Sharma', profileImage: '' },
      plan: { name: 'Premium Plan' },
      createdAt: '2024-05-20T10:30:00.000Z',
      status: 'Confirmed'
    },
    {
      _id: 2,
      user: { name: 'Priya Verma', profileImage: '' },
      plan: { name: 'Standard Plan' },
      createdAt: '2024-05-20T11:00:00.000Z',
      status: 'Pending'
    },
    {
      _id: 3,
      user: { name: 'Amit Singh', profileImage: '' },
      plan: { name: 'Basic Plan' },
      createdAt: '2024-05-20T11:30:00.000Z',
      status: 'Confirmed'
    },
    {
      _id: 4,
      user: { name: 'Sneha Patel', profileImage: '' },
      plan: { name: 'Gold Plan' },
      createdAt: '2024-05-20T12:00:00.000Z',
      status: 'Cancelled'
    }
  ];

  return (
    <div className="bg-[#131b2c] p-6 rounded-2xl border border-card-dark flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-200">Recent Bookings</h3>
        <a href="/bookings" className="text-xs text-slate-400 hover:text-brand-yellow transition-colors bg-bg-dark border border-card-dark px-3 py-1.5 rounded-lg">
          View All
        </a>
      </div>
      
      <div className="flex flex-col gap-4">
        {displayBookings.map((booking) => {
          const userName = booking.user?.name || 'Unknown User';
          const planName = booking.plan?.name || booking.trainer?.name || 'Membership Plan';
          const dateStr = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
          const timeStr = booking.createdAt ? new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';
          const userAvatar = booking.user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40&q=80';

          return (
            <div key={booking._id || booking.id} className="flex items-center justify-between group cursor-pointer hover:bg-card-dark p-2 -mx-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{userName}</p>
                  <p className="text-xs text-slate-400">{planName}</p>
                </div>
              </div>
              <div className="text-right flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6">
                <div className="hidden sm:block">
                  <p className="text-sm text-slate-300">{dateStr}</p>
                  <p className="text-xs text-slate-400">{timeStr}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusStyle(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentBookings;
