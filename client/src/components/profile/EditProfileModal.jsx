import React from 'react';
import { Edit, X, User, Phone, Calendar, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const EditProfileModal = ({
    isOpen,
    onClose,
    editForm,
    setEditForm,
    onSubmit,
    submitting,
    actionError,
    actionSuccess
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#131b2c] border border-card-dark rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInUp">
                {/* Modal Header */}
                <div className="p-6 border-b border-card-dark flex justify-between items-center bg-linear-to-r from-brand-yellow/10 to-transparent">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Edit className="w-5 h-5 text-brand-yellow" />
                        Edit Basic Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg bg-bg-dark border border-card-dark text-slate-400 hover:text-white cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Form Body */}
                <form onSubmit={onSubmit} className="p-6 space-y-5">
                    {/* Local Status Banners */}
                    {actionError && (
                        <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{actionError}</span>
                        </div>
                    )}
                    {actionSuccess && (
                        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{actionSuccess}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Legal Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    required
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    required
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Age Input */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Age</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="number"
                                        required
                                        min="18"
                                        max="100"
                                        value={editForm.age}
                                        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Gender Select */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Gender</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <select
                                        value={editForm.gender}
                                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-300 text-sm focus:outline-none appearance-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-card-dark flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-bg-dark border border-card-dark text-slate-300 text-xs font-bold rounded-lg hover:bg-card-dark transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-1.5 px-5 py-2 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-950 text-xs font-bold rounded-lg shadow-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Modifications'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
