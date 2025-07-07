import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    };
    fetchNotifications();
    // Optionally, poll every 30 seconds:
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}>
      {notifications.filter(n => !n.read).length > 0 && (
        <div style={{
          background: "#4a90e2",
          color: "#fff",
          borderRadius: 8,
          padding: "12px 20px",
          boxShadow: "0 2px 8px rgba(74,144,226,0.15)"
        }}>
          <strong>Notifications:</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {notifications.filter(n => !n.read).map(n => (
              <li key={n._id}>{n.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
