import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldAlert, Trash2, ShieldCheck, CheckCircle, XCircle, 
  Loader2, Filter, RefreshCw, UserX, AlertCircle, CheckCircle2, UserCheck, 
  FileSpreadsheet, UserPlus, X, Mail, Phone, Calendar, Lock, User
} from 'lucide-react';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, expired
  
  // Action feedback & Modals
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [processingId, setProcessingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Creation Form State
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: 'Male'
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('adminToken');
    let url = 'http://localhost:5000/api/admin/users';
    
    const params = [];
    if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
    if (statusFilter !== 'all') params.push(`status=${statusFilter}`);
    
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
        setUsers(result.data);
      } else {
        setError(result.message || 'Failed to retrieve members database.');
      }
    } catch (err) {
      setError('Server disconnected. Verify your node backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 350);
    
    return () => clearTimeout(delay);
  }, [searchQuery, statusFilter]);

  const triggerToast = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage({ type: '', text: '' });
    }, 3500);
  };

  // --- Actions Handlers ---

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage({ type: '', text: '' });

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: addForm.name,
          email: addForm.email,
          password: addForm.password,
          phone: addForm.phone,
          age: parseInt(addForm.age),
          gender: addForm.gender
        })
      });
      const result = await response.json();

      if (response.ok && result.success) {
        // Prepend user locally and trigger animations
        setUsers([result.data, ...users]);
        triggerToast('success', 'New user registered successfully!');
        
        // Close and reset
        setAddForm({ name: '', email: '', password: '', phone: '', age: '', gender: 'Male' });
        setShowAddModal(false);
      } else {
        triggerToast('error', result.message || 'Failed to create new user account.');
      }
    } catch (err) {
      triggerToast('error', 'Network failure. Verify local backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleBlock = async (id, currentBlockStatus) => {
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/block`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setUsers(users.map(user => 
          user._id === id ? { ...user, isActive: result.data.isActive } : user
        ));
        triggerToast('success', result.message);
      } else {
        triggerToast('error', result.message || 'Could not update block status.');
      }
    } catch (err) {
      triggerToast('error', 'Network error. Command failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleMembership = async (id, currentStatus) => {
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    const actionPath = currentStatus === 'active' ? 'deactivate' : 'activate';
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/membership/${actionPath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setUsers(users.map(user => 
          user._id === id ? { ...user, membershipStatus: result.data.membershipStatus } : user
        ));
        triggerToast('success', result.message);
      } else {
        triggerToast('error', result.message || 'Failed to alter membership rights.');
      }
    } catch (err) {
      triggerToast('error', 'Network error. Sync failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (id, userName) => {
    if (!window.confirm(`CRITICAL: Are you absolutely sure you want to permanently delete user "${userName}"? This action cannot be reverted.`)) {
      return;
    }
    
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setUsers(users.filter(user => user._id !== id));
        triggerToast('success', `Permanently removed ${userName} from registry.`);
      } else {
        triggerToast('error', result.message || 'Failed to execute delete command.');
      }
    } catch (err) {
      triggerToast('error', 'Network disconnect. Delete failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDownloadExcel = () => {
    if (users.length === 0) {
      triggerToast('error', 'No user records loaded to export!');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Age', 'Gender', 'Membership Status', 'Account Access', 'Registered Date'];
    const csvRows = users.map(user => [
      `"${(user.name || 'Anonymous').replace(/"/g, '""')}"`,
      `"${(user.email || '').replace(/"/g, '""')}"`,
      `"${(user.phone || '').replace(/"/g, '""')}"`,
      user.age || 'N/A',
      `"${user.gender || 'N/A'}"`,
      `"${(user.membershipStatus || 'expired').toUpperCase()}"`,
      `"${user.isActive ? 'ALLOWED' : 'SUSPENDED'}"`,
      `"${user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'N/A'}"`
    ]);

    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.setAttribute('href', downloadUrl);
    anchor.setAttribute('download', `Gym_Members_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    anchor.style.visibility = 'hidden';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    triggerToast('success', 'Excel Spreadsheet downloaded successfully!');
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.membershipStatus === 'active').length,
    blocked: users.filter(u => !u.isActive).length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn pb-16 relative">
      
      {/* Header Row & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Users & Members</h1>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 text-xs font-extrabold rounded-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] mt-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add User
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-1">Directly monitor active memberships, suspend users, or edit roles.</p>
        </div>

        {/* Quick Counter Ribbon */}
        <div className="flex gap-3 bg-[#131b2c] border border-card-dark p-1.5 rounded-2xl">
          <div className="px-4 py-1.5 text-center border-r border-card-dark/60">
            <p className="text-xs text-slate-500 font-semibold">TOTAL</p>
            <p className="text-lg font-bold text-slate-200">{stats.total}</p>
          </div>
          <div className="px-4 py-1.5 text-center border-r border-card-dark/60">
            <p className="text-xs text-emerald-500 font-semibold">ACTIVE</p>
            <p className="text-lg font-bold text-emerald-400">{stats.active}</p>
          </div>
          <div className="px-4 py-1.5 text-center">
            <p className="text-xs text-rose-500 font-semibold">SUSPENDED</p>
            <p className="text-lg font-bold text-rose-400">{stats.blocked}</p>
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text"
            placeholder="Search by legal name, contact number or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#131b2c] border border-card-dark rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-44">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-[#131b2c] border border-card-dark rounded-xl text-slate-300 text-sm focus:outline-none appearance-none font-medium cursor-pointer"
            >
              <option value="all">All Members</option>
              <option value="active">Active Plans</option>
              <option value="expired">Expired / None</option>
            </select>
          </div>

          <button 
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-lg shadow-emerald-600/10"
            title="Download Excel Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <button 
            onClick={fetchUsers}
            className="p-3 bg-[#131b2c] hover:bg-card-dark border border-card-dark text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer flex-shrink-0 active:scale-95"
            title="Refresh table"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-brand-yellow' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Database Table Deck */}
      <div className="bg-[#131b2c] border border-card-dark rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
        
        {loading && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
            <p className="text-sm font-medium tracking-wider">Synchronizing Registry Records...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <AlertCircle className="w-12 h-12 text-rose-500 opacity-80" />
            <h3 className="text-lg font-bold text-slate-200">Data Retrieval Mismatch</h3>
            <p className="text-slate-500 text-sm max-w-sm">{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-5 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs rounded-xl hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              Force Sync
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center text-slate-500">
            <UserX className="w-12 h-12 opacity-30 mb-2" />
            <p className="text-slate-300 font-bold text-base">No active records found</p>
            <p className="text-slate-500 text-sm">We couldn't find match metrics for your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#0f172a]/50 border-b border-card-dark text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4.5">User Details</th>
                  <th className="px-6 py-4.5">Contact Information</th>
                  <th className="px-6 py-4.5">Membership</th>
                  <th className="px-6 py-4.5">Access Gate</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-dark/40">
                {users.map((user) => {
                  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
                  const isProcessed = processingId === user._id;
                  
                  return (
                    <tr key={user._id} className="hover:bg-card-dark/20 transition-colors group">
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow font-extrabold text-sm shadow-inner shrink-0">
                            {initial}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-200 tracking-wide group-hover:text-white transition-colors">
                              {user.name || 'Anonymous Athlete'}
                            </p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <div className="space-y-0.5">
                          <p className="text-[13px] text-slate-300 font-medium">{user.phone || 'No phone'}</p>
                          <p className="text-[10.5px] text-slate-500 flex gap-2">
                            <span>Age: {user.age || 'N/A'}</span>
                            <span>•</span>
                            <span>Sex: {user.gender || 'N/A'}</span>
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        {user.membershipStatus === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        ) : user.membershipStatus === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase">
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-500/10 border border-card-dark text-slate-500 text-xs font-bold uppercase">
                            <XCircle className="w-3 h-3" /> {user.membershipStatus || 'Expired'}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4.5">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <ShieldCheck className="w-3 h-3" /> Allowed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full animate-pulse">
                            <ShieldAlert className="w-3 h-3" /> Suspended
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4.5 text-right">
                        <div className="inline-flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleMembership(user._id, user.membershipStatus)}
                            disabled={isProcessed}
                            title={user.membershipStatus === 'active' ? 'Suspend Plan' : 'Authorize Plan'}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              user.membershipStatus === 'active' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {user.membershipStatus === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>

                          <button 
                            onClick={() => handleToggleBlock(user._id, user.isActive)}
                            disabled={isProcessed}
                            title={user.isActive ? 'Suspend Access' : 'Revoke Suspension'}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              user.isActive ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20' : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
                            }`}
                          >
                            {user.isActive ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                          </button>

                          <button 
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            disabled={isProcessed}
                            title="Delete Profile"
                            className="p-2.5 bg-bg-dark border border-card-dark text-slate-500 hover:text-rose-400 hover:border-rose-500/20 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                          >
                            {isProcessed ? <Loader2 className="w-4 h-4 animate-spin text-brand-yellow" /> : <Trash2 className="w-4 h-4" />}
                          </button>
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

      {/* ================= ADD USER REGISTRY MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#131b2c] border border-card-dark rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInUp">
            
            {/* Header */}
            <div className="p-6 border-b border-card-dark flex justify-between items-center bg-linear-to-r from-brand-yellow/15 to-transparent">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-brand-yellow" />
                Register New Gym User
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl bg-bg-dark border border-card-dark text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full Legal Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" required
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" required
                      value={addForm.email}
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Phone Contact */}
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Phone Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" required
                      value={addForm.phone}
                      onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                      placeholder="e.g. +91 XXXXX"
                    />
                  </div>
                </div>

                {/* Secure Password */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Set Access Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="password" required minLength="6"
                      value={addForm.password}
                      onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                {/* Age Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="number" required min="10" max="100"
                      value={addForm.age}
                      onChange={(e) => setAddForm({ ...addForm, age: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                    />
                  </div>
                </div>

                {/* Gender Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Biological Gender</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select 
                      value={addForm.gender}
                      onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-300 text-sm focus:outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Footer Action Buttons */}
              <div className="pt-5 border-t border-card-dark flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-bg-dark border border-card-dark text-slate-300 text-xs font-bold rounded-xl hover:bg-card-dark transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 text-xs font-extrabold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:scale-100"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalize Registry'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AllUsers;
