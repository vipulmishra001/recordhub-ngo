import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </AuthProvider>
  );
}
