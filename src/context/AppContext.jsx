import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    avatar: 'AJ',
  });

  // Theme state
  const [theme, setTheme] = useState('light');

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Notification state
  const [notifications, setNotifications] = useState([]);

  // Actions
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  const value = {
    // State
    user,
    theme,
    sidebarOpen,
    notifications,

    // Actions
    setUser,
    toggleTheme,
    toggleSidebar,
    addNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
