import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  UserPlus,
  Shield,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  required = false,
}) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border-b-2 py-2 text-sm font-bold outline-none transition-colors bg-transparent ${
        error
          ? "border-red-400 text-red-600 placeholder-red-300"
          : "border-gray-100 focus:border-[#FC2779] text-gray-800"
      }`}
    />
    {error && (
      <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight flex items-center gap-1 mt-1">
        <AlertCircle size={10} /> {error}
      </p>
    )}
  </div>
);

const AddStaff = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    gender: "MALE",
    role: "CREATOR",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!token || user?.role !== "ADMIN") {
      logout();
      navigate("/");
    }
  }, [user, token, logout, navigate]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Min 6 characters required";
    if (!form.phone) newErrors.phone = "Phone is required";
    else if (!phoneRegex.test(form.phone))
      newErrors.phone = "Must be exactly 10 digits";
    if (!form.city || form.city === "NONE")
      newErrors.city = "Please select a city";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!validate()) {
      setStatus({ type: "error", message: "Please fix the errors below." });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/admin/addStaff", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus({ type: "success", message: "Staff created successfully!" });
      setTimeout(() => navigate("/dashboard/admin"), 2000);
    } catch (error) {
      let msg = "Failed to create staff.";
      if (error.response) msg = error.response.data.message || msg;
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        {status.message && (
          <div
            className={`mb-6 p-4 rounded-sm border-l-4 shadow-sm flex items-center gap-3 text-sm font-bold ${
              status.type === "success"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-red-50 border-red-500 text-red-700"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {status.message}
          </div>
        )}

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="bg-gray-900 text-white p-10 md:w-1/3 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10">
              <div className="inline-block p-3 bg-white/5 rounded-sm mb-6 border border-white/10">
                <UserPlus size={32} className="text-[#FC2779]" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-tight">
                Create <br /> Staff
              </h1>
              <div className="h-1 w-10 bg-[#FC2779] mt-4"></div>
            </div>
          </div>

          <div className="p-10 flex-1">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="md:col-span-2">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  placeholder=""
                />
              </div>

              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="staff@nykaa.com"
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                required
                placeholder="••••••••"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                  <Shield size={12} /> Access Role{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-100 py-2 text-sm font-bold focus:border-[#FC2779] outline-none bg-transparent"
                >
                  <option value="CREATOR">CREATOR</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                  <Phone size={12} /> Contact No.{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute top-2 left-0 text-gray-400 text-xs font-bold">
                    +91
                  </span>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full border-b-2 pl-8 py-2 text-sm font-bold outline-none bg-transparent ${
                      errors.phone
                        ? "border-red-400"
                        : "border-gray-100 focus:border-[#FC2779]"
                    }`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                  <MapPin size={12} /> Assigned City{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={`w-full border-b-2 py-2 text-sm font-bold outline-none bg-transparent ${
                    errors.city
                      ? "border-red-400 text-red-500"
                      : "border-gray-100 focus:border-[#FC2779]"
                  }`}
                >
                  <option value="NONE">SELECT REGION</option>
                  {[
                    "Bangalore",
                    "Delhi",
                    "Mumbai",
                    "Hyderabad",
                    "Kolkata",
                    "Pune",
                    "Chennai",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Gender Selection <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-100 py-2 text-sm font-bold focus:border-[#FC2779] outline-none bg-transparent"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="NONE">Prefer not to say</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FC2779] text-white py-4 rounded-sm font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    "Confirm Registration"
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

export default AddStaff;
