import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  MantineProvider,
  AppShell,
  Group,
  Text,
  UnstyledButton,
  Avatar,
  Notification,
  Box,
  Container,
  Loader,
  Center,
  Menu,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { IconLayoutDashboard, IconChecklist, IconLogout, IconUser } from '@tabler/icons-react';

import '@mantine/core/styles.css';

import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Dashboard, TasksPage, TaskDetailPage } from './pages';
import LoginPage from './pages/LoginPage';

/**
 * EASTER EGG: React.lazy + Suspense
 * Code-splitting - AchievementsPage only loads when visited
 */
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});

const navLinkData = [
  { to: '/', label: 'Dashboard', icon: IconLayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: IconChecklist },
  // Secret route not shown in nav - find it if you can! 🔍
];

const NavItem = ({ to, label, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/tasks' && location.pathname.startsWith('/tasks/'));

  return (
    <NavLink to={to} style={{ textDecoration: 'none' }}>
      <UnstyledButton
        px="md"
        py="xs"
        style={{
          borderRadius: '8px',
          backgroundColor: isActive ? '#f3f0ff' : 'transparent',
          color: isActive ? '#7950f2' : '#495057',
          fontWeight: isActive ? 600 : 500,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.15s ease',
        }}
      >
        <Icon size={18} stroke={1.5} />
        {label}
      </UnstyledButton>
    </NavLink>
  );
};

const Layout = ({ children }) => {
  const { notifications } = useAppContext();
  const { user, logout } = useAuth();

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
      styles={{
        main: { backgroundColor: '#f8f9fa' },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Group gap="xl">
            <Group gap="xs">
              <Box
                style={{
                  backgroundColor: '#7950f2',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                T
              </Box>
              <Text fw={700} size="lg">TaskFlow</Text>
            </Group>

            <Group gap={4}>
              {navLinkData.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </Group>
          </Group>

          {/* User Menu with Logout */}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton>
                <Group gap="sm">
                  <Text size="sm" c="dimmed">{user?.name}</Text>
                  <Avatar color="violet" radius="xl" size="sm">
                    {user?.avatar}
                  </Avatar>
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item leftSection={<IconUser size={14} />} disabled>
                {user?.email}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconLogout size={14} />}
                color="red"
                onClick={logout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Box
          style={{
            position: 'fixed',
            top: 80,
            right: 20,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              color={notification.type === 'error' ? 'red' : 'green'}
              withCloseButton={false}
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              {notification.message}
            </Notification>
          ))}
        </Box>

        <Container size="md" py="xl">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

// Loading fallback for Suspense
const PageLoader = () => (
  <Center py="xl">
    <Loader color="violet" />
  </Center>
);

/**
 * ROUTE STRUCTURE
 *
 * Public Routes (no auth required):
 *   - /login
 *
 * Protected Routes (auth required):
 *   - / (Dashboard)
 *   - /tasks
 *   - /tasks/:id
 *   - /achievements (secret!)
 */
function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'violet',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        components: {
          Button: {
            defaultProps: {
              radius: 'md',
            },
          },
          Card: {
            defaultProps: {
              radius: 'md',
              shadow: 'sm',
            },
          },
        },
      }}
    >
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Route - Login */}
                  <Route
                    path="/login"
                    element={
                      <PublicOnlyRoute>
                        <LoginPage />
                      </PublicOnlyRoute>
                    }
                  />

                  {/* Protected Routes - Wrapped in Layout */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <ErrorBoundary>
                            <Suspense fallback={<PageLoader />}>
                              <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/tasks" element={<TasksPage />} />
                                <Route path="/tasks/:id" element={<TaskDetailPage />} />
                                {/* 🥚 Secret route */}
                                <Route path="/achievements" element={<AchievementsPage />} />
                              </Routes>
                            </Suspense>
                          </ErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </AppProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
