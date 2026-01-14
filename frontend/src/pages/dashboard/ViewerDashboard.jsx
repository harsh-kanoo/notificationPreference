import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ViewerDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || user?.role !== "VIEWER") {
      logout();
      navigate("/");
    }
  }, [token, user]);

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Viewer Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Campaigns"
            description="View all campaigns and their status"
            path="/viewer/campaigns"
          />
        </div>
      </div>
    </>
  );
};

export default ViewerDashboard;
