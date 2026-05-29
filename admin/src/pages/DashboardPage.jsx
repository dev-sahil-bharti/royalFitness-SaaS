import React, { useState, useEffect } from 'react';
import { Users, UserCircle, Calendar, CreditCard, Clock, Loader2, AlertCircle } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import MembershipChart from '../components/dashboard/MembershipChart';
import RecentBookings from '../components/dashboard/RecentBookings';
import TopTrainers from '../components/dashboard/TopTrainers';
import RecentMessages from '../components/dashboard/RecentMessages';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to retrieve dashboard stats.');
      }
    } catch (err) {
      setError('Server disconnected. Verify your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 text-slate-400">
        <Loader2 className="w-12 h-12 text-brand-yellow animate-spin" />
        <p className="text-sm font-semibold tracking-widest font-mono">RETRIEVING GYM ANALYTICS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3 text-center px-6">
        <AlertCircle className="w-14 h-14 text-rose-500 opacity-80" />
        <h3 className="text-xl font-bold text-slate-200">Retrieval Disconnect</h3>
        <p className="text-slate-500 text-sm max-w-sm">{error}</p>
        <button 
          onClick={fetchDashboardStats}
          className="mt-4 px-4 py-2 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 font-bold rounded-xl shadow-lg transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { metrics = {}, recentBookings = [], topTrainers = [] } = data || {};

  return (
    <div className="p-8 pb-20 animate-fadeIn">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <MetricCard
          title="Total Members"
          value={metrics.totalMembers || '0'}
          trend="up"
          trendValue="Live"
          icon={Users}
          colorClass="bg-brand-yellow"
          bgClass="bg-[#eab308]/10"
        />
        <MetricCard
          title="Active Members"
          value={metrics.activeMembers || '0'}
          trend="up"
          trendValue="Live"
          icon={UserCircle}
          colorClass="bg-blue-500"
          bgClass="bg-blue-500/10"
        />
        <MetricCard
          title="Total Bookings"
          value={metrics.totalBookings || '0'}
          trend="up"
          trendValue="Live"
          icon={Calendar}
          colorClass="bg-emerald-500"
          bgClass="bg-emerald-500/10"
        />
        <MetricCard
          title="Total Revenue"
          value={`₹${(metrics.totalRevenue || 0).toLocaleString('en-IN')}`}
          trend="up"
          trendValue="Live"
          icon={CreditCard}
          colorClass="bg-indigo-500"
          bgClass="bg-indigo-500/10"
        />
        <MetricCard
          title="Pending Bookings"
          value={metrics.pendingBookings || '0'}
          trend="down"
          trendValue="Live"
          icon={Clock}
          colorClass="bg-orange-500"
          bgClass="bg-orange-500/10"
          isPositive={false}
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <MembershipChart />
        </div>
      </div>

      {/* Bottom Lists Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecentBookings bookings={recentBookings} />
        <TopTrainers trainers={topTrainers} />
        <RecentMessages />
      </div>
    </div>
  );
};

export default DashboardPage;
