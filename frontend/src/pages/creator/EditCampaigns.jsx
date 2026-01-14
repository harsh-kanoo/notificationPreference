import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Edit3,
  MapPin,
  Users as UsersIcon,
  Calendar,
  X,
  Save,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const EditCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [form, setForm] = useState({
    campaign_name: "",
    city_filter: "NONE",
    gender_filter: "NONE",
    status: "DRAFT",
    scheduled_at: "",
  });

  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  useEffect(() => {
    if (!token || (user?.role !== "CREATOR" && user?.role !== "ADMIN")) {
      logout();
      navigate("/");
    }
  }, [user, token, logout, navigate]);

  const fetchCampaigns = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/creator/campaigns",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCampaigns(data.campaigns);
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleEditClick = (campaign) => {
    setSelectedCampaign(campaign);
    setForm({
      campaign_name: campaign.campaign_name,
      city_filter: campaign.city_filter || "NONE",
      gender_filter: campaign.gender_filter,
      status: campaign.status,
      scheduled_at: campaign.scheduled_at
        ? campaign.scheduled_at.substring(0, 16)
        : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.campaign_name.trim()) {
      alert("Campaign name is required");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/creator/campaigns/${selectedCampaign.campaign_id}`,
        {
          ...form,
          scheduled_at:
            form.status === "SCHEDULED"
              ? new Date(form.scheduled_at).toISOString()
              : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Campaign updated successfully");
      setSelectedCampaign(null);
      fetchCampaigns();
    } catch (error) {
      alert("Update failed. Please check your inputs.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
            Edit <span className="text-[#FC2779]">Campaigns</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
            Draft Management Console
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div
            className={`flex-1 transition-all ${
              selectedCampaign ? "lg:w-2/3" : "w-full"
            }`}
          >
            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Campaign Details
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Targeting
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {campaigns.map((c) => (
                    <tr
                      key={c.campaign_id}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        selectedCampaign?.campaign_id === c.campaign_id
                          ? "bg-pink-50/30"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">
                          {c.campaign_name}
                        </p>
                        <div
                          className={`inline-flex items-center gap-1 text-[9px] font-black uppercase mt-1 px-2 py-0.5 rounded-full border ${
                            c.status === "SENT"
                              ? "bg-green-50 text-green-600 border-green-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}
                        >
                          {c.status === "SENT" ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <Clock size={10} />
                          )}
                          {c.status}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {c.city_filter || "Global"}
                          </span>
                          <span className="flex items-center gap-1">
                            <UsersIcon size={10} /> {c.gender_filter}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          disabled={c.status === "SENT"}
                          onClick={() => handleEditClick(c)}
                          className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all ${
                            c.status === "SENT"
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-[#FC2779] hover:bg-[#FC2779] hover:text-white border border-[#FC2779]"
                          }`}
                        >
                          Modify <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {campaigns.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs"
                      >
                        No editable drafts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedCampaign && (
            <div className="lg:w-1/3 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white p-8 border border-gray-100 shadow-xl rounded-sm sticky top-10">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-[#FC2779]">
                    <Edit3 size={18} />
                    <h3 className="font-black uppercase tracking-tighter text-lg">
                      Modify Draft
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  <Input
                    label="Campaign Name"
                    name="campaign_name"
                    value={form.campaign_name}
                    onChange={handleChange}
                    required
                  />

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Target Region
                    </label>
                    <select
                      name="city_filter"
                      value={form.city_filter}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-100 py-2 text-sm font-bold focus:border-[#FC2779] outline-none transition-colors"
                    >
                      <option value="NONE">All Regions</option>
                      {[
                        "Bangalore",
                        "Delhi",
                        "Mumbai",
                        "Hyderabad",
                        "Chennai",
                        "Kolkata",
                        "Pune",
                      ].map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Gender Segment
                    </label>
                    <select
                      name="gender_filter"
                      value={form.gender_filter}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-100 py-2 text-sm font-bold focus:border-[#FC2779] outline-none transition-colors"
                    >
                      <option value="NONE">Universal</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Final Action
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-100 py-2 text-sm font-bold focus:border-[#FC2779] outline-none transition-colors"
                    >
                      <option value="DRAFT">Keep as Draft</option>
                      <option value="SCHEDULED">Schedule Release</option>
                    </select>
                  </div>

                  {form.status === "SCHEDULED" && (
                    <div className="space-y-1 animate-in fade-in zoom-in-95 duration-200">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <Calendar size={12} /> Launch Time
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

                  <div className="flex gap-3 pt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-[#FC2779] text-white py-4 rounded-sm font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={14} /> Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCampaign(null)}
                      className="flex-1 border border-gray-200 text-gray-400 py-4 rounded-sm font-black uppercase tracking-widest text-[11px] hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditCampaigns;
