import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import Login from './pages/Login';
import Singin from './pages/Singin';
import Profile from './pages/Profile';
import AllUsers from './components/dashboard/AllUsers';
import AllBookings from './components/dashboard/AllBookings';
import MebershipPlane from './components/dashboard/MebershipPlane';
import AllTrainers from './components/dashboard/AllTrainers';
import Gallery from './components/dashboard/Gallery';
import WorkoutPlane from './components/dashboard/WorkoutPlane';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/singin" element={<Singin />} />

        {/* Protected Admin Portal Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<AllUsers />} />
            <Route path="/bookings" element={<AllBookings />} />
            <Route path="/plans" element={<MebershipPlane />} />
            <Route path="/trainers" element={<AllTrainers />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/workout-plans" element={<WorkoutPlane />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        {/* Default 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;