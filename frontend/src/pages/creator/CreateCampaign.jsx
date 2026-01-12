import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";

const CreateCampaign = () => {
  const [form, setForm] = useState({
    campaign_name: "",
    notification_type: "OFFER",
    city_filter: "",
    gender_filter: "NONE",
    status: "DRAFT",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post("http://localhost:8080/creator/campaigns", form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Campaign created successfully");
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

            <select
              name="notification_type"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="OFFER">OFFER</option>
              <option value="ORDER_UPDATE">ORDER UPDATE</option>
              <option value="NEWSLETTER">NEWSLETTER</option>
            </select>

            <Input
              label="City Filter"
              name="city_filter"
              onChange={handleChange}
            />

            <select
              name="gender_filter"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="NONE">NONE</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>

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
