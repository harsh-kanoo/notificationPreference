import { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";

// --- FIX: Components moved OUTSIDE the main Login component ---

const Label = ({ text, required }) => (
  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">
    {text}{" "}
    {required && <span className="text-red-500 text-lg leading-none">*</span>}
  </label>
);

const StyledInput = ({
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  name,
}) => (
  <div className="w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full py-3 border-b-2 bg-transparent text-sm font-bold text-gray-800 outline-none transition-colors placeholder:text-gray-300 ${
        error ? "border-red-400" : "border-gray-100 focus:border-[#FC2779]"
      }`}
    />
    {error && (
      <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight mt-1 flex items-center gap-1">
        <AlertCircle size={10} /> {error}
      </p>
    )}
  </div>
);

// --- Main Component ---

const Login = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState("login");
  const [apiError, setApiError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    gender: "MALE",
  });

  const handleApiError = (err) => {
    if (err.response) {
      setApiError(err.response.data.message || "Something went wrong.");
    } else if (err.request) {
      setApiError("Network Error. Please check your connection.");
    } else {
      setApiError("An unexpected error occurred.");
    }
  };

  const validate = (type) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (type === "login") {
      if (!loginForm.email) errors.email = "Email is required";
      else if (!emailRegex.test(loginForm.email))
        errors.email = "Invalid email format";

      if (!loginForm.password) errors.password = "Password is required";
    } else {
      if (!signupForm.name.trim()) errors.name = "Full Name is required";

      if (!signupForm.email) errors.email = "Email is required";
      else if (!emailRegex.test(signupForm.email))
        errors.email = "Invalid email format";

      if (!signupForm.password) errors.password = "Password is required";
      else if (signupForm.password.length < 6)
        errors.password = "Min 6 characters required";

      if (!signupForm.phone) errors.phone = "Phone number is required";
      else if (!phoneRegex.test(signupForm.phone))
        errors.phone = "Must be exactly 10 digits";

      if (!signupForm.city || signupForm.city === "NONE")
        errors.city = "Please select a city";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate("login")) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/auth/login",
        loginForm
      );
      login(data);

      const role = data.user?.role;
      if (role === "ADMIN") navigate("/dashboard/admin");
      else if (role === "CREATOR") navigate("/dashboard/creator");
      else if (role === "VIEWER") navigate("/dashboard/viewer");
      else navigate("/userDashboard");
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate("signup")) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8080/auth/signup",
        signupForm
      );
      login(data);
      navigate("/userDashboard");
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-gray-900 flex flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-[#FC2779] text-7xl font-black tracking-tighter uppercase mb-2 drop-shadow-lg">
            Nykaa
          </h1>
          <div className="h-px w-24 bg-white/20 mx-auto mb-4" />
          <p className="text-white font-bold uppercase tracking-[0.4em] text-xs">
            Notification Portal
          </p>
        </div>
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-8 bg-[#f3f3f3]">
        <div className="w-full max-w-md bg-white p-10 rounded-sm shadow-2xl border border-gray-100">
          <div className="flex mb-8 border-b border-gray-100">
            {["login", "signup"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setApiError("");
                  setValidationErrors({});
                }}
                className={`flex-1 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                  tab === t
                    ? "border-b-2 border-[#FC2779] text-[#FC2779]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded-r-sm shadow-sm flex items-center gap-3 animate-pulse">
              <AlertCircle size={16} />
              {apiError}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label text="Email" required />
                <StyledInput
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  error={validationErrors.email}
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <Label text="Password" required />
                <StyledInput
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  error={validationErrors.password}
                  placeholder="••••••••"
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 mt-4 rounded-sm font-black uppercase tracking-widest text-[11px] hover:bg-[#FC2779] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSignup}
              className="space-y-5 max-h-125 overflow-y-auto pr-2 custom-scrollbar"
            >
              <div>
                <Label text="Full Name" required />
                <StyledInput
                  value={signupForm.name}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, name: e.target.value })
                  }
                  error={validationErrors.name}
                  placeholder=""
                />
              </div>

              <div>
                <Label text="Email" required />
                <StyledInput
                  type="email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                  error={validationErrors.email}
                  placeholder="abc@email.com"
                />
              </div>

              <div>
                <Label text="Password" required />
                <StyledInput
                  type="password"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                  error={validationErrors.password}
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <Label text="Phone Number" required />
                <div className="relative">
                  <span className="absolute top-2 left-0 text-gray-400 text-xs font-bold">
                    +91
                  </span>
                  <input
                    className={`w-full py-2 pl-8 border-b-2 bg-transparent text-sm font-bold text-gray-800 outline-none transition-colors ${
                      validationErrors.phone
                        ? "border-red-400"
                        : "border-gray-100 focus:border-[#FC2779]"
                    }`}
                    value={signupForm.phone}
                    onChange={(e) => {
                      if (
                        /^\d*$/.test(e.target.value) &&
                        e.target.value.length <= 10
                      ) {
                        setSignupForm({ ...signupForm, phone: e.target.value });
                      }
                    }}
                    placeholder="9876543210"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight mt-1">
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label text="City" required />
                  <select
                    className={`w-full border-b-2 py-2 text-xs font-bold outline-none bg-transparent ${
                      validationErrors.city
                        ? "border-red-400 text-red-500"
                        : "border-gray-100 focus:border-[#FC2779]"
                    }`}
                    value={signupForm.city}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, city: e.target.value })
                    }
                  >
                    <option value="NONE">Select City</option>
                    {[
                      "Bangalore",
                      "Delhi",
                      "Mumbai",
                      "Hyderabad",
                      "Pune",
                      "Chennai",
                      "Kolkata",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label text="Gender" required />
                  <select
                    className="w-full border-b-2 border-gray-100 py-2 text-xs font-bold focus:border-[#FC2779] outline-none bg-transparent"
                    value={signupForm.gender}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, gender: e.target.value })
                    }
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NONE">Other</option>
                  </select>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-[#FC2779] text-white py-4 mt-6 rounded-sm font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
