import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";
import { useAuth } from "../../auth/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  UserPlus,
  Megaphone,
  PlusCircle,
  UploadCloud,
  LayoutDashboard,
  Edit3,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || user?.role !== "ADMIN") {
      logout();
      navigate("/");
    }
  }, [token, user]);

  const adminName = user?.email?.split("@")[0] || "Admin";

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <section className="bg-white p-8 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-800 font-bold text-2xl border-2 border-gray-800">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                System Control, Admin
              </h1>

              <div className="flex gap-2 mt-2">
                <span className="bg-black text-white text-[9px] font-black px-2 py-1 uppercase tracking-tighter">
                  Role: {user?.role}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="relative overflow-hidden rounded-sm h-64 bg-black w-full shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40"
            alt="Analytics"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-10">
            <h2 className="text-white text-4xl font-serif mb-2 italic">
              Platform Overview
            </h2>
            <p className="text-pink-200 mb-6 text-sm uppercase tracking-[0.2em]">
              Real-time monitoring & staff control
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="All Orders"
            description="Manage logistics and update order status."
            path="/admin/orders"
            icon={Package}
          />
          <DashboardCard
            title="Users & Preferences"
            description="View all registered users and settings."
            path="/admin/users"
            icon={Users}
          />
          <DashboardCard
            title="Add Staff"
            description="Register new Creator or Viewer accounts."
            path="/admin/add-staff"
            icon={UserPlus}
          />
          <DashboardCard
            title="All Campaigns"
            description="Monitor and manage marketing campaigns."
            path="/viewer/campaigns"
            icon={Megaphone}
          />
          <DashboardCard
            title="Create Campaign"
            description="Launch a new notification campaign."
            path="/creator/campaigns/create"
            icon={PlusCircle}
          />
          <DashboardCard
            title="Bulk Upload Users"
            description="Import user data via CSV file."
            path="/creator/users/upload"
            icon={UploadCloud}
          />
          <DashboardCard
            title="Edit campaigns"
            description="Review status, edit drafts, and analyze sent campaign performance."
            path="/creator/campaigns"
            icon={Edit3}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
