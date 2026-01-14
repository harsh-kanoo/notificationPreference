import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/Navbar";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Save,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    gender: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!token || user?.role !== "CUSTOMER") {
      logout();
      navigate("/");
    }
  }, [token, user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/userAuth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;
        setFormData({
          name: data.name || "",
          email: data.email || "",
          city: data.city || "",
          gender: data.gender || "",
          phone: data.phone || "",
        });
      } catch (err) {
        console.error("Error fetching profile", err);
        setStatus({
          type: "error",
          message: "Failed to load profile data. Please try refreshing.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.city || formData.city === "NONE")
      newErrors.city = "Please select a city";
    if (!formData.gender || formData.gender === "NONE")
      newErrors.gender = "Please select a gender";

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!validate()) {
      setStatus({
        type: "error",
        message: "Please fix the errors below before saving.",
      });
      return;
    }

    setSaving(true);
    try {
      await axios.put("http://localhost:8080/userAuth/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus({
        type: "success",
        message: "Profile updated successfully!",
      });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to update profile. Server may be down.";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <Loader2 className="animate-spin text-[#FC2779]" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate("/userDashboard")}
          className="flex items-center gap-1 text-gray-500 hover:text-[#FC2779] text-[10px] font-black uppercase tracking-[0.2em] mb-6 transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </button>

        <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-linear-to-r from-pink-50 to-white p-8 border-b border-pink-100 flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#FC2779] font-bold text-3xl border-4 border-pink-100 shadow-sm">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Edit Profile
              </h1>
              <p className="text-gray-500 text-xs mt-1">
                Manage your personal details and account settings.
              </p>
            </div>
          </div>

          <div className="p-8">
            {status.message && (
              <div
                className={`mb-6 p-4 rounded-md flex items-center gap-3 text-sm font-medium ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                {status.message}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <User size={14} /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-50 border rounded-md text-sm outline-none transition-all focus:bg-white focus:ring-2 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#FC2779] focus:ring-pink-100"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Mail size={14} /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-gray-400">
                    Email cannot be changed for security reasons.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={14} /> Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 text-sm">
                      +91
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`w-full p-3 pl-10 bg-gray-50 border rounded-md text-sm outline-none transition-all focus:bg-white focus:ring-2 ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-[#FC2779] focus:ring-pink-100"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={14} /> City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-50 border rounded-md text-sm outline-none transition-all focus:bg-white focus:ring-2 ${
                      errors.city
                        ? "border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#FC2779] focus:ring-pink-100"
                    }`}
                  >
                    <option value="NONE">Select City</option>
                    {[
                      "Bangalore",
                      "Delhi",
                      "Mumbai",
                      "Hyderabad",
                      "Ahmedabad",
                      "Chennai",
                      "Kolkata",
                      "Pune",
                      "Jaipur",
                      "Surat",
                    ].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                    User Type / Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full p-3 bg-gray-50 border rounded-md text-sm outline-none transition-all focus:bg-white focus:ring-2 ${
                      errors.gender
                        ? "border-red-500 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#FC2779] focus:ring-pink-100"
                    }`}
                  >
                    <option value="NONE">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs font-semibold mt-1">
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-50 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#FC2779] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-[#e01965] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
