/**
 * PROTECTED ROUTE COMPONENT
 *
 * Demonstrates:
 * - Route protection pattern
 * - Redirecting unauthenticated users
 * - Preserving intended destination (redirect after login)
 * - Loading states during auth check
 *
 * Usage:
 *   <Route path="/dashboard" element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   } />
 *
 * Key Concepts:
 * - Public routes: Anyone can access (login, landing page)
 * - Private/Protected routes: Only authenticated users
 * - The `location.state.from` pattern preserves where user wanted to go
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader color="violet" size="lg" />
      </Center>
    );
  }

  // If not authenticated, redirect to login
  // Save the current location so we can redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

/**
 * PUBLIC ONLY ROUTE
 *
 * Opposite of ProtectedRoute - redirects TO app if already logged in
 * Use for login/register pages
 */
export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader color="violet" size="lg" />
      </Center>
    );
  }

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
