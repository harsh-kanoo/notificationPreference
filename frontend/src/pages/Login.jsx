import { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    gender: "MALE",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/auth/login",
        loginForm
      );
      login(data);

      const role = data.user.role;
      if (role === "ADMIN") navigate("/dashboard/admin");
      else if (role === "CREATOR") navigate("/dashboard/creator");
      else if (role === "VIEWER") navigate("/dashboard/viewer");
      else if (role == "CUSTOMER") navigate("/userDashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      console.log(signupForm);
      const { data } = await axios.post(
        "http://localhost:8080/auth/signup",
        signupForm
      );
      login(data);

      console.log(data);
      const role = data.user.role;
      if (role === "ADMIN") navigate("/dashboard/admin");
      else if (role === "CREATOR") navigate("/dashboard/creator");
      else if (role === "VIEWER") navigate("/dashboard/viewer");
      else if (role == "CUSTOMER") navigate("/userDashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-[#FC2779] mb-4">
          Nykaa Campaign Portal
        </h1>

        <div className="flex mb-6 border-b">
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 font-semibold ${
                tab === t
                  ? "border-b-2 border-[#FC2779] text-[#FC2779]"
                  : "text-gray-500"
              }`}
            >
              {t === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              required
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
            <Input
              label="Password"
              type="password"
              required
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            <button className="w-full bg-[#FC2779] text-white py-2 rounded-md font-semibold">
              Login
            </button>
          </form>
        )}

        {tab === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Name"
              required
              value={signupForm.name}
              onChange={(e) =>
                setSignupForm({ ...signupForm, name: e.target.value })
              }
            />
            <Input
              label="Email"
              type="email"
              required
              value={signupForm.email}
              onChange={(e) =>
                setSignupForm({ ...signupForm, email: e.target.value })
              }
            />
            <Input
              label="Password"
              type="password"
              required
              value={signupForm.password}
              onChange={(e) =>
                setSignupForm({ ...signupForm, password: e.target.value })
              }
            />
            <Input
              label="Phone"
              required
              value={signupForm.phone}
              onChange={(e) =>
                setSignupForm({ ...signupForm, phone: e.target.value })
              }
            />

            <label className="text-sm text-gray-600">City Filter</label>
            <select
              name="city"
              required
              onChange={(e) =>
                setSignupForm({ ...signupForm, city: e.target.value })
              }
              value={signupForm.city}
              className="border px-3 py-2 rounded w-full"
              placeholder="city"
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

            <div>
              <label className="text-sm font-medium">Gender</label>
              <select
                className="w-full border px-3 py-2 rounded-md"
                value={signupForm.gender}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, gender: e.target.value })
                }
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="NONE">Prefer not to say</option>
              </select>
            </div>

            <button className="w-full bg-[#FC2779] text-white py-2 rounded-md font-semibold">
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
