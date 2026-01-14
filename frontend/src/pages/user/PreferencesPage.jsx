import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Settings, Bell, ChevronLeft, Check, Save } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/AuthContext";

const PreferencesPage = () => {
  const [prefs, setPrefs] = useState({
    order_updates: "",
    offers: "",
    newsletter: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const { token, user } = useAuth();

  const channels = ["EMAIL", "SMS", "PUSH"];
  const categories = [
    {
      label: "Order Updates",
      key: "order_updates",
      desc: "Real-time tracking and delivery status",
    },
    {
      label: "Promotional Offers",
      key: "offers",
      desc: "Exclusive discounts and sale early access",
    },
    {
      label: "Newsletter",
      key: "newsletter",
      desc: "Weekly beauty trends and expert tips",
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || user?.role !== "CUSTOMER") navigate("/");
  }, [token, user]);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/userAuth/preferences",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPrefs({
          order_updates: res.data.order_updates || "",
          offers: res.data.offers || "",
          newsletter: res.data.newsletter || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchPrefs();
  }, [token]);

  const handleToggle = (categoryKey, channel) => {
    let current = prefs[categoryKey];
    let currentArray = !current || current === "OFF" ? [] : current.split(",");

    if (currentArray.includes(channel)) {
      currentArray = currentArray.filter((c) => c !== channel);
    } else {
      currentArray.push(channel);
    }

    const newValue = currentArray.length === 0 ? "OFF" : currentArray.join(",");
    setPrefs({ ...prefs, [categoryKey]: newValue });
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await axios.put("http://localhost:8080/userAuth/preferences", prefs, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Preferences saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to save. Check server logs.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nykaa"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 hover:text-nykaa text-[10px] font-black uppercase tracking-[0.2em] mb-8 transition-all"
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-nykaa border border-pink-100">
                <Settings size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tighter uppercase">
                  Notification Settings
                </h1>
                <p className="text-gray-400 text-xs mt-1">
                  Manage how we reach out to you across different categories.
                </p>
              </div>
            </div>
            <Bell size={40} className="text-gray-50 hidden md:block" />
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Notification Category
                    </th>
                    {channels.map((ch) => (
                      <th
                        key={ch}
                        className="py-6 text-center text-xs font-bold text-gray-800 uppercase tracking-widest w-32"
                      >
                        {ch}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map((cat) => (
                    <tr
                      key={cat.key}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-8">
                        <p className="font-bold text-gray-800 text-sm tracking-tight uppercase">
                          {cat.label}
                        </p>
                        <p className="text-gray-400 text-[11px] mt-1">
                          {cat.desc}
                        </p>
                      </td>
                      {channels.map((ch) => {
                        // Logic check: Ensure we handle empty strings safely
                        const currentVal = prefs[cat.key] || "";
                        const isChecked =
                          currentVal !== "OFF" &&
                          currentVal.split(",").includes(ch);

                        return (
                          <td key={ch} className="py-8 text-center">
                            <button
                              onClick={() => handleToggle(cat.key, ch)}
                              className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center mx-auto ${
                                isChecked
                                  ? "bg-[#E80071] border-[#E80071] text-white shadow-md shadow-pink-100"
                                  : "border-gray-300 text-transparent hover:border-pink-300"
                              }`}
                            >
                              {/* We use text-transparent when unchecked to hide the icon, 
            and text-white when checked to show it */}
                              <Check size={20} strokeWidth={4} />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <button
                onClick={savePreferences}
                disabled={saving}
                className="bg-black text-white px-16 py-4 font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-nykaa transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
              >
                {saving ? (
                  "Updating..."
                ) : (
                  <>
                    <Save size={16} /> Save Preferences
                  </>
                )}
              </button>
              {message && (
                <p className="text-nykaa text-[11px] font-bold uppercase tracking-widest animate-pulse">
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 bg-[#1a1a1a] p-8 text-center rounded-sm">
          <p className="text-gray-500 text-[9px] uppercase tracking-[0.3em] leading-loose">
            Nykaa Privilege Security <br />
            Encrypted End-to-End Preference Management System
          </p>
        </div>
      </main>
    </div>
  );
};

export default PreferencesPage;
