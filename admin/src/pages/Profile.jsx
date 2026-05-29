import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

// Component Imports
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileIdentityCard from '../components/profile/ProfileIdentityCard';
import ProfileDetailsCard from '../components/profile/ProfileDetailsCard';
import EditProfileModal from '../components/profile/EditProfileModal';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';

const Profile = () => {
    const navigate = useNavigate();
    
    // Base & API State
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');
    const [actionError, setActionError] = useState('');

    // UI Visibility States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        gender: 'Male',
        age: ''
    });

    const [pwdForm, setPwdForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPwd, setShowPwd] = useState(false);

    // Load Profile Data Hook
    const fetchProfile = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/admin/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setAdminData(result.data);
                setEditForm({
                    name: result.data.name || '',
                    phone: result.data.phone || '',
                    gender: result.data.gender || 'Male',
                    age: result.data.age || ''
                });
            } else {
                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminData');
                    navigate('/login');
                    return;
                }
                setError(result.message || 'Failed to load admin details.');
            }
        } catch (err) {
            setError('Unable to connect to the server. Please check if your backend is running.');
            console.error('Fetch Profile Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/login');
    };

    const resetLocalActionState = () => {
        setActionError('');
        setActionSuccess('');
    };

    // --- Handlers ---
    
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        resetLocalActionState();

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch('http://localhost:5000/api/admin/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editForm.name,
                    phone: editForm.phone,
                    age: parseInt(editForm.age),
                    gender: editForm.gender
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setActionSuccess('Profile details updated successfully!');
                setAdminData(result.data);
                setTimeout(() => {
                    setShowEditModal(false);
                    resetLocalActionState();
                }, 1500);
            } else {
                setActionError(result.message || 'Failed to update profile.');
            }
        } catch (err) {
            setActionError('Network error. Check backend connection.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (pwdForm.newPassword !== pwdForm.confirmPassword) {
            setActionError('New passwords do not match!');
            return;
        }

        setSubmitting(true);
        resetLocalActionState();

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch('http://localhost:5000/api/auth/admin/changePassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: adminData?.email,
                    oldPassword: pwdForm.oldPassword,
                    newPassword: pwdForm.newPassword,
                    confirmPassword: pwdForm.confirmPassword
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setActionSuccess('Password updated! Signing you out to re-authenticate.');
                setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => {
                    handleLogout();
                }, 2000);
            } else {
                setActionError(result.message || 'Failed to change password. Please verify credentials.');
            }
        } catch (err) {
            setActionError('Network error. Check backend connection.');
        } finally {
            setSubmitting(false);
        }
    };

    // Rendering Logic states
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-slate-200">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
                    <p className="text-sm text-slate-400 font-medium tracking-wide">Loading Admin Profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm shadow-lg shadow-rose-500/5">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fadeIn pb-12 relative">
            
            {/* Refactored Layout Grid & Composed Children Components */}
            
            <ProfileHeader onLogout={handleLogout} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ProfileIdentityCard 
                    adminData={adminData} 
                    onEditClick={() => { resetLocalActionState(); setShowEditModal(true); }}
                    onPasswordClick={() => { resetLocalActionState(); setShowPasswordModal(true); }}
                />

                <ProfileDetailsCard 
                    adminData={adminData} 
                    onEditClick={() => { resetLocalActionState(); setShowEditModal(true); }}
                />
            </div>

            {/* Extracted Modal Overlays */}

            <EditProfileModal 
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                editForm={editForm}
                setEditForm={setEditForm}
                onSubmit={handleEditSubmit}
                submitting={submitting}
                actionError={actionError}
                actionSuccess={actionSuccess}
            />

            <ChangePasswordModal 
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                pwdForm={pwdForm}
                setPwdForm={setPwdForm}
                showPwd={showPwd}
                setShowPwd={setShowPwd}
                onSubmit={handlePasswordSubmit}
                submitting={submitting}
                actionError={actionError}
                actionSuccess={actionSuccess}
            />

        </div>
    );
};

export default Profile;
