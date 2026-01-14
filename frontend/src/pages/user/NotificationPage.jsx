import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { token, user, logout } = useAuth();

  useEffect(() => {
    if (!token || user?.role !== "CUSTOMER") {
      navigate("/");
    }
  }, [token, user]);

  useEffect(() => {
    const fetchPushNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/userAuth/notifications/push",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(user.user_id);
        console.log(res);
        setNotifications(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading notifications:", err);
        setLoading(false);
      }
    };
    fetchPushNotifications();
  }, []);

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2>🔔 Your Push Notifications</h2>

      <div style={styles.list}>
        {notifications.length === 0 ? (
          <p style={styles.empty}>
            No push notifications found for your settings.
          </p>
        ) : (
          notifications.map((notif, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.badge}>{notif.campaign.notification_type}</div>
              <h3 style={styles.title}>{notif.campaign.campaign_name}</h3>
              <p style={styles.time}>
                Sent on: {new Date(notif.sent_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "40px", maxWidth: "600px", margin: "0 auto" },
  list: { marginTop: "20px" },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderLeft: "5px solid #007bff",
  },
  badge: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: "5px",
  },
  title: { margin: "5px 0", fontSize: "18px" },
  time: { fontSize: "12px", color: "#888" },
  empty: { textAlign: "center", color: "#666", marginTop: "50px" },
};

export default NotificationPage;
