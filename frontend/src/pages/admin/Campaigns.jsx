import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Megaphone,
  MapPin,
  Users as UsersIcon,
  Send,
  CheckCircle2,
  Clock,
} from "lucide-react";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  useEffect(() => {
    if (!token || user?.role !== "ADMIN") {
      logout();
      navigate("/");
    }
  }, [user, token, logout, navigate]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/admin/campaigns",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCampaigns(data.campaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        if (error.response?.status === 403 || error.response?.status === 401) {
          navigate("/");
        }
      }
    };
    if (token) fetchCampaigns();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-350 mx-auto px-6 py-10">
        {/* --- Header --- */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
            Marketing <span className="text-[#FC2779]">Campaigns</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
            System Broadcast Monitor
          </p>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Campaign Name
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Target Filters
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Reach
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.map((c) => (
                  <tr
                    key={c.campaign_id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-50 rounded-sm border border-pink-100">
                          <Megaphone size={18} className="text-[#FC2779]" />
                        </div>
                        <span className="text-sm font-black text-gray-800 uppercase tracking-tighter">
                          {c.campaign_name}
                        </span>
                      </div>
                    </td>

                    {/* Filters (City & Gender Stacked) */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                          <MapPin size={12} className="text-gray-400" />
                          {c.city_filter || "ALL REGIONS"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                          <UsersIcon size={12} className="text-gray-400" />
                          {c.gender_filter || "ALL GENDERS"}
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          c.status === "SENT" || c.status === "COMPLETED"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {c.status === "SENT" || c.status === "COMPLETED" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {c.status}
                      </div>
                    </td>

                    {/* Sent Count Reach */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-gray-800">
                          {c.status === "SENT" || c.status === "COMPLETED"
                            ? c.sent_count || 0
                            : "—"}
                        </span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                          <Send size={10} /> Total Recipients
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {campaigns.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                No campaign data available in system logs.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Campaigns;
