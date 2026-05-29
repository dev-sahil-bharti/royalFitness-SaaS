import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-bg-dark text-slate-200 font-sans">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <Header />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
