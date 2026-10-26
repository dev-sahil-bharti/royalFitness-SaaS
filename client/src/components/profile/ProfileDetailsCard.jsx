import React from 'react';
import { User, Mail, Phone, Calendar, Edit } from 'lucide-react';

const ProfileDetailsCard = ({ adminData, onEditClick }) => {
    const MAX_AGE = 100;

    const displayAge =
        typeof adminData?.age === "number"
            ? Math.min(adminData.age, MAX_AGE)
            : null;
    return (
        <div className="lg:col-span-2 space-y-6">
            {/* Personal Details Section */}
            <div className="bg-[#131b2c] rounded-3xl border border-card-dark p-8 shadow-xl shadow-black/30">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-card-dark">
                    <h3 className="text-lg font-bold text-white tracking-wide">Administrative Metadata</h3>
                    <button
                        onClick={onEditClick}
                        className="flex items-center gap-1.5 text-xs font-bold text-brand-yellow hover:text-brand-yellow-dark transition-colors uppercase cursor-pointer"
                    >
                        <Edit className="w-3.5 h-3.5" />
                        Modify Details
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-400">
                            <User className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Full Legal Name</span>
                        </div>
                        <p className="text-slate-200 font-semibold tracking-wide pl-6 text-[15px]">{adminData?.name}</p>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Mail className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Authorized Email</span>
                        </div>
                        <p className="text-slate-200 font-semibold tracking-wide pl-6 text-[15px]">{adminData?.email}</p>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Contact Phone</span>
                        </div>
                        <p className="text-slate-200 font-semibold tracking-wide pl-6 text-[15px]">{adminData?.phone || 'N/A'}</p>
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-400">
                            <User className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Biological Gender</span>
                        </div>
                        <p className="text-slate-200 font-semibold tracking-wide pl-6 text-[15px]">{adminData?.gender || 'N/A'}</p>
                    </div>

                    {/* Age */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                Account Holder Age
                            </span>
                        </div>

                        <p className="text-slate-200 font-semibold tracking-wide pl-6 text-[15px]">
                            {displayAge !== null ? `${displayAge} Years` : "N/A"}
                        </p>
                    </div>

                    {/* Joined */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Member Since</span>
                        </div>
                        <p className="text-slate-200 font-semibold tracking-wide pl-6 text-[15px]">
                            {adminData?.createdAt ? new Date(adminData.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            }) : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {/* System Session Logs */}
            <div className="bg-[#131b2c] rounded-3xl border border-card-dark p-8 shadow-xl shadow-black/30">
                <h3 className="text-lg font-bold text-white tracking-wide mb-6 pb-4 border-b border-card-dark">Security Activity</h3>
                <div className="flex items-center justify-between p-4 bg-bg-dark border border-card-dark rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-200">Active Browser Session</p>
                            <p className="text-xs text-slate-500">Port 5173 • Authenticated Node</p>
                        </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Active</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetailsCard;
