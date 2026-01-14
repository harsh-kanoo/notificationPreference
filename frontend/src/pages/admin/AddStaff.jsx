import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useEffect } from "react";

const AddStaff = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    gender: "MALE",
    role: "CREATOR",
  });
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  useEffect(() => {
    if (!token || user?.role !== "ADMIN") {
      logout();
      navigate("/login");
    }
  }, [user, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/admin/addStaff", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Staff created successfully");
      navigate("/dashboard/admin");
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.response && error.response.status === 403) {
        alert("Access Denied: You are not an Admin.");
        navigate("/");
      } else if (error.response && error.response.status === 401) {
        navigate("/");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex justify-center items-start pt-10">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6 text-center">Add Staff</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" name="name" onChange={handleChange} />
            <Input label="Email" name="email" onChange={handleChange} />
            <Input
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
            />

            <label className="text-sm text-gray-600">Role</label>
            <select
              required
              name="role"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="CREATOR">CREATOR</option>
              <option value="VIEWER">VIEWER</option>
            </select>

            <Input
              name="phone"
              label="Phone"
              required
              value={form.phone}
              onChange={handleChange}
            />

            <label className="text-sm text-gray-600">City</label>
            <select
              name="city"
              required
              onChange={handleChange}
              value={form.city}
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
                required
                className="w-full border px-3 py-2 rounded-md"
                value={form.gender}
                onChange={handleChange}
                name="gender"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="NONE">Prefer not to say</option>
              </select>
            </div>

            <button className="w-full bg-[#FC2779] text-white py-2 rounded font-semibold hover:bg-[#E91E63]">
              Add Staff
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddStaff;
