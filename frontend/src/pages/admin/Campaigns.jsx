import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (token == null) navigate("/login");

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data } = await axios.get(
        "http://localhost:8080/admin/campaigns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setCampaigns(data.campaigns);
    };

    fetchCampaigns();
  }, []);

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
              <th className="p-2">Target City</th>
              <th className="p-2">Target Gender</th>
              <th className="p-2">Status</th>
              <th className="px-4 py-2">Sent To</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.campaign_id} className="border-t">
                <td className="p-2">{c.campaign_name}</td>
                <td className="p-2">{c.notification_type}</td>
                <td className="p-2">{c.city_filter}</td>
                <td className="p-2">{c.gender_filter}</td>
                <td className="p-2 font-semibold">{c.status}</td>
                <td className="px-4 py-2 text-center">
                  {c.status === "SENT" ? c.sent_count : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Campaigns;
