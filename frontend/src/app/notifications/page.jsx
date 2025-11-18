"use client";

import { useEffect, useState, useRef } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [pulling, setPulling] = useState(false);

  const ws = useRef(null);

  // Load user
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  // Fetch notifications
  const load = async () => {
    if (!user?.id) return;

    const res = await fetch(`http://192.168.1.87:5000/notifications/${user.id}`);
    const data = await res.json();
    setNotifications(Array.isArray(data) ? data : []);
  };

  // Auto refresh every 5 seconds
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(() => load(), 5000);
    return () => clearInterval(interval);
  }, [user]);

  // WebSocket live updates
  useEffect(() => {
    if (!user?.id) return;

    ws.current = new WebSocket("ws://localhost:5000");

    ws.current.onmessage = (event) => {
      const incoming = JSON.parse(event.data);

      if (incoming.userId === user.id) {
        setNotifications((prev) => [incoming, ...prev]);
      }
    };

    return () => ws.current?.close();
  }, [user]);

  // Mark as read
  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/notifications/mark-read/${id}`, {
      method: "PATCH",
    });

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );

    // Notify dashboard
    window.dispatchEvent(new CustomEvent("notif-read"));
  };

  // Pull to refresh
  const handlePull = () => {
    setPulling(true);
    setTimeout(() => {
      load();
      setPulling(false);
    }, 1000);
  };

  // Count unread
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (user?.id) load();
  }, [user]);

  return (
    <div
      className="min-h-screen bg-[#0d243a] text-white p-5"
      onTouchStart={handlePull}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      {/* Pull to refresh indicator */}
      {pulling && (
        <div className="text-center text-gray-400 pb-3">Refreshing...</div>
      )}

      {/* No notifications */}
      {notifications.length === 0 ? (
        <div className="mt-20 text-center text-gray-400">
          <div className="text-6xl mb-4">📭</div>
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border ${
                n.read
                  ? "bg-[#0f304f] border-[#143e61]"
                  : "bg-[#1c3b5a] border-[#2a5e8a]"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-lg">{n.title}</div>
                  <p className="text-gray-300">{n.message}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>

                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-sm bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
