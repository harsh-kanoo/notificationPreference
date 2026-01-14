import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Eye,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const ViewerDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || user?.role !== "VIEWER") {
      logout();
      navigate("/");
    }
  }, [token, user, logout, navigate]);

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-350 mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
              Insights <span className="text-[#FC2779]">Monitor</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
              Data Observation & Audit Portal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <button
            onClick={() => navigate("/viewer/campaigns")}
            className="group md:col-span-2 bg-white border border-gray-100 p-10 rounded-sm shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all text-left flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-20 h-20 bg-gray-50 flex items-center justify-center rounded-sm group-hover:bg-[#FC2779] group-hover:text-white transition-all text-gray-400 shrink-0">
              <BarChart3 size={40} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-2">
                Access Campaign Intelligence
              </h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                Review all marketing broadcasts, delivery statuses, and regional
                targeting logs in real-time.
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-100 group-hover:border-[#FC2779] transition-colors">
              <ArrowRight className="text-gray-300 group-hover:text-[#FC2779] transition-colors" />
            </div>
          </button>

          <div className="bg-gray-900 text-white p-10 rounded-sm flex flex-col justify-between">
            <div>
              <Eye className="text-[#FC2779] mb-4" size={32} />
              <h4 className="text-lg font-black uppercase tracking-tight">
                Audit Mode
              </h4>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] mt-2">
                Action Restricted: <br />
                Creation & Modifications disabled
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewerDashboard;
