import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Truck,
  CheckCircle,
  Clock,
  User,
  Package,
  ExternalLink,
} from "lucide-react";
import Navbar from "../../components/Navbar";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.put(
        `http://localhost:8080/admin/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(
        orders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
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

      <main className="max-w-7xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate("/dashboard/admin")}
          className="flex items-center gap-1 text-gray-500 hover:text-nykaa text-[10px] font-black uppercase tracking-[0.2em] mb-8 transition-all"
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center bg-white gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tighter uppercase">
                Order Management
              </h1>
              <p className="text-gray-400 text-xs mt-1">
                Review and update global logistics status for all customers.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full border border-pink-100">
              <Package size={14} className="text-nykaa" />
              <span className="text-[10px] font-black text-nykaa uppercase tracking-widest">
                {orders.length} Active Orders
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Customer Details
                  </th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Product Info
                  </th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                    Manage Logistics
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order.order_id}
                    className="hover:bg-gray-50/30 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                          {order.users?.name?.charAt(0) || <User size={16} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm tracking-tight">
                            {order.users?.name || "Guest User"}
                          </p>
                          <p className="text-gray-400 text-[11px]">
                            {order.users?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="font-medium text-gray-700 text-sm">
                        {order.product?.name}
                      </p>
                      <p className="text-nykaa font-mono text-[11px] mt-1 italic">
                        ID: #{order.order_id.slice(-6)}
                      </p>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "SHIPPED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-pink-50 text-nykaa border border-pink-100"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <button
                          disabled={
                            order.status === "SHIPPED" ||
                            order.status === "DELIVERED"
                          }
                          onClick={() =>
                            handleStatusUpdate(order.order_id, "SHIPPED")
                          }
                          className={`p-3 rounded-sm transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                            order.status === "SHIPPED" ||
                            order.status === "DELIVERED"
                              ? "bg-gray-50 text-gray-300"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100"
                          }`}
                        >
                          <Truck size={14} />{" "}
                          {order.status === "SHIPPED" ? "Shipped" : "Ship Now"}
                        </button>

                        <button
                          disabled={order.status === "DELIVERED"}
                          onClick={() =>
                            handleStatusUpdate(order.order_id, "DELIVERED")
                          }
                          className={`p-3 rounded-sm transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                            order.status === "DELIVERED"
                              ? "bg-green-50 text-green-600 border border-green-200"
                              : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border border-green-100"
                          }`}
                        >
                          <CheckCircle size={14} />{" "}
                          {order.status === "DELIVERED"
                            ? "Delivered"
                            : "Deliver"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-[#1a1a1a] p-6 rounded-sm text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">
            Logistics Control Panel — Changes are reflected on user dashboards
            in real-time.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
