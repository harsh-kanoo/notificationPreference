import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    city: "",
    gender: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const { token, user, logout } = useAuth();

  useEffect(() => {
    if (!token || user?.role !== "CUSTOMER") {
      navigate("/");
    }
  }, [token, user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/userAuth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Success! Data:", response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (
        !userData.name ||
        !userData.email ||
        !userData.city ||
        !userData.phone ||
        !userData.gender
      ) {
        alert("Enter all details");
        return;
      }
      await axios.put("http://localhost:8080/userAuth/profile", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>User Profile</h2>
        {message && <p style={styles.alert}>{message}</p>}

        <form onSubmit={handleUpdate} style={styles.form}>
          <label style={styles.label}>Full Name</label>
          <input
            name="name"
            value={userData.name}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>Email (Permanent)</label>
          <input
            name="email"
            value={userData.email}
            style={styles.disabledInput}
            readOnly
          />

          <label style={styles.label}>City</label>
          <select
            name="city"
            value={userData.city}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="NONE">None</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Pune">Pune</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Surat">Surat</option>
          </select>

          <label style={styles.label}>Gender</label>
          <select
            name="gender"
            value={userData.gender}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="NONE">None</option>
          </select>

          <label style={styles.label}>Phone</label>
          <input
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "50px",
    backgroundColor: "#f4f7f6",
    minHeight: "100vh",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  label: { fontWeight: "bold", fontSize: "0.9rem", color: "#555" },
  input: { padding: "10px", borderRadius: "6px", border: "1px solid #ddd" },
  disabledInput: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #eee",
    backgroundColor: "#f9f9f9",
    color: "#888",
    cursor: "not-allowed",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  alert: { color: "green", textAlign: "center", marginBottom: "10px" },
};

export default ProfilePage;
