import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, User, Mail, Lock, Phone, CalendarDays, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Singin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: parseInt(formData.age),
          gender: formData.gender,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        
        // Optional: Automatically log them in by saving token
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminData', JSON.stringify(data.data));

        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please ensure your backend is running.');
      console.error('Registration Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative glows */}
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl"></div>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-xl relative z-10 py-6">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl mb-4 shadow-lg shadow-brand-yellow/5">
            <Dumbbell className="text-brand-yellow w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Admin Account</h1>
          <p className="text-slate-400 mt-2">Join the premium Gym management portal</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-[#131b2c] border border-card-dark rounded-3xl p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
          
          {/* Success & Error States */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name & Email Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    disabled={loading}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full pl-11 pr-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow/50 transition duration-200 text-sm disabled:opacity-50"
                    placeholder="Sahil Bharti"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    disabled={loading}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-11 pr-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow/50 transition duration-200 text-sm disabled:opacity-50"
                    placeholder="name@gmail.com"
                  />
                </div>
              </div>
            </div>

            {/* Phone & Age & Gender Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Phone Input */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="phone">
                  Phone No.
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    required
                    disabled={loading}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full pl-11 pr-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow/50 transition duration-200 text-sm disabled:opacity-50"
                    placeholder="10 digits"
                  />
                </div>
              </div>

              {/* Age Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="age">
                  Age
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="age"
                    type="number"
                    min="18"
                    max="100"
                    required
                    disabled={loading}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="block w-full pl-11 pr-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow/50 transition duration-200 text-sm disabled:opacity-50"
                    placeholder="Age"
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="gender">
                  Gender
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <select
                    id="gender"
                    disabled={loading}
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="block w-full pl-11 pr-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow/50 transition duration-200 text-sm disabled:opacity-50 appearance-none accent-brand-yellow"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength="6"
                    disabled={loading}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-11 pr-12 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow/50 transition duration-200 text-sm disabled:opacity-50"
                    placeholder="Min 6 chars"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={loading}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="block w-full pl-11 pr-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow/50 transition duration-200 text-sm disabled:opacity-50"
                    placeholder="Repeat password"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start mt-2">
              <input
                id="agree"
                type="checkbox"
                required
                disabled={loading}
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="h-4 w-4 mt-0.5 rounded border-card-dark text-brand-yellow focus:ring-brand-yellow focus:ring-offset-0 bg-bg-dark accent-brand-yellow disabled:opacity-50"
              />
              <label htmlFor="agree" className="ml-2 block text-sm text-slate-400 select-none">
                I agree to the{' '}
                <a href="#" className="text-slate-200 hover:text-brand-yellow font-medium transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-slate-200 hover:text-brand-yellow font-medium transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-900 font-bold rounded-xl shadow-lg shadow-brand-yellow/20 hover:shadow-brand-yellow/30 transition-all duration-200 cursor-pointer group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-card-dark"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#131b2c] px-4 text-slate-500">Already have an account?</span>
            </div>
          </div>

          {/* Link to Login */}
          <p className="text-center text-sm text-slate-400">
            Have an account?{' '}
            <Link to="/login" className="font-bold text-brand-yellow hover:text-brand-yellow-dark transition-colors">
              Sign In instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Singin;
