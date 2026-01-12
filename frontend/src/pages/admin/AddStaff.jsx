import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Button from "../../components/Button";

const AddStaff = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CREATOR",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post("http://localhost:8080/admin/addStaff", form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Staff created successfully");
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

            <select
              name="role"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="CREATOR">CREATOR</option>
              <option value="VIEWER">VIEWER</option>
            </select>

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
