import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";

const CreatorDashboard = () => {
  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Creator Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Create Campaign"
            description="Create a new marketing campaign"
            path="/creator/campaigns/create"
          />

          <DashboardCard
            title="Bulk Upload Users"
            description="Upload users and preferences via CSV"
            path="/creator/users/upload"
          />

          <DashboardCard
            title="Edit Campaigns"
            description="Edit existing draft campaigns"
            path="/creator/campaigns"
          />
        </div>
      </div>
    </>
  );
};

export default CreatorDashboard;
