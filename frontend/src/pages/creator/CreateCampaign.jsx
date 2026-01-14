import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  const [form, setForm] = useState({
    campaign_name: "",
    city_filter: "NONE",
    gender_filter: "NONE",
    scheduled_at: null,
    status: "DRAFT",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || (user?.role !== "ADMIN" && user?.role !== "CREATOR")) {
      console.log("error 1");
      logout();
      navigate("/");
    }
  }, [token, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.campaign_name.trim()) {
      setError("Campaign name is required");
      return;
    }

    if (form.status === "SCHEDULED" && !form.scheduled_at) {
      setError("Please select schedule date & time");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/creator/campaigns",
        {
          campaign_name: form.campaign_name,
          city_filter: form.city_filter,
          gender_filter: form.gender_filter,
          scheduled_at:
            form.status === "SCHEDULED"
              ? new Date(form.scheduled_at).toISOString()
              : null,
          status: form.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        form.status === "DRAFT"
          ? "Campaign saved as draft"
          : "Campaign scheduled successfully"
      );

      user.role === "CREATOR"
        ? navigate("/dashboard/creator")
        : navigate("/dashboard/admin");
    } catch (err) {
      if (err.response?.status === 401) navigate("/");
      else if (err.response?.status === 403)
        setError("You are not authorized to create campaigns");
      else setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Campaign Name"
              name="campaign_name"
              value={form.campaign_name}
              onChange={handleChange}
            />

            <label className="text-sm text-gray-600">City Filter</label>
            <select
              name="city_filter"
              value={form.city_filter}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="NONE">All Cities</option>
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

            <label className="text-sm text-gray-600">Gender Filter</label>
            <select
              name="gender_filter"
              value={form.gender_filter}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="NONE">All</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>

            <label className="text-sm text-gray-600">Action</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="DRAFT">Save as Draft</option>
              <option value="SCHEDULED">Schedule Campaign</option>
            </select>

            {form.status === "SCHEDULED" && (
              <div>
                <label className="text-sm text-gray-600">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  value={form.scheduled_at}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-[#FC2779] text-white py-2 rounded font-semibold"
            >
              {loading ? "Creating..." : "Create Campaign"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCampaign;
