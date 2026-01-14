import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Download,
  MapPin,
  Users as UsersIcon,
  CheckCircle2,
  Clock,
  BarChart2,
  FileSpreadsheet,
} from "lucide-react";

const ViewCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (user?.role !== "VIEWER" && user?.role !== "ADMIN")) {
      logout();
      navigate("/");
    }
  }, [user, token, logout, navigate]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/viewer/campaigns",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCampaigns(data.campaigns);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    if (token) fetchCampaigns();
  }, [token]);

  const downloadRecipients = async (campaignId, campaignName) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/viewer/campaigns/${campaignId}/recipients`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${campaignName.replace(/\s+/g, "_")}_Recipients.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to export recipient data.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-350 mx-auto px-6 py-10">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
              Campaign <span className="text-[#FC2779]">Archive</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
              Performance Logs & Auditor View
            </p>
          </div>
          <div className="bg-white px-4 py-2 border border-gray-100 rounded-sm shadow-sm hidden md:block">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <BarChart2 size={12} className="text-[#FC2779]" /> Total Logs:{" "}
              {campaigns.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Identity
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Targeting Parameters
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">
                    Reach
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Reporting
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.map((c) => (
                  <tr
                    key={c.campaign_id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-gray-800 uppercase tracking-tighter">
                        {c.campaign_name}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                          <MapPin size={12} className="text-gray-300" />
                          {c.city_filter || "ALL REGIONS"}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 uppercase tracking-tight">
                          <UsersIcon size={12} className="text-gray-300" />
                          {c.gender_filter || "ALL GENDERS"}
                        </div>
                      </div>
                    </td>

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

                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-gray-800 italic">
                        {c.status === "SENT" || c.status === "COMPLETED"
                          ? (c.sent_count || 0).toLocaleString()
                          : "—"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      {c.status === "SENT" || c.status === "COMPLETED" ? (
                        <button
                          onClick={() =>
                            downloadRecipients(c.campaign_id, c.campaign_name)
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-[#FC2779] transition-all group"
                        >
                          <FileSpreadsheet
                            size={14}
                            className="text-[#FC2779] group-hover:text-white"
                          />
                          CSV Export
                        </button>
                      ) : (
                        <span className="text-[9px] font-black text-gray-300 uppercase italic">
                          Pending Results
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewCampaigns;
