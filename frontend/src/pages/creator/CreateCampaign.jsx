import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Megaphone,
  MapPin,
  Users as UsersIcon,
  Calendar,
  Info,
  Send,
} from "lucide-react";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  const [form, setForm] = useState({
    campaign_name: "",
    city_filter: "NONE",
    gender_filter: "NONE",
    scheduled_at: "",
    status: "DRAFT",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || (user?.role !== "ADMIN" && user?.role !== "CREATOR")) {
      logout();
      navigate("/");
    }
  }, [token, user, logout, navigate]);

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
          ...form,
          scheduled_at:
            form.status === "SCHEDULED"
              ? new Date(form.scheduled_at).toISOString()
              : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        form.status === "DRAFT"
          ? "Campaign saved as draft"
          : "Campaign scheduled successfully"
      );
      navigate(
        user.role === "CREATOR" ? "/dashboard/creator" : "/dashboard/admin"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-white p-8 shadow-sm border border-gray-100 rounded-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-pink-50 rounded-sm">
                <Megaphone className="text-[#FC2779]" size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
                Launch <span className="text-[#FC2779]">Campaign</span>
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase flex items-center gap-2">
                <Info size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Campaign Name"
                name="campaign_name"
                placeholder="e.g. Summer Flash Sale 2024"
                value={form.campaign_name}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                    <MapPin size={12} /> Target City
                  </label>
                  <select
                    name="city_filter"
                    value={form.city_filter}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-100 py-2 text-sm font-bold focus:border-[#FC2779] outline-none transition-colors bg-transparent"
                  >
                    <option value="NONE">All Cities</option>
                    {[
                      "Bangalore",
                      "Delhi",
                      "Mumbai",
                      "Hyderabad",
                      "Chennai",
                      "Kolkata",
                      "Pune",
                      "Ahmedabad",
                      "Jaipur",
                      "Surat",
                    ].map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                    <UsersIcon size={12} /> Target Gender
                  </label>
                  <select
                    name="gender_filter"
                    value={form.gender_filter}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-100 py-2 text-sm font-bold focus:border-[#FC2779] outline-none transition-colors bg-transparent"
                  >
                    <option value="NONE">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Launch Action
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-100 py-2 text-sm font-bold focus:border-[#FC2779] outline-none transition-colors bg-transparent"
                >
                  <option value="DRAFT">Save as Draft</option>
                  <option value="SCHEDULED">Schedule for Later</option>
                </select>
              </div>

              {form.status === "SCHEDULED" && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                    <Calendar size={12} /> Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_at"
                    value={form.scheduled_at}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-100 py-2 text-sm font-bold focus:border-[#FC2779] outline-none"
                  />
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-[#FC2779] text-white py-4 mt-4 rounded-sm font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <Send size={14} />{" "}
                    {form.status === "DRAFT"
                      ? "Save Campaign"
                      : "Authorize & Schedule"}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="hidden md:block w-72 space-y-4">
            <div className="bg-gray-900 text-white p-6 rounded-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
                Campaign Preview
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black">
                    Headline
                  </p>
                  <p className="text-sm font-bold truncate">
                    {form.campaign_name || "Untitled Campaign"}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-black">
                      Region Filter
                    </p>
                    <p className="text-xs font-bold">{form.city_filter}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-black">
                      Gender Filter
                    </p>
                    <p className="text-xs font-bold">{form.gender_filter}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-[9px] text-gray-500 uppercase font-black">
                    Execution
                  </p>
                  <p className="text-xs font-bold text-[#FC2779]">
                    {form.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateCampaign;
