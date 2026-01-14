import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";

const UploadUsers = () => {
  const [file, setFile] = useState(null);
  const { user, logout, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (user?.role !== "CREATOR" && user?.role !== "ADMIN")) {
      logout();
      navigate("/");
    }
  }, [user, token, logout, navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a valid CSV file first.");
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

      setMessage("Success: Users database synchronized.");
      setFile(null);
      setTimeout(() => {
        navigate(
          user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/creator"
        );
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Internal Upload Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="bg-gray-900 text-white p-10 md:w-1/3 flex flex-col justify-between">
            <div>
              <div className="inline-block p-3 bg-white/5 rounded-sm mb-6">
                <FileText size={32} className="text-[#FC2779]" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-tight">
                Bulk <br /> Import
              </h1>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-4">
                Data Requirements:
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "name",
                  "email",
                  "city",
                  "gender",
                  "phone",
                  "password",
                  "preferences",
                ].map((field) => (
                  <li
                    key={field}
                    className="flex items-center gap-2 text-[11px] font-bold text-gray-300 tracking-wide uppercase"
                  >
                    <CheckCircle2 size={12} className="text-[#FC2779]" />{" "}
                    {field}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-10">
              <p className="text-gray-500 text-[10px] leading-relaxed italic border-t border-gray-800 pt-4">
                System only accepts .csv files. Ensure no duplicate emails exist
                in the source file.
              </p>
            </div>
          </div>

          <div className="p-10 flex-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
              Database Sync Tool
            </h2>

            <form onSubmit={handleUpload} className="space-y-8">
              <div className="relative group">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`border-2 border-dashed rounded-sm p-12 flex flex-col items-center justify-center transition-all ${
                    file
                      ? "border-[#FC2779] bg-pink-50/30"
                      : "border-gray-200 group-hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <Upload
                    size={40}
                    className={file ? "text-[#FC2779]" : "text-gray-300"}
                  />
                  <p className="mt-4 text-xs font-black uppercase tracking-widest text-gray-600">
                    {file ? file.name : "Select or Drop CSV"}
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase">
                    Max file size: 10MB
                  </p>
                </div>
              </div>

              {message && (
                <div
                  className={`flex items-center gap-2 p-4 text-[11px] font-black uppercase tracking-widest rounded-sm ${
                    message.includes("Success")
                      ? "bg-green-50 text-green-600"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <Info size={14} /> {message}
                </div>
              )}

              <button
                disabled={loading || !file}
                className={`w-full py-4 rounded-sm font-black uppercase tracking-widest text-[11px] transition-all shadow-md active:scale-[0.98] ${
                  loading || !file
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#FC2779] text-white hover:bg-black"
                }`}
              >
                {loading ? "Processing Database..." : "Authorize Upload"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadUsers;
