import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Megaphone,
  UploadCloud,
  Edit3,
  Activity,
  Zap,
  BarChart3,
  Layers,
} from "lucide-react";

const CreatorDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || user?.role !== "CREATOR") {
      logout();
      navigate("/");
    }
  }, [token, user, logout, navigate]);

  const CreatorCard = ({ title, description, path, icon: Icon }) => (
    <button
      onClick={() => navigate(path)}
      className="group bg-white border border-gray-100 p-8 rounded-sm shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all text-left flex flex-col justify-between min-h-55"
    >
      <div>
        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#FC2779] group-hover:text-white transition-colors text-gray-400">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-350 mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
              Creator <span className="text-[#FC2779]">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
              Marketing & Data Control Panel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CreatorCard
            title="Launch Campaign"
            description="Create and broadcast new marketing notifications to target users."
            path="/creator/campaigns/create"
            icon={Megaphone}
          />

          <CreatorCard
            title="Import Database"
            description="Upload CSV files to synchronize user profiles and preferences."
            path="/creator/users/upload"
            icon={UploadCloud}
          />

          <CreatorCard
            title="Campaign Logs"
            description="Review status, edit drafts, and analyze sent campaign performance."
            path="/creator/campaigns"
            icon={Edit3}
          />
        </div>
      </main>
    </div>
  );
};

export default CreatorDashboard;
