import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle state
  const navigate = useNavigate();

  // State for all possible fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    city: "",
    gender: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/userAuth/login" : "/userAuth/signup";

    try {
      const response = await axios.post(
        `http://localhost:8080${endpoint}`,
        formData
      );

      // Save the token if successful
      localStorage.setItem("token", response.data.token);
      alert(isLogin ? "Login Successful!" : "Registration Successful!");

      navigate("/userDashboard"); // Move to the 3-button page
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.toggleGroup}>
          <button
            style={isLogin ? styles.activeToggle : styles.inactiveToggle}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            style={!isLogin ? styles.activeToggle : styles.inactiveToggle}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                name="city"
                placeholder="City"
                onChange={handleChange}
                style={styles.input}
              />
              <select
                name="gender"
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="NONE">Prefer not to say</option>
              </select>
              <input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                style={styles.input}
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.submitBtn}>
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple styles to make it look decent
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#e9ecef",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "400px",
    textAlign: "center",
  },
  toggleGroup: {
    display: "flex",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
  },
  activeToggle: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  inactiveToggle: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#f8f9fa",
    color: "#333",
    border: "none",
    cursor: "pointer",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  submitBtn: {
    padding: "12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "1.1rem",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default AuthPage;
