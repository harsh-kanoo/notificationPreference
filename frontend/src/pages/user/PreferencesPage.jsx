import React, { useState, useEffect } from "react";
import axios from "axios";

const PreferencesPage = () => {
  const [prefs, setPrefs] = useState({
    order_updates: "",
    offers: "",
    newsletter: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const channels = ["EMAIL", "SMS", "PUSH"];
  const categories = [
    { label: "Order Updates", key: "order_updates" },
    { label: "Promotional Offers", key: "offers" },
    { label: "Newsletter", key: "newsletter" },
  ];

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8080/userAuth/preferences",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPrefs({
          order_updates: res.data.order_updates || "",
          offers: res.data.offers || "",
          newsletter: res.data.newsletter || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleToggle = (categoryKey, channel) => {
    let current = prefs[categoryKey];

    // Treat OFF as empty selection
    let currentArray = !current || current === "OFF" ? [] : current.split(",");

    if (currentArray.includes(channel)) {
      currentArray = currentArray.filter((c) => c !== channel);
    } else {
      currentArray.push(channel);
    }

    const newValue = currentArray.length === 0 ? "OFF" : currentArray.join(",");

    setPrefs({
      ...prefs,
      [categoryKey]: newValue,
    });
  };

  const savePreferences = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8080/userAuth/preferences", prefs, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Preferences saved successfully!");
    } catch (err) {
      setMessage("Failed to save. Check server logs.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Notification Preferences</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Category</th>
              {channels.map((ch) => (
                <th key={ch} style={styles.th}>
                  {ch}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.key}>
                <td style={styles.td}>{cat.label}</td>
                {channels.map((ch) => (
                  <td key={ch} style={styles.td}>
                    <input
                      type="checkbox"
                      checked={
                        prefs[cat.key] !== "OFF" &&
                        prefs[cat.key].split(",").includes(ch)
                      }
                      onChange={() => handleToggle(cat.key, ch)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={savePreferences} style={styles.button}>
          Save Preferences
        </button>
        {message && <p style={styles.alert}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", padding: "50px" },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px", borderBottom: "2px solid #eee", textAlign: "center" },
  td: { padding: "15px", borderBottom: "1px solid #eee", textAlign: "center" },
  button: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  alert: {
    marginTop: "15px",
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default PreferencesPage;
