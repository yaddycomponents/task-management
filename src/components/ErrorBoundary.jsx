/**
 * EASTER EGG #3: Error Boundary
 *
 * This demonstrates:
 * - Class component (still needed for error boundaries!)
 * - componentDidCatch lifecycle
 * - Error recovery pattern
 * - getDerivedStateFromError static method
 *
 * How to trigger: Create a task with title "throw error"
 * (case insensitive)
 *
 * Key learnings:
 * - Error boundaries MUST be class components (as of React 18)
 * - They only catch errors in child components
 * - They don't catch errors in event handlers
 * - Use them to prevent full app crashes
 */

import React, { Component } from 'react';
import { Card, Title, Text, Button, Stack, Code } from '@mantine/core';
import { IconBug } from '@tabler/icons-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // Update state when an error occurs
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Log error details
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // In production, you'd send this to an error tracking service
    console.group('🐛 Error Boundary Caught an Error');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo?.componentStack);
    console.groupEnd();

    // Easter egg hint in console
    console.log(
      '%c💡 Tip: Error Boundaries are class components because hooks cannot catch errors.',
      'color: #7950f2; font-style: italic;'
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <Card withBorder padding="xl" style={{ textAlign: 'center' }}>
          <Stack align="center" gap="md">
            <IconBug size={48} color="#fa5252" />
            <Title order={3}>Oops! Something went wrong</Title>
            <Text c="dimmed" size="sm">
              Don't worry, the error has been contained. The rest of the app still works!
            </Text>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Card withBorder padding="sm" style={{ textAlign: 'left', width: '100%' }}>
                <Text size="xs" fw={500} c="red" mb="xs">Error Details (dev only):</Text>
                <Code block style={{ fontSize: '11px' }}>
                  {this.state.error.toString()}
                </Code>
              </Card>
            )}

            <Button onClick={this.handleReset} variant="light" color="violet">
              Try Again
            </Button>

            <Text size="xs" c="dimmed" mt="md">
              💡 You found the Error Boundary! Check the console for learning tips.
            </Text>
          </Stack>
        </Card>
      );
    }

    return this.props.children;
  }
}

// HOC version for easier use (demonstrates HOC pattern)
export function withErrorBoundary(WrappedComponent, fallback) {
  return function WithErrorBoundaryWrapper(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
