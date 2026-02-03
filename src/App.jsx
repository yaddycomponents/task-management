import React from 'react';
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
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { IconLayoutDashboard, IconChecklist } from '@tabler/icons-react';

import '@mantine/core/styles.css';

import { AppProvider, useAppContext } from './context/AppContext';
import { Dashboard, TasksPage, TaskDetailPage } from './pages';

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
  const { user, notifications } = useAppContext();

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

          <Group gap="sm">
            <Text size="sm" c="dimmed">{user.name}</Text>
            <Avatar color="violet" radius="xl" size="sm">
              {user.avatar}
            </Avatar>
          </Group>
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
          <AppProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/tasks/:id" element={<TaskDetailPage />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </AppProvider>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
