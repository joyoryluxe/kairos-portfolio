'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Toast from '@/components/Toast';

export default function SectionsLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-logo">⚡ Kairos Admin</div>
        <button className="menu-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>

      <Toast />
    </div>
  );
}
