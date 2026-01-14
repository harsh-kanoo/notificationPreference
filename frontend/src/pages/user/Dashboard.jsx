import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../auth/AuthContext";
import {
  ShoppingBag,
  Package,
  Settings,
  Bell,
  ChevronRight,
  User,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token || user?.role !== "CUSTOMER") {
      logout();
      navigate("/");
    }
  }, [token, user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/user/get-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const userName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <section className="bg-white p-8 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-[#FC2779] font-bold text-2xl border-2 border-[#FC2779]">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Hello, {userName}!
              </h1>
              <p className="text-gray-500 text-sm">
                Welcome back to your Nykaa experience ✨
              </p>
              <Link
                to="/profile"
                className="text-[#FC2779] text-[10px] font-black tracking-widest hover:underline flex items-center mt-2 uppercase"
              >
                Edit Profile <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <div className="flex gap-4 mt-6 md:mt-0">
            <Link
              to="/notifications"
              className="relative flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
              <span className="text-[10px] font-bold uppercase mt-1">
                Alerts
              </span>
            </Link>

            <Link
              to="/preferences"
              className="flex flex-col items-center p-4 bg-pink-50 border border-pink-200 rounded-lg hover:bg-pink-100"
            >
              <Settings size={20} className="text-[#FC2779]" />
              <span className="text-[10px] font-bold text-[#FC2779] uppercase">
                Preferences
              </span>
            </Link>
          </div>
        </section>

        <div
          onClick={() => navigate("/shop")}
          className="relative overflow-hidden rounded-sm cursor-pointer group h-64 bg-black w-full"
        >
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            alt="Banner"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-10">
            <h2 className="text-white text-4xl font-serif mb-2 italic">
              The Beauty Store
            </h2>
            <p className="text-pink-200 mb-6 text-sm uppercase tracking-[0.2em]">
              500+ curated brands
            </p>
            <button className="w-fit bg-[#FC2779] text-white px-8 py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-[#FC2779] transition-all">
              Shop Now
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border w-full">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-sm mb-4">
            <Package size={18} className="text-[#FC2779]" /> Recent Orders
          </h3>

          {loadingOrders ? (
            <p className="text-gray-400">Loading orders...</p>
          ) : orders.length > 0 ? (
            <table className="w-full text-sm">
              <tbody className="divide-y">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.order_id}>
                    <td className="py-3 font-semibold">
                      {order.product?.name}
                    </td>
                    <td className="py-3">
                      <span className="px-5 py-2 rounded-full text-[12px] font-black uppercase bg-pink-50 text-[#FC2779]">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono">
                      ₹{order.product?.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 italic">
              No orders yet. Start shopping!
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
