import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const ViewCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const token = localStorage.getItem("token");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token == null || !user || user.role !== "VIEWER") {
      logout();
      navigate("/login");
    }
  }, [user, token]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data } = await axios.get(
        "http://localhost:8080/viewer/campaigns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCampaigns(data.campaigns);
    };

    fetchCampaigns();
  }, []);

  const downloadRecipients = async (campaignId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/viewer/campaigns/${campaignId}/recipients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `campaign_${campaignId}_recipients.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download recipients");
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Campaigns</h2>

        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">City</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Sent To</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((c) => (
              <tr key={c.campaign_id} className="border-t">
                <td className="p-2">{c.campaign_name}</td>
                <td className="p-2">{c.notification_type}</td>
                <td className="p-2">{c.city_filter || "NONE"}</td>
                <td className="p-2">{c.gender_filter}</td>
                <td className="p-2 font-semibold">{c.status}</td>
                <td className="p-2 text-center">
                  {c.status === "SENT" ? c.sent_count : "-"}
                </td>
                <td className="p-2 text-center">
                  {c.status === "SENT" && (
                    <button
                      className="bg-[#FC2779] text-white px-3 py-1 rounded text-sm"
                      onClick={() => downloadRecipients(c.campaign_id)}
                    >
                      Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ViewCampaigns;
