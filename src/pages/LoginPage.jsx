/**
 * LOGIN PAGE
 *
 * Demonstrates:
 * - Form handling in React
 * - Controlled inputs
 * - Error handling & display
 * - Navigation after auth
 * - useNavigate hook
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Alert,
  Box,
  Group,
  Divider,
} from '@mantine/core';
import { IconAlertCircle, IconLogin } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get the page user was trying to access (for redirect after login)
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect to the page they were trying to access
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login for demo
  const handleDemoLogin = () => {
    setEmail('demo');
    setPassword('demo');
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        padding: '20px',
      }}
    >
      <Card shadow="md" padding="xl" radius="md" style={{ width: '100%', maxWidth: 400 }}>
        <Stack gap="lg">
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Group justify="center" gap="xs" mb="xs">
              <Box
                style={{
                  backgroundColor: '#7950f2',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                T
              </Box>
              <Title order={2}>TaskFlow</Title>
            </Group>
            <Text c="dimmed" size="sm">
              Sign in to manage your tasks
            </Text>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                leftSection={<IconLogin size={18} />}
              >
                Sign In
              </Button>
            </Stack>
          </form>

          <Divider label="or" labelPosition="center" />

          {/* Demo Login */}
          <Button
            variant="light"
            fullWidth
            onClick={handleDemoLogin}
          >
            Fill Demo Credentials
          </Button>

          {/* Credentials Hint */}
          <Card withBorder padding="sm" radius="md" bg="gray.0">
            <Text size="xs" c="dimmed" fw={500} mb={4}>
              Demo Credentials:
            </Text>
            <Text size="xs" c="dimmed">
              Email: <Text span fw={500} c="dark">demo</Text>
            </Text>
            <Text size="xs" c="dimmed">
              Password: <Text span fw={500} c="dark">demo</Text>
            </Text>
          </Card>
        </Stack>
      </Card>
    </Box>
  );
};

export default LoginPage;
