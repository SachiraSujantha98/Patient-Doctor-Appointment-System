import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PageLoader } from './components/PageLoader';
import { PrivateRoute } from './components/PrivateRoute';
import { MainLayout } from './layouts/MainLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';

// Lazy load page components
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(module => ({
  default: module.LoginPage
})));

const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(module => ({
  default: module.RegisterPage
})));

const UnauthorizedPage = lazy(() => import('./pages/auth/UnauthorizedPage').then(module => ({
  default: module.UnauthorizedPage
})));

const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then(module => ({
  default: module.DashboardPage
})));

const CreateAppointmentPage = lazy(() => import('./pages/appointments/CreateAppointmentPage').then(module => ({
  default: module.CreateAppointmentPage
})));

const AppointmentDetailsPage = lazy(() => import('./pages/appointments/AppointmentDetailsPage').then(module => ({
  default: module.AppointmentDetailsPage
})));

const ProfilePage = lazy(() => import('./pages/profile/ProfilePage').then(module => ({
  default: module.ProfilePage
})));

const LazyComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
);

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LazyComponent>
                <LoginPage />
              </LazyComponent>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <LazyComponent>
                <RegisterPage />
              </LazyComponent>
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/unauthorized"
          element={
            <LazyComponent>
              <UnauthorizedPage />
            </LazyComponent>
          }
        />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={
                <LazyComponent>
                  <DashboardPage />
                </LazyComponent>
              }
            />
            <Route
              path="/appointments/create"
              element={
                <LazyComponent>
                  <CreateAppointmentPage />
                </LazyComponent>
              }
            />
            <Route
              path="/appointments/:id"
              element={
                <LazyComponent>
                  <AppointmentDetailsPage />
                </LazyComponent>
              }
            />
            <Route
              path="/profile"
              element={
                <LazyComponent>
                  <ProfilePage />
                </LazyComponent>
              }
            />
          </Route>
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Suspense>
  );
}; 