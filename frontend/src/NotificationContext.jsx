import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const initialNotifications = [
  {
    id: 1,
    title: "Neural Engine Online",
    message: "Core v4.2 initialized. All 3 bias models synchronized.",
    time: "2m ago",
    type: "system",
    unread: true,
  },
  {
    id: 2,
    title: "High Bias Alert Detected",
    message: "Partisan divergence of +0.65 flagged on political vector.",
    time: "15m ago",
    type: "alert",
    unread: true,
  },
  {
    id: 3,
    title: "Intelligence Package Ready",
    message: "Weekly media bias synthesis report archived in Audit Repository.",
    time: "1h ago",
    type: "success",
    unread: false,
  },
  {
    id: 4,
    title: "Node Synchronization Complete",
    message: "Regional news nodes in North America and Europe refreshed.",
    time: "3h ago",
    type: "info",
    unread: false,
  },
];

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("truthlens_notifications");
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("truthlens_notifications", JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      time: "Just now",
      unread: true,
      type: "info",
      ...notification,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
