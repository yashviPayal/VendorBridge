import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { X } from 'lucide-react';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans relative">
      {/* Sidebar Navigation - Desktop */}
      <Sidebar className="hidden lg:flex" />

      {/* Sidebar Navigation - Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Blur Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer card content */}
          <div className="relative flex flex-col w-64 bg-white h-full shadow-2xl animate-fade-in border-r border-slate-100">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg cursor-pointer z-50"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar className="w-full h-full border-r-0" />
          </div>
        </div>
      )}

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Topbar Header */}
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Page Body Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50 print:p-0 print:bg-white">
          <div className="max-w-7xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default Layout;
