import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Login successful! Redirecting...');
        // Save token and info to localStorage
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminData', JSON.stringify(data.data));
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Unable to connect to backend server. Please ensure it is running.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative glows */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl mb-4 shadow-lg shadow-brand-yellow/5">
            <Dumbbell className="text-brand-yellow w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Sign in to access your Gym dashboard</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#131b2c] border border-card-dark rounded-3xl p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
          
          {/* Notification Messages */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">
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
                  className="block w-full pl-11 pr-4 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow/50 disabled:opacity-50 transition duration-200 text-sm"
                  placeholder="admin@gym.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-brand-yellow hover:text-brand-yellow-dark transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-11 pr-12 py-3 bg-bg-dark border border-card-dark rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow/50 disabled:opacity-50 transition duration-200 text-sm"
                  placeholder="••••••••"
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

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                disabled={loading}
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="h-4 w-4 rounded border-card-dark text-brand-yellow focus:ring-brand-yellow focus:ring-offset-0 bg-bg-dark accent-brand-yellow disabled:opacity-50"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400 select-none">
                Keep me signed in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-yellow hover:bg-brand-yellow-dark text-slate-900 font-bold rounded-xl shadow-lg shadow-brand-yellow/20 hover:shadow-brand-yellow/30 transition-all duration-200 cursor-pointer group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-card-dark"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#131b2c] px-4 text-slate-500">New to the platform?</span>
            </div>
          </div>

          {/* Link to Signup */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/singin" className="font-bold text-brand-yellow hover:text-brand-yellow-dark transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
