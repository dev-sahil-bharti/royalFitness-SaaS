import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Loader2, CheckCircle2, AlertCircle, 
  RefreshCw, X, Star, Zap, Ban, ShieldCheck, Tag
} from 'lucide-react';

const MebershipPlane = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Action feedback & Modals
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [processingId, setProcessingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    price: '',
    duration: '',
    durationType: 'months',
    features: '', // comma separated string in form, array in backend
    description: '',
    discount: '0',
    isPopular: false,
    isActive: true
  });

  const fetchPlans = async () => {
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/plans', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setPlans(result.data);
      } else {
        setError(result.message || 'Failed to retrieve plans.');
      }
    } catch (err) {
      setError('Server disconnected. Verify your node backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const triggerToast = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage({ type: '', text: '' });
    }, 3500);
  };

  const resetForm = () => {
    setFormData({
      _id: '', name: '', price: '', duration: '', durationType: 'months',
      features: '', description: '', discount: '0', isPopular: false, isActive: true
    });
    setIsEditing(false);
  };

  const handleOpenEdit = (plan) => {
    setFormData({
      ...plan,
      features: plan.features ? plan.features.join(', ') : '',
      discount: plan.discount || 0
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // --- Actions Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const token = localStorage.getItem('adminToken');
    const url = isEditing 
      ? `http://localhost:5000/api/admin/plans/${formData._id}` 
      : 'http://localhost:5000/api/admin/plans';
      
    const method = isEditing ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f)
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (response.ok && result.success) {
        triggerToast('success', result.message);
        fetchPlans(); // Refresh the list to reflect changes
        setShowModal(false);
        resetForm();
      } else {
        triggerToast('error', result.message || 'Operation failed.');
      }
    } catch (err) {
      triggerToast('error', 'Network failure.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete plan "${name}"?`)) return;
    
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setPlans(plans.filter(p => p._id !== id));
        triggerToast('success', 'Plan deleted successfully.');
      } else {
        triggerToast('error', result.message || 'Failed to delete.');
      }
    } catch (err) {
      triggerToast('error', 'Network disconnect. Delete failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleStatus = async (id, currentIsActive) => {
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/plans/${id}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setPlans(plans.map(p => p._id === id ? { ...p, isActive: !currentIsActive } : p));
        triggerToast('success', result.message);
      } else {
        triggerToast('error', result.message || 'Update failed.');
      }
    } catch (err) {
      triggerToast('error', 'Network error.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleTogglePopular = async (id, currentIsPopular) => {
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/plans/${id}/popular`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setPlans(plans.map(p => p._id === id ? { ...p, isPopular: !currentIsPopular } : p));
        triggerToast('success', result.message);
      } else {
        triggerToast('error', result.message || 'Update failed.');
      }
    } catch (err) {
      triggerToast('error', 'Network error.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn pb-16 relative">
      
      {/* Header Row & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Membership Plans</h1>
          <p className="text-slate-400 text-sm mt-1">Create and manage subscription tiers for gym members.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={fetchPlans}
            className="p-2.5 bg-[#131b2c] hover:bg-card-dark border border-card-dark text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer shadow-lg"
            title="Refresh plans"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-brand-yellow' : ''}`} />
          </button>
          
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 font-extrabold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
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

      {/* Main Content Area */}
      {loading && plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400 bg-[#131b2c] rounded-3xl border border-card-dark">
          <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
          <p className="text-sm font-medium tracking-wider">Loading Plans...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6 bg-[#131b2c] rounded-3xl border border-card-dark">
          <AlertCircle className="w-12 h-12 text-rose-500 opacity-80" />
          <h3 className="text-lg font-bold text-slate-200">Data Retrieval Mismatch</h3>
          <p className="text-slate-500 text-sm max-w-sm">{error}</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3 text-center bg-[#131b2c] rounded-3xl border border-card-dark">
          <Tag className="w-12 h-12 opacity-30 mb-2 text-slate-500" />
          <p className="text-slate-300 font-bold text-base">No membership plans available.</p>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="text-brand-yellow font-bold text-sm hover:underline cursor-pointer"
          >
            Create your first plan now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isProcessed = processingId === plan._id;
            
            return (
              <div 
                key={plan._id} 
                className={`relative flex flex-col bg-[#131b2c] border rounded-3xl p-6 transition-all shadow-xl hover:shadow-brand-yellow/5 ${
                  plan.isPopular ? 'border-brand-yellow' : 'border-card-dark'
                } ${!plan.isActive && 'opacity-60 grayscale-50'}`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-yellow text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-brand-yellow/20">
                    <Star className="w-3 h-3 fill-current" /> Popular Choice
                  </div>
                )}
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{plan.duration} {plan.durationType}</p>
                  </div>
                  
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenEdit(plan)}
                      disabled={isProcessed}
                      title="Edit Plan"
                      className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(plan._id, plan.name)}
                      disabled={isProcessed}
                      title="Delete Plan"
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors cursor-pointer"
                    >
                      {isProcessed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">${plan.price}</span>
                  {plan.discount > 0 && (
                    <span className="ml-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                      -{plan.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Description & Features */}
                <p className="text-sm text-slate-400 mb-6 grow">{plan.description}</p>
                
                <div className="space-y-3 mb-8 grow">
                  {plan.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Toggles */}
                <div className="pt-5 border-t border-card-dark flex justify-between gap-2 mt-auto">
                  <button 
                    onClick={() => handleTogglePopular(plan._id, plan.isPopular)}
                    disabled={isProcessed}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      plan.isPopular ? 'bg-brand-yellow/10 border-brand-yellow/20 text-brand-yellow' : 'bg-bg-dark border-card-dark text-slate-400 hover:text-white'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" /> {plan.isPopular ? 'Featured' : 'Feature'}
                  </button>
                  
                  <button 
                    onClick={() => handleToggleStatus(plan._id, plan.isActive)}
                    disabled={isProcessed}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      plan.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}
                  >
                    {plan.isActive ? <ShieldCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />} 
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                
              </div>
            );
          })}
        </div>
      )}

      {/* ================= ADD / EDIT PLAN MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#131b2c] border border-card-dark rounded-3xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-fadeInUp">
            
            <div className="p-6 border-b border-card-dark flex justify-between items-center bg-linear-to-r from-brand-yellow/10 to-transparent">
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Tag className="w-5 h-5 text-brand-yellow" />
                {isEditing ? 'Edit Membership Plan' : 'Create New Plan'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl bg-bg-dark border border-card-dark text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Plan Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Plan Name</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                    placeholder="e.g. Pro Monthly Plan"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Price (USD)</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Discount (%)</label>
                  <input 
                    type="number" min="0" max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Duration Value</label>
                  <input 
                    type="number" required min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                    placeholder="e.g. 3"
                  />
                </div>

                {/* Duration Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Duration Unit</label>
                  <select 
                    value={formData.durationType}
                    onChange={(e) => setFormData({ ...formData, durationType: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-300 text-sm focus:outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all"
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>

                {/* Features */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Features (Comma Separated)</label>
                  <textarea 
                    rows="3"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all resize-none"
                    placeholder="Cardio access, Free WiFi, Personal Trainer..."
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Plan Description</label>
                  <textarea 
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/40 transition-all resize-none"
                    placeholder="A brief marketing description of the plan..."
                  />
                </div>

                {/* Toggles */}
                <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-5 h-5 rounded bg-bg-dark border-card-dark text-brand-yellow focus:ring-brand-yellow/30"
                    />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Mark as Popular Choice</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded bg-bg-dark border-card-dark text-emerald-500 focus:ring-emerald-500/30"
                    />
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Plan is currently Active</span>
                  </label>
                </div>
              </div>

              {/* Footer Action Buttons */}
              <div className="pt-6 border-t border-card-dark flex items-center justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-bg-dark border border-card-dark text-slate-300 font-bold rounded-xl hover:bg-card-dark transition-colors cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 font-extrabold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-w-[140px] text-sm"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MebershipPlane;
