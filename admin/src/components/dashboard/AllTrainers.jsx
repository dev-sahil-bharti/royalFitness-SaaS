import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Loader2, CheckCircle2, AlertCircle, 
  RefreshCw, X, ShieldCheck, Ban, UserPlus, Phone, Mail, Award, Clock
} from 'lucide-react';

const AllTrainers = () => {
  const [trainers, setTrainers] = useState([]);
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
    email: '',
    phone: '',
    experience: '',
    specialization: '', // comma separated string in form, array in backend
    bio: '',
    availableSlots: '', // comma separated string in form, array in backend
    image: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    status: 'active'
  });

  const fetchTrainers = async () => {
    setLoading(true);
    setError('');
    
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/trainers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setTrainers(result.data);
      } else {
        setError(result.message || 'Failed to retrieve trainers.');
      }
    } catch (err) {
      setError('Server disconnected. Verify your node backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const triggerToast = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage({ type: '', text: '' });
    }, 3500);
  };

  const resetForm = () => {
    setFormData({
      _id: '', name: '', email: '', phone: '', experience: '',
      specialization: '', bio: '', availableSlots: '', image: '',
      instagram: '', facebook: '', twitter: '', linkedin: '', status: 'active'
    });
    setIsEditing(false);
  };

  const handleOpenEdit = (trainer) => {
    setFormData({
      ...trainer,
      specialization: trainer.specialization ? trainer.specialization.join(', ') : '',
      availableSlots: trainer.availableSlots ? trainer.availableSlots.join(', ') : '',
      instagram: trainer.socialLinks?.instagram || '',
      facebook: trainer.socialLinks?.facebook || '',
      twitter: trainer.socialLinks?.twitter || '',
      linkedin: trainer.socialLinks?.linkedin || ''
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
      ? `http://localhost:5000/api/admin/trainers/${formData._id}` 
      : 'http://localhost:5000/api/admin/trainers';
      
    const method = isEditing ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      specialization: formData.specialization.split(',').map(s => s.trim()).filter(s => s),
      availableSlots: formData.availableSlots.split(',').map(s => s.trim()).filter(s => s),
      socialLinks: {
        instagram: formData.instagram,
        facebook: formData.facebook,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
      }
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
        fetchTrainers(); // Refresh the list
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
    if (!window.confirm(`CRITICAL: Are you sure you want to permanently delete trainer "${name}"?`)) return;
    
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/trainers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setTrainers(trainers.filter(t => t._id !== id));
        triggerToast('success', 'Trainer deleted successfully.');
      } else {
        triggerToast('error', result.message || 'Failed to delete.');
      }
    } catch (err) {
      triggerToast('error', 'Network disconnect. Delete failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/trainers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setTrainers(trainers.map(t => t._id === id ? { ...t, status: result.data.status } : t));
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Trainers</h1>
          <p className="text-slate-400 text-sm mt-1">Manage gym staff, specializations, and availability.</p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={fetchTrainers}
            className="p-2.5 bg-[#131b2c] hover:bg-card-dark border border-card-dark text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer shadow-lg"
            title="Refresh trainers"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-brand-yellow' : ''}`} />
          </button>
          
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 font-extrabold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add Trainer
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
      {loading && trainers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400 bg-[#131b2c] rounded-3xl border border-card-dark">
          <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
          <p className="text-sm font-medium tracking-wider">Loading Trainers...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6 bg-[#131b2c] rounded-3xl border border-card-dark">
          <AlertCircle className="w-12 h-12 text-rose-500 opacity-80" />
          <h3 className="text-lg font-bold text-slate-200">Data Retrieval Mismatch</h3>
          <p className="text-slate-500 text-sm max-w-sm">{error}</p>
        </div>
      ) : trainers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3 text-center bg-[#131b2c] rounded-3xl border border-card-dark">
          <UserPlus className="w-12 h-12 opacity-30 mb-2 text-slate-500" />
          <p className="text-slate-300 font-bold text-base">No trainers registered.</p>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="text-brand-yellow font-bold text-sm hover:underline cursor-pointer"
          >
            Add your first trainer now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => {
            const isProcessed = processingId === trainer._id;
            const isActive = trainer.status === 'active';
            
            return (
              <div 
                key={trainer._id} 
                className={`flex flex-col bg-[#131b2c] border rounded-3xl p-6 transition-all shadow-xl hover:shadow-brand-yellow/5 border-card-dark ${!isActive && 'opacity-70 grayscale-30'}`}
              >
                {/* Header & Image */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-brand-yellow/10 border-2 border-brand-yellow/30 flex items-center justify-center text-brand-yellow font-extrabold text-xl shadow-inner overflow-hidden shrink-0">
                      {trainer.image ? (
                        <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover" />
                      ) : (
                        trainer.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{trainer.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 break-all">{trainer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenEdit(trainer)}
                      disabled={isProcessed}
                      title="Edit Trainer"
                      className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(trainer._id, trainer.name)}
                      disabled={isProcessed}
                      title="Delete Trainer"
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors cursor-pointer"
                    >
                      {isProcessed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Phone className="w-4 h-4 text-slate-500" /> {trainer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Award className="w-4 h-4 text-brand-yellow" /> {trainer.experience} Years Experience
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {trainer.specialization?.map((spec, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-lg">
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-400 line-clamp-3 mb-6 grow">
                  {trainer.bio || "No bio provided."}
                </p>

                {/* Quick Toggles */}
                <div className="pt-5 border-t border-card-dark mt-auto">
                  <button 
                    onClick={() => handleToggleStatus(trainer._id, trainer.status)}
                    disabled={isProcessed}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                    }`}
                  >
                    {isActive ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />} 
                    {isActive ? 'Active Staff' : 'Inactive'}
                  </button>
                </div>
                
              </div>
            );
          })}
        </div>
      )}

      {/* ================= ADD / EDIT TRAINER MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#131b2c] border border-card-dark rounded-3xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden animate-fadeInUp max-h-[90vh] flex flex-col">
            
            <div className="p-6 border-b border-card-dark flex justify-between items-center bg-linear-to-r from-brand-yellow/10 to-transparent shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-brand-yellow" />
                {isEditing ? 'Edit Trainer Profile' : 'Register New Trainer'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl bg-bg-dark border border-card-dark text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Basic Info */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20"
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="text" required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Experience (Years)</label>
                  <input 
                    type="number" required min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20"
                  />
                </div>

                {/* Arrays & Details */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Specializations (Comma Separated)</label>
                  <input 
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20"
                    placeholder="e.g. Weightlifting, Yoga, HIIT"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Available Slots (Comma Separated)</label>
                  <input 
                    type="text"
                    value={formData.availableSlots}
                    onChange={(e) => setFormData({ ...formData, availableSlots: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20"
                    placeholder="e.g. Morning, 09:00 AM - 12:00 PM"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Bio / Description</label>
                  <textarea 
                    rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 resize-none"
                    placeholder="A short biography..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Profile Image URL</label>
                  <input 
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20"
                    placeholder="https://..."
                  />
                </div>

                {/* Social Links */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Instagram</label>
                  <input 
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Twitter</label>
                  <input 
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20"
                  />
                </div>

              </div>

              {/* Footer Action Buttons */}
              <div className="pt-6 border-t border-card-dark flex items-center justify-end gap-3 mt-4 shrink-0">
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
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? 'Save Changes' : 'Register Trainer'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AllTrainers;
