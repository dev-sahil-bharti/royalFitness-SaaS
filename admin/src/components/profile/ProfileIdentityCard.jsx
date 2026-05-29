import React from 'react';
import { ShieldCheck, Camera, Globe, Edit } from 'lucide-react';

const ProfileIdentityCard = ({ adminData, onEditClick, onPasswordClick }) => {
    return (
        <div className="lg:col-span-1 space-y-6">
            {/* Visual Identity Card */}
            <div className="bg-[#131b2c] rounded-3xl border border-card-dark p-6 shadow-xl shadow-black/30 text-center relative overflow-hidden">
                {/* Design Header Glow */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-r from-brand-yellow/20 via-indigo-500/10 to-transparent"></div>

                {/* Avatar Wrapper */}
                <div className="relative inline-block mt-6 mb-4">
                    <img
                        src="https://sahilbharti.netlify.app/img/headerProfile.jpg"
                        alt={adminData?.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-[#131b2c] shadow-2xl relative z-10"
                    />
                    <button className="absolute bottom-0 right-0 bg-brand-yellow text-slate-900 p-2 rounded-full border-4 border-[#131b2c] z-20 shadow-lg hover:scale-110 transition-transform cursor-pointer">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>

                {/* Core Information */}
                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-white mb-1.5 tracking-wide">{adminData?.name}</h2>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-xs font-bold tracking-wider uppercase">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {adminData?.role || 'Super Admin'}
                    </span>

                    <div className="mt-6 pt-6 border-t border-card-dark flex items-center justify-center gap-2 text-slate-400 text-sm">
                        <Globe className="w-4 h-4" />
                        <span>Portal Level: Master Access</span>
                    </div>
                </div>
            </div>

            {/* Action Shortcuts */}
            <div className="bg-[#131b2c] rounded-3xl border border-card-dark p-6 shadow-xl shadow-black/30">
                <h3 className="text-sm font-bold text-slate-300 mb-4">Settings Shortcuts</h3>
                <div className="space-y-2">
                    <button
                        onClick={onEditClick}
                        className="w-full flex items-center justify-between px-4 py-3 bg-bg-dark hover:bg-card-dark border border-card-dark rounded-2xl text-sm text-slate-300 transition-colors group cursor-pointer"
                    >
                        <span>Edit Basic Details</span>
                        <Edit className="w-4 h-4 text-slate-500 group-hover:text-brand-yellow transition-colors" />
                    </button>
                    <button
                        onClick={onPasswordClick}
                        className="w-full flex items-center justify-between px-4 py-3 bg-bg-dark hover:bg-card-dark border border-card-dark rounded-2xl text-sm text-slate-300 transition-colors group cursor-pointer"
                    >
                        <span>Change Security Password</span>
                        <ShieldCheck className="w-4 h-4 text-slate-500 group-hover:text-brand-yellow transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileIdentityCard;
