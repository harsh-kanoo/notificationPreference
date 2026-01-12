import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Notify-Me</h1>
      <p style={styles.subtitle}>Please select your role to continue</p>

      <div style={styles.buttonGroup}>
        <button
          style={styles.customerButton}
          onClick={() => navigate("/userauth")}
        >
          I am a Customer
        </button>

        <button style={styles.staffButton} onClick={() => navigate("/login")}>
          I am Staff
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f7f6",
    fontFamily: "Arial, sans-serif",
  },
  title: { fontSize: "3rem", color: "#333", marginBottom: "10px" },
  subtitle: { fontSize: "1.2rem", color: "#666", marginBottom: "30px" },
  buttonGroup: { display: "flex", gap: "20px" },
  customerButton: {
    padding: "20px 40px",
    fontSize: "1.1rem",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  staffButton: {
    padding: "20px 40px",
    fontSize: "1.1rem",
    cursor: "pointer",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6c757d",
    color: "white",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
};

export default LandingPage;
