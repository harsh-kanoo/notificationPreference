import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";

const EditCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [form, setForm] = useState({
    campaign_name: "",
    notification_type: "OFFER",
    city_filter: "",
    gender_filter: "NONE",
    status: "DRAFT",
  });

  const token = localStorage.getItem("token");

  /* ---------------- FETCH CAMPAIGNS ---------------- */
  const fetchCampaigns = async () => {
    const { data } = await axios.get(
      "http://localhost:8080/creator/campaigns",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // only draft campaigns are editable
    setCampaigns(data.campaigns.filter((c) => c.status === "DRAFT"));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  /* ---------------- OPEN EDIT FORM ---------------- */
  const handleEditClick = (campaign) => {
    setSelectedCampaign(campaign);
    setForm({
      campaign_name: campaign.campaign_name,
      notification_type: campaign.notification_type,
      city_filter: campaign.city_filter || "",
      gender_filter: campaign.gender_filter,
      status: campaign.status,
    });
  };

  /* ---------------- HANDLE FORM CHANGE ---------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- UPDATE CAMPAIGN ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://localhost:8080/creator/campaigns/${selectedCampaign.campaign_id}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Campaign updated successfully");

    setSelectedCampaign(null);
    fetchCampaigns();
  };

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Edit Draft Campaigns</h2>

        {/* ---------------- TABLE ---------------- */}
        <table className="w-full border border-gray-200 mb-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">City</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No draft campaigns found
                </td>
              </tr>
            )}

            {campaigns.map((c) => (
              <tr key={c.campaign_id} className="border-t">
                <td className="p-2">{c.campaign_name}</td>
                <td className="p-2">{c.notification_type}</td>
                <td className="p-2">{c.city_filter || "-"}</td>
                <td className="p-2">{c.gender_filter}</td>
                <td className="p-2 font-semibold">{c.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEditClick(c)}
                    className="bg-[#FC2779] text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------------- EDIT FORM ---------------- */}
        {selectedCampaign && (
          <div className="max-w-md bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Edit Campaign</h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Campaign Name"
                name="campaign_name"
                value={form.campaign_name}
                onChange={handleChange}
              />

              <select
                name="notification_type"
                value={form.notification_type}
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
                value={form.city_filter}
                onChange={handleChange}
              />

              <select
                name="gender_filter"
                value={form.gender_filter}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="NONE">NONE</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="SENT">SENT</option>
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#FC2779] text-white px-4 py-2 rounded font-semibold"
                >
                  Update
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default EditCampaigns;
