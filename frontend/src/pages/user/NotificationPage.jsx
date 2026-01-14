import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Bell,
  X,
  Clock,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Navbar from "../../components/Navbar";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" }); // Custom Alert State

  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  useEffect(() => {
    if (!token || user?.role !== "CUSTOMER") {
      logout();
      navigate("/");
    }
  }, [token, user]);

  // Fetch Notifications
  useEffect(() => {
    const fetchPushNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/userAuth/notifications/push",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("Error loading notifications:", err);
        showStatus("error", "Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchPushNotifications();
  }, [token]);

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: "", message: "" }), 3000);
  };

  const handleDelete = async (campaignId) => {
    const originalList = [...notifications];
    setNotifications(
      notifications.filter((n) => n.campaign.campaign_id !== campaignId)
    );

    try {
      const userId = user.user_id;

      await axios.delete(
        `http://localhost:8080/user/notification/${userId}/${campaignId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showStatus("success", "Notification removed.");
    } catch (error) {
      console.error("Error deleting notification:", error);
      setNotifications(originalList);
      showStatus("error", "Failed to delete. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FC2779]"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate("/userDashboard")}
          className="flex items-center gap-1 text-gray-500 hover:text-[#FC2779] text-[10px] font-black uppercase tracking-[0.2em] mb-6 transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-[#FC2779]">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-gray-500 text-xs">
                Stay updated with your latest offers and alerts.
              </p>
            </div>
          </div>
          <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
            {notifications.length} New
          </span>
        </div>

        {status.message && (
          <div
            className={`fixed top-24 right-4 md:right-10 z-50 px-6 py-4 rounded-md shadow-lg flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${
              status.type === "success"
                ? "bg-black text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-xs font-bold uppercase tracking-wider">
              {status.message}
            </span>
          </div>
        )}

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-sm shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Bell size={32} />
              </div>
              <h3 className="text-gray-800 font-bold">No Notifications</h3>
              <p className="text-gray-400 text-sm mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.campaign.campaign_id}
                className="relative bg-white p-6 rounded-sm shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => handleDelete(notif.campaign.campaign_id)}
                  className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                  title="Remove Notification"
                >
                  <X size={16} />
                </button>

                <div className="flex gap-4">
                  <div className="w-1 bg-[#FC2779] rounded-full h-auto"></div>

                  <div className="flex-1 pr-8">
                    <span className="inline-block bg-pink-50 text-[#FC2779] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded mb-2">
                      {notif.campaign.notification_type}
                    </span>

                    <h3 className="text-gray-900 font-bold text-lg mb-1">
                      {notif.campaign.campaign_name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-3">
                      {notif.campaign.message ||
                        "Check out this exclusive offer tailored just for you."}
                    </p>

                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                      <Clock size={12} />
                      {new Date(notif.sent_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;
