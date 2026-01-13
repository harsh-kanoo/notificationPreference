import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../../auth/AuthContext";

const UploadUsers = () => {
  const [file, setFile] = useState(null);
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token == null || !user || user.role !== "CREATOR") {
      logout();
      navigate("/login");
    }
  }, [user, token]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/creator/users/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Users uploaded successfully");
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex justify-center pt-10">
        <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Bulk Upload Users
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="border w-full p-2 rounded"
            />

            {message && (
              <p className="text-sm text-center text-gray-600">{message}</p>
            )}

            <button
              disabled={loading}
              className="w-full bg-[#FC2779] text-white py-2 rounded font-semibold"
            >
              {loading ? "Uploading..." : "Upload CSV"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadUsers;
