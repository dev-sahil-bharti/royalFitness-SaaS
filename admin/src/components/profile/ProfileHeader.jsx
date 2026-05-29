import React from 'react';
import { Power } from 'lucide-react';

const ProfileHeader = ({ onLogout }) => {
    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Profile</h1>
                <p className="text-slate-400 text-sm">Manage and monitor your administrator details.</p>
            </div>
            <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-bold shadow-lg shadow-rose-500/5 transition-all cursor-pointer active:scale-95"
            >
                <Power className="w-4 h-4" />
                Sign Out
            </button>
        </div>
    );
};

export default ProfileHeader;
