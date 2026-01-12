import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      login(data);

      // role-based redirect
      const role = data.staff.role;
      if (role === "ADMIN") navigate("/dashboard/admin");
      else if (role === "CREATOR") navigate("/dashboard/creator");
      else if (role === "VIEWER") navigate("/dashboard/viewer");
      else navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#FC2779] mb-2">
          Nykaa
        </h1>
        <p className="text-center text-gray-500 mb-6">Staff Login</p>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
