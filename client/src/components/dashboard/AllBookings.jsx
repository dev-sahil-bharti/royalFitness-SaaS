import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle, XCircle, Loader2, Filter, RefreshCw, AlertCircle, 
  CheckCircle2, Calendar, User, Dumbbell, Clock, MoreVertical
} from 'lucide-react';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Search
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // all, Pending, Approved, etc.
  const [typeFilter, setTypeFilter] = useState(''); // all, membership, trainer
  
  // Action feedback
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [processingId, setProcessingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('adminToken');
    let url = 'http://localhost:5000/api/admin/bookings';
    
    const params = [];
    if (dateFilter) params.push(`date=${encodeURIComponent(dateFilter)}`);
    if (statusFilter) params.push(`status=${encodeURIComponent(statusFilter)}`);
    if (typeFilter) params.push(`type=${encodeURIComponent(typeFilter)}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setBookings(result.data);
      } else {
        setError(result.message || 'Failed to retrieve bookings.');
      }
    } catch (err) {
      setError('Server disconnected. Verify your node backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBookings();
    }, 350);
    
    return () => clearTimeout(delay);
  }, [dateFilter, statusFilter, typeFilter]);

  const triggerToast = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage({ type: '', text: '' });
    }, 3500);
  };

  const handleStatusChange = async (id, action) => {
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/bookings/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setBookings(bookings.map(booking => 
          booking._id === id ? { ...booking, status: result.data.status } : booking
        ));
        triggerToast('success', result.message);
      } else {
        triggerToast('error', result.message || `Failed to ${action} booking.`);
      }
    } catch (err) {
      triggerToast('error', 'Network error. Command failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    completed: bookings.filter(b => b.status === 'Completed').length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn pb-16 relative">
      
      {/* Header Row & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Bookings</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor and process membership and trainer bookings.</p>
        </div>

        {/* Quick Counter Ribbon */}
        <div className="flex gap-3 bg-[#131b2c] border border-card-dark p-1.5 rounded-2xl">
          <div className="px-4 py-1.5 text-center border-r border-card-dark/60">
            <p className="text-xs text-slate-500 font-semibold">TOTAL</p>
            <p className="text-lg font-bold text-slate-200">{stats.total}</p>
          </div>
          <div className="px-4 py-1.5 text-center border-r border-card-dark/60">
            <p className="text-xs text-amber-500 font-semibold">PENDING</p>
            <p className="text-lg font-bold text-amber-400">{stats.pending}</p>
          </div>
          <div className="px-4 py-1.5 text-center">
            <p className="text-xs text-emerald-500 font-semibold">COMPLETED</p>
            <p className="text-lg font-bold text-emerald-400">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Live Banner Alerts */}
      {actionMessage.text && (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border shadow-2xl animate-fadeInRight ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="text-sm font-semibold">{actionMessage.text}</span>
        </div>
      )}

      {/* Search Panel Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="relative flex-1 w-full md:w-auto">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#131b2c] border border-card-dark rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
            title="Filter by date"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-44">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-[#131b2c] border border-card-dark rounded-xl text-slate-300 text-sm focus:outline-none appearance-none font-medium cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="membership">Memberships</option>
              <option value="trainer">Trainers</option>
            </select>
          </div>

          <div className="relative w-full md:w-44">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-[#131b2c] border border-card-dark rounded-xl text-slate-300 text-sm focus:outline-none appearance-none font-medium cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button 
            onClick={() => {
              setDateFilter('');
              setTypeFilter('');
              setStatusFilter('');
            }}
            className="p-3 bg-[#131b2c] hover:bg-card-dark border border-card-dark text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer shrink-0 active:scale-95"
            title="Clear filters"
          >
            <XCircle className="w-5 h-5" />
          </button>
          
          <button 
            onClick={fetchBookings}
            className="p-3 bg-[#131b2c] hover:bg-card-dark border border-card-dark text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer shrink-0 active:scale-95"
            title="Refresh table"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-brand-yellow' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Database Table Deck */}
      <div className="bg-[#131b2c] border border-card-dark rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
        
        {loading && bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
            <p className="text-sm font-medium tracking-wider">Loading Bookings...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <AlertCircle className="w-12 h-12 text-rose-500 opacity-80" />
            <h3 className="text-lg font-bold text-slate-200">Data Retrieval Mismatch</h3>
            <p className="text-slate-500 text-sm max-w-sm">{error}</p>
            <button 
              onClick={fetchBookings}
              className="mt-4 px-5 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs rounded-xl hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              Force Sync
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center text-slate-500">
            <Calendar className="w-12 h-12 opacity-30 mb-2" />
            <p className="text-slate-300 font-bold text-base">No bookings found</p>
            <p className="text-slate-500 text-sm">We couldn't find match metrics for your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-bg-dark/50 border-b border-card-dark text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4.5">User Details</th>
                  <th className="px-6 py-4.5">Booking Details</th>
                  <th className="px-6 py-4.5">Amount & Date</th>
                  <th className="px-6 py-4.5">Status</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-dark/40">
                {bookings.map((booking) => {
                  const isProcessed = processingId === booking._id;
                  const isMembership = booking.type === 'membership';
                  
                  return (
                    <tr key={booking._id} className="hover:bg-card-dark/20 transition-colors group">
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow font-extrabold text-sm shadow-inner shrink-0 overflow-hidden">
                            {booking.user?.profileImage ? (
                                <img src={booking.user.profileImage} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-200 tracking-wide group-hover:text-white transition-colors">
                              {booking.user?.name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-slate-500">{booking.user?.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-2">
                            {isMembership ? (
                                <Dumbbell className="w-4 h-4 text-purple-400" />
                            ) : (
                                <User className="w-4 h-4 text-blue-400" />
                            )}
                            <div>
                                <p className="text-[13px] text-slate-300 font-medium">
                                    {isMembership ? (booking.plan?.name || 'N/A Plan') : (booking.trainer?.name || 'N/A Trainer')}
                                </p>
                                <p className="text-[11px] text-slate-500 uppercase tracking-wide">
                                    {booking.type}
                                </p>
                            </div>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <div className="space-y-0.5">
                          <p className="text-[14px] text-emerald-400 font-bold">${booking.amount}</p>
                          <p className="text-[11px] text-slate-500 flex gap-1.5 items-center">
                            <Clock className="w-3 h-3" />
                            {new Date(booking.date).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                            booking.status === 'Pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                            booking.status === 'Approved' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                            booking.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            booking.status === 'Cancelled' ? 'bg-slate-500/10 border-slate-500/20 text-slate-400' :
                            'bg-rose-500/10 border-rose-500/20 text-rose-400' // Rejected
                        }`}>
                            {booking.status}
                        </span>
                      </td>

                      <td className="px-6 py-4.5 text-right relative">
                        <div className="inline-flex items-center gap-2">
                           {booking.status === 'Pending' && (
                               <>
                                <button 
                                    onClick={() => handleStatusChange(booking._id, 'approve')}
                                    disabled={isProcessed}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={() => handleStatusChange(booking._id, 'reject')}
                                    disabled={isProcessed}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                                >
                                    Reject
                                </button>
                               </>
                           )}
                           {booking.status === 'Approved' && (
                               <button 
                                    onClick={() => handleStatusChange(booking._id, 'complete')}
                                    disabled={isProcessed}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                                >
                                    Mark Complete
                                </button>
                           )}
                           {(booking.status === 'Pending' || booking.status === 'Approved') && (
                                <button 
                                    onClick={() => handleStatusChange(booking._id, 'cancel')}
                                    disabled={isProcessed}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 border border-slate-500/20 transition-colors"
                                >
                                    Cancel
                                </button>
                           )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AllBookings;
