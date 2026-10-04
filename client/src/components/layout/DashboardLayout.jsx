import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout-root">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className="layout-content-wrapper">
        <Header toggleSidebar={toggleSidebar} />
        <main className="layout-main-content">
          <div className="content-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
