import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";

const AdminDashboard = () => {
  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Users & Preferences"
            description="View all users and their preferences"
            path="/admin/users"
          />

          <DashboardCard
            title="Campaigns"
            description="View all campaigns and their status"
            path="/admin/campaigns"
          />

          <DashboardCard
            title="Add Staff"
            description="Create Creator or Viewer accounts"
            path="/admin/add-staff"
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
