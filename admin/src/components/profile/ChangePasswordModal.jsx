import React from 'react';
import { ShieldCheck, X, EyeOff, Eye, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ChangePasswordModal = ({
    isOpen,
    onClose,
    pwdForm,
    setPwdForm,
    showPwd,
    setShowPwd,
    onSubmit,
    submitting,
    actionError,
    actionSuccess
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#131b2c] border border-card-dark rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeInUp">
                {/* Modal Header */}
                <div className="p-6 border-b border-card-dark flex justify-between items-center bg-linear-to-r from-indigo-500/10 to-transparent">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-400" />
                        Change Security Password
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
                        {/* Current Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Current Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showPwd ? "text" : "password"}
                                    required
                                    value={pwdForm.oldPassword}
                                    onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
                                    className="w-full pl-10 pr-10 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showPwd ? "text" : "password"}
                                    required
                                    minLength="6"
                                    value={pwdForm.newPassword}
                                    onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                                    className="w-full pl-10 pr-10 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="Minimum 6 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                                >
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showPwd ? "text" : "password"}
                                    required
                                    value={pwdForm.confirmPassword}
                                    onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                                    className="w-full pl-10 pr-10 py-2.5 bg-bg-dark border border-card-dark rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    placeholder="Retype new password"
                                />
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
                            className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Update Credentials'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
