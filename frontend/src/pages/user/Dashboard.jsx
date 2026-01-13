import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");
  const staff = localStorage.getItem("user");

  useEffect(() => {
    if (token == null || staff) navigate("/");
    setUnreadCount(5);
  }, [token, staff]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Notify Me</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      <div style={styles.grid}>
        <button style={styles.card} onClick={() => navigate("/profile")}>
          <div style={styles.icon}>👤</div>
          <h3>Profile</h3>
          <p>View and edit your personal details</p>
        </button>

        <button style={styles.card} onClick={() => navigate("/preferences")}>
          <div style={styles.icon}>⚙️</div>
          <h3>Preferences</h3>
          <p>Manage how we notify you</p>
        </button>

        <button style={styles.card} onClick={() => navigate("/notifications")}>
          <div style={styles.iconContainer}>
            <span style={styles.icon}>🔔</span>
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </div>
          <h3>Notifications</h3>
          <p>View your latest messages</p>
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "50px",
  },
  grid: {
    display: "flex",
    gap: "30px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    width: "250px",
    height: "200px",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "15px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  icon: { fontSize: "3rem", marginBottom: "10px" },
  iconContainer: { position: "relative" },
  badge: {
    position: "absolute",
    top: "0",
    right: "-10px",
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "5px 10px",
    fontSize: "0.8rem",
  },
  logoutBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Dashboard;
