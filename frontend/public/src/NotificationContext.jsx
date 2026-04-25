import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      time: "Just now",
      unread: true,
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
