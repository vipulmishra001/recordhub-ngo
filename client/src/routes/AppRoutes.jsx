import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Overview from '../features/dashboard/Overview';
import Login from '../features/auth/Login';
import AdminDashboard from '../features/dashboard/AdminDashboard';
import StaffDashboard from '../features/dashboard/StaffDashboard';
import VolunteerDashboard from '../features/dashboard/VolunteerDashboard';
import StudentDashboard from '../features/dashboard/StudentDashboard';
import UserManagement from '../features/users/UserManagement';
import StudentManagement from '../features/students/StudentManagement';
import ProgramManagement from '../features/programs/ProgramManagement';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';
import AccessDenied from '../components/common/AccessDenied';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public — Login */}
      <Route path="/login" element={<Login />} />

      {/* Root — redirects based on auth state */}
      <Route path="/" element={<Overview />} />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin']}>
              <UserManagement />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Staff routes */}
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['staff']}>
              <StaffDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['staff']}>
              <StaffDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Volunteer routes */}
      <Route
        path="/volunteer/dashboard"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['volunteer']}>
              <VolunteerDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['volunteer']}>
              <VolunteerDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Student routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['student']}>
              <StudentDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/*"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['student']}>
              <StudentDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Shared module routes (RBAC enforced at API + component level) */}
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/programs"
        element={
          <ProtectedRoute>
            <ProgramManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleGuard allowedRoles={['admin']}>
              <UserManagement />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      {/* Access Denied */}
      <Route path="/unauthorized" element={<AccessDenied />} />

      {/* 404 — redirect to root (which redirects appropriately) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
