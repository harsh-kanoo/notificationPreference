import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const CreateCampaign = () => {
  const [form, setForm] = useState({
    campaign_name: "",
    notification_type: "OFFER",
    city_filter: "",
    gender_filter: "NONE",
    status: "DRAFT",
  });
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (token == null || !user || user.role !== "CREATOR") {
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
      if (form.campaign_name == "") {
        alert("Add a campaign name");
        return;
      }
      await axios.post("http://localhost:8080/creator/campaigns", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        campaign_name: "",
        notification_type: "OFFER",
        city_filter: "NONE",
        gender_filter: "NONE",
        status: "DRAFT",
      });

      alert("Campaign created successfully");
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.response && error.response.status === 403) {
        alert("Access Denied: You are not a Creator.");
        navigate("/login");
      } else if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex justify-center pt-10">
        <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Create Campaign
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Campaign Name"
              name="campaign_name"
              onChange={handleChange}
            />

            <label className="text-sm text-gray-600">Notification type</label>
            <select
              name="notification_type"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="OFFER">OFFER</option>
              <option value="ORDER_UPDATE">ORDER UPDATE</option>
              <option value="NEWSLETTER">NEWSLETTER</option>
            </select>

            <label className="text-sm text-gray-600">City Filter</label>
            <select
              name="city_filter"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
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

            <label className="text-sm text-gray-600">Gender Filter</label>
            <select
              name="gender_filter"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="NONE">NONE</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>

            <label className="text-sm text-gray-600">Status</label>
            <select
              name="status"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="SENT">SENT</option>
            </select>

            <button className="w-full bg-[#FC2779] text-white py-2 rounded font-semibold">
              Create Campaign
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCampaign;
