import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * AppShell — Top-level layout wrapper.
 * When the user is NOT authenticated, renders children bare (login page).
 * When authenticated, renders the full sidebar + header layout.
 */
export default function AppShell({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // While auth state is being resolved, show nothing (avoids flicker)
  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-spinner" />
        <p>Loading workspace...</p>
      </div>
    );
  }

  // Unauthenticated: show bare page (login page only)
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Authenticated: full app shell with sidebar + header
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
