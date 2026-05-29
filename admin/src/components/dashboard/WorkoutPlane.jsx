import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Loader2, CheckCircle2, AlertCircle, 
  RefreshCw, X, ShieldCheck, Ban, Dumbbell, ChevronDown, ChevronUp, Play, Info
} from 'lucide-react';

const GOALS = ["Weight Loss", "Muscle Gain", "General Fitness", "Strength", "Cardio"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const WorkoutPlane = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering
  const [selectedGoal, setSelectedGoal] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  
  // Expanded Cards Tracker
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  // Modals & Action feed-backs
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [processingId, setProcessingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    goal: 'Weight Loss',
    level: 'Beginner',
    exercises: [],
    isActive: true
  });

  const fetchPlans = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('adminToken');
    
    // Construct query parameters
    const params = [];
    if (selectedGoal !== "All") params.push(`goal=${encodeURIComponent(selectedGoal)}`);
    if (selectedLevel !== "All") params.push(`level=${encodeURIComponent(selectedLevel)}`);
    const queryStr = params.length > 0 ? `?${params.join('&')}` : '';

    try {
      const response = await fetch(`http://localhost:5000/api/admin/workout-plans${queryStr}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setPlans(result.data);
      } else {
        setError(result.message || 'Failed to retrieve workout plans.');
      }
    } catch (err) {
      setError('Server disconnected. Verify your backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [selectedGoal, selectedLevel]);

  const triggerToast = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage({ type: '', text: '' });
    }, 3500);
  };

  const toggleExpandCard = (id) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  const resetForm = () => {
    setFormData({
      _id: '',
      title: '',
      goal: 'Weight Loss',
      level: 'Beginner',
      exercises: [],
      isActive: true
    });
    setIsEditing(false);
  };

  const handleOpenEdit = (plan) => {
    setFormData({
      ...plan,
      exercises: plan.exercises || []
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // --- Dynamic Exercises Form Helpers ---
  const handleAddExerciseRow = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        { day: 'Monday', exerciseName: '', sets: 3, reps: '10-12', restTime: '60s', instructions: '', videoUrl: '' }
      ]
    });
  };

  const handleRemoveExerciseRow = (index) => {
    const updated = [...formData.exercises];
    updated.splice(index, 1);
    setFormData({ ...formData, exercises: updated });
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = [...formData.exercises];
    updated[index][field] = value;
    setFormData({ ...formData, exercises: updated });
  };

  // --- Actions Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const token = localStorage.getItem('adminToken');
    const url = isEditing 
      ? `http://localhost:5000/api/admin/workout-plans/${formData._id}` 
      : 'http://localhost:5000/api/admin/workout-plans';
      
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (response.ok && result.success) {
        triggerToast('success', result.message);
        fetchPlans(); 
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

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete workout plan "${title}"?`)) return;
    
    setProcessingId(id);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/workout-plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        setPlans(plans.filter(p => p._id !== id));
        triggerToast('success', 'Workout plan deleted successfully.');
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
      const response = await fetch(`http://localhost:5000/api/admin/workout-plans/${id}/status`, {
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

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn pb-16 relative">
      
      {/* Header Row & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-brand-yellow" />
            Workout Plans
          </h1>
          <p className="text-slate-400 text-sm mt-1">Create goal-oriented workout routines for members.</p>
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
            Create Routine
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-[#131b2c] border border-card-dark rounded-3xl p-5 mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Goal Focus:</span>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedGoal("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedGoal === "All" ? 'bg-brand-yellow text-slate-950' : 'bg-bg-dark border border-card-dark text-slate-400'}`}
            >
              All Goals
            </button>
            {GOALS.map(g => (
              <button 
                key={g}
                onClick={() => setSelectedGoal(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedGoal === g ? 'bg-brand-yellow text-slate-950' : 'bg-bg-dark border border-card-dark text-slate-400'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-card-dark/30">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience Level:</span>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedLevel("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedLevel === "All" ? 'bg-brand-yellow text-slate-950' : 'bg-bg-dark border border-card-dark text-slate-400'}`}
            >
              All Levels
            </button>
            {LEVELS.map(l => (
              <button 
                key={l}
                onClick={() => setSelectedLevel(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedLevel === l ? 'bg-brand-yellow text-slate-950' : 'bg-bg-dark border border-card-dark text-slate-400'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Alert Feed-back */}
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

      {/* Main Grid View */}
      {loading && plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400 bg-[#131b2c] rounded-3xl border border-card-dark">
          <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
          <p className="text-sm font-medium tracking-wider">Loading Routines...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6 bg-[#131b2c] rounded-3xl border border-card-dark">
          <AlertCircle className="w-12 h-12 text-rose-500 opacity-80" />
          <h3 className="text-lg font-bold text-slate-200">Retrieval Mismatch</h3>
          <p className="text-slate-500 text-sm max-w-sm">{error}</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3 text-center bg-[#131b2c] rounded-3xl border border-card-dark">
          <Dumbbell className="w-12 h-12 opacity-30 mb-2 text-slate-500" />
          <p className="text-slate-300 font-bold text-base font-sans">No workout routines created matching this criteria.</p>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="text-brand-yellow font-bold text-sm hover:underline cursor-pointer"
          >
            Create one now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {plans.map((plan) => {
            const isProcessed = processingId === plan._id;
            const isExpanded = expandedPlanId === plan._id;
            
            return (
              <div 
                key={plan._id} 
                className={`bg-[#131b2c] border rounded-3xl overflow-hidden transition-all shadow-xl border-card-dark ${!plan.isActive && 'opacity-65 grayscale-30'}`}
              >
                {/* Main Card Header */}
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-white tracking-tight">{plan.title}</h3>
                      <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase rounded-md">
                        {plan.goal}
                      </span>
                      <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase rounded-md">
                        {plan.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{plan.exercises?.length || 0} Exercises included</p>
                  </div>
                  
                  {/* Actions & Status */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    
                    {/* Status Toggler */}
                    <button 
                      onClick={() => handleToggleStatus(plan._id, plan.isActive)}
                      disabled={isProcessed}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        plan.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}
                    >
                      {plan.isActive ? <ShieldCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </button>

                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleOpenEdit(plan)}
                        disabled={isProcessed}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-colors cursor-pointer"
                        title="Edit Plan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(plan._id, plan.title)}
                        disabled={isProcessed}
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-colors cursor-pointer"
                        title="Delete Plan"
                      >
                        {isProcessed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>

                      {/* Expand Details Trigger */}
                      <button 
                        onClick={() => toggleExpandCard(plan._id)}
                        className="p-2 bg-bg-dark hover:bg-card-dark text-slate-400 hover:text-white border border-card-dark rounded-xl transition-colors cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>
                </div>

                {/* Expanded Exercises Schedule Panel */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-card-dark/40 bg-bg-dark/20 animate-fadeIn font-sans">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest my-4">Workout Schedule</h4>
                    {plan.exercises?.length === 0 ? (
                      <p className="text-slate-500 text-xs py-2">No exercises configured for this routine.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-card-dark text-slate-400 font-bold uppercase tracking-wider">
                              <th className="py-2.5 px-3">Day</th>
                              <th className="py-2.5 px-3">Exercise Name</th>
                              <th className="py-2.5 px-3 text-center">Sets</th>
                              <th className="py-2.5 px-3 text-center">Reps</th>
                              <th className="py-2.5 px-3 text-center">Rest</th>
                              <th className="py-2.5 px-3">Instructions</th>
                              <th className="py-2.5 px-3 text-right">Demo</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-card-dark/30 text-slate-300">
                            {plan.exercises.map((ex, idx) => (
                              <tr key={idx} className="hover:bg-card-dark/10 transition-colors">
                                <td className="py-3 px-3 font-semibold text-brand-yellow">{ex.day}</td>
                                <td className="py-3 px-3 font-medium text-white">{ex.exerciseName}</td>
                                <td className="py-3 px-3 text-center font-bold text-slate-200">{ex.sets}</td>
                                <td className="py-3 px-3 text-center font-bold text-slate-200">{ex.reps}</td>
                                <td className="py-3 px-3 text-center text-slate-400">{ex.restTime}</td>
                                <td className="py-3 px-3 max-w-xs text-slate-400 truncate" title={ex.instructions}>
                                  {ex.instructions || '-'}
                                </td>
                                <td className="py-3 px-3 text-right">
                                  {ex.videoUrl ? (
                                    <a 
                                      href={ex.videoUrl} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="inline-flex items-center gap-1 text-[10px] text-brand-yellow border border-brand-yellow/30 bg-brand-yellow/5 hover:bg-brand-yellow/10 px-2 py-1 rounded-md transition-colors"
                                    >
                                      <Play className="w-2.5 h-2.5 fill-current" /> Watch
                                    </a>
                                  ) : (
                                    <span className="text-slate-600">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* ================= ROUTINE MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#131b2c] border border-card-dark rounded-3xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden animate-fadeInUp max-h-[90vh] flex flex-col">
            
            <div className="p-6 border-b border-card-dark flex justify-between items-center bg-linear-to-r from-brand-yellow/10 to-transparent shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Dumbbell className="w-5 h-5 text-brand-yellow" />
                {isEditing ? 'Edit Workout Routine' : 'Build New Workout Routine'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl bg-bg-dark border border-card-dark text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Core Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Routine Title</label>
                  <input 
                    type="text" required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20"
                    placeholder="e.g. Shred & Burn 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Fitness Goal Focus</label>
                  <select 
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-300 text-sm focus:outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-brand-yellow/20"
                  >
                    {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Difficulty Level</label>
                  <select 
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-300 text-sm focus:outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-brand-yellow/20"
                  >
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Dynamic Exercises List Builder */}
              <div className="border-t border-card-dark/40 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Exercises Checklist ({formData.exercises.length})
                  </h4>
                  <button 
                    type="button"
                    onClick={handleAddExerciseRow}
                    className="flex items-center gap-1 px-3 py-1.5 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 text-xs font-black rounded-lg transition-transform hover:scale-[1.02] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Exercise Row
                  </button>
                </div>

                {formData.exercises.length === 0 ? (
                  <div className="py-12 border border-dashed border-card-dark rounded-2xl flex flex-col items-center justify-center text-slate-500 text-xs bg-bg-dark/40">
                    <Info className="w-6 h-6 mb-2 text-slate-600" />
                    <span>No exercises mapped to this routine yet. Click "Add Exercise Row" above.</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.exercises.map((ex, index) => (
                      <div key={index} className="bg-bg-dark/50 border border-card-dark rounded-2xl p-4 relative group">
                        
                        {/* Remove Row Trigger */}
                        <button 
                          type="button"
                          onClick={() => handleRemoveExerciseRow(index)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove Exercise"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pr-6">
                          
                          {/* Target Day */}
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Target Day</label>
                            <input 
                              type="text" required
                              value={ex.day}
                              onChange={(e) => handleExerciseChange(index, 'day', e.target.value)}
                              className="w-full px-3 py-2 bg-bg-dark border border-card-dark rounded-lg text-slate-300 text-xs focus:outline-none"
                              placeholder="e.g. Monday or Day 1"
                            />
                          </div>

                          {/* Exercise Name */}
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Exercise Name</label>
                            <input 
                              type="text" required
                              value={ex.exerciseName}
                              onChange={(e) => handleExerciseChange(index, 'exerciseName', e.target.value)}
                              className="w-full px-3 py-2 bg-bg-dark border border-card-dark rounded-lg text-slate-300 text-xs focus:outline-none"
                              placeholder="e.g. Incline DB Bench Press"
                            />
                          </div>

                          {/* Sets Count */}
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Sets</label>
                            <input 
                              type="number" required min="1"
                              value={ex.sets}
                              onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 bg-bg-dark border border-card-dark rounded-lg text-slate-300 text-xs focus:outline-none"
                            />
                          </div>

                          {/* Reps */}
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Reps description</label>
                            <input 
                              type="text" required
                              value={ex.reps}
                              onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                              className="w-full px-3 py-2 bg-bg-dark border border-card-dark rounded-lg text-slate-300 text-xs focus:outline-none"
                              placeholder="e.g. 10-12 or AMRAP"
                            />
                          </div>

                          {/* Rest Time */}
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Rest period</label>
                            <input 
                              type="text" required
                              value={ex.restTime}
                              onChange={(e) => handleExerciseChange(index, 'restTime', e.target.value)}
                              className="w-full px-3 py-2 bg-bg-dark border border-card-dark rounded-lg text-slate-300 text-xs focus:outline-none"
                              placeholder="e.g. 60s or 2 min"
                            />
                          </div>

                          {/* Instructions */}
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Instructions (Optional)</label>
                            <input 
                              type="text"
                              value={ex.instructions}
                              onChange={(e) => handleExerciseChange(index, 'instructions', e.target.value)}
                              className="w-full px-3 py-2 bg-bg-dark border border-card-dark rounded-lg text-slate-300 text-xs focus:outline-none"
                              placeholder="e.g. Keep chest up and squeeze at the top"
                            />
                          </div>

                          {/* Video Link */}
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase">Demonstration Video Link (Optional)</label>
                            <input 
                              type="text"
                              value={ex.videoUrl}
                              onChange={(e) => handleExerciseChange(index, 'videoUrl', e.target.value)}
                              className="w-full px-3 py-2 bg-bg-dark border border-card-dark rounded-lg text-slate-300 text-xs focus:outline-none"
                              placeholder="e.g. https://youtube.com/..."
                            />
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status & Options Footer */}
              <div className="border-t border-card-dark/40 pt-4 flex flex-wrap gap-6 items-center shrink-0">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded bg-bg-dark border-card-dark text-emerald-500 focus:ring-emerald-500/30"
                  />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Routine is currently Active</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-card-dark flex items-center justify-end gap-3 shrink-0">
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
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? 'Save Changes' : 'Publish Routine'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkoutPlane;
