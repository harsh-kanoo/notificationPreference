import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Mail,
  MapPin,
  Smartphone,
  MessageSquare,
  Inbox,
  AlertCircle,
  User as UserIcon,
  Loader2,
  Check,
  X,
  Search,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState(null);

  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  useEffect(() => {
    if (!token || user?.role !== "ADMIN") {
      logout();
      navigate("/");
    }
  }, [user, token, logout, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:8080/admin/users", {
          params: { search: search },
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (token) fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [token, search]);

  const toggleStatus = async (userId, currentStatus) => {
    setToggling(userId);
    const originalUsers = [...users];

    setUsers(
      users.map((u) =>
        u.user_id === userId ? { ...u, is_active: !currentStatus } : u
      )
    );

    try {
      await axios.put(
        `http://localhost:8080/admin/user/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
      setUsers(originalUsers);
    } finally {
      setToggling(null);
    }
  };

  const ChannelBadge = ({ type }) => {
    const icons = {
      push: <Smartphone size={10} />,
      email: <Inbox size={10} />,
      sms: <MessageSquare size={10} />,
    };

    return (
      <span className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase text-gray-600 shadow-sm">
        {icons[type.toLowerCase()] || <AlertCircle size={10} />}
        {type}
      </span>
    );
  };

  const renderChannels = (prefValue) => {
    if (
      !prefValue ||
      prefValue === "none" ||
      prefValue === "off" ||
      (Array.isArray(prefValue) && prefValue.length === 0)
    ) {
      return <span className="text-[10px] text-gray-300 italic">Off</span>;
    }
    const channels =
      typeof prefValue === "string" ? prefValue.split(/[\s,]+/) : prefValue;
    return (
      <div className="flex flex-wrap gap-1">
        {channels.map((ch, i) => (
          <ChannelBadge key={i} type={ch} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Navbar />

      <main className="max-w-350 mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
              User <span className="text-[#FC2779]">Preferences</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">
              Master Database: {users.length} Users Found
            </p>
          </div>

          {/* New Search Box */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:border-[#FC2779] focus:ring-1 focus:ring-[#FC2779] sm:text-sm font-medium transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden min-h-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="animate-spin text-[#FC2779] mb-2" size={32} />
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                Searching Database...
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <h3 className="text-gray-800 font-bold">No Users Found</h3>
              <p className="text-gray-400 text-xs mt-1">
                Try adjusting your search terms.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      User Identity
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Location
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Offers
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Updates
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Newsletter
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr
                      key={u.user_id}
                      className={`hover:bg-gray-50/50 transition-colors ${
                        !u.is_active ? "bg-gray-50 opacity-75" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${
                              u.is_active
                                ? "bg-pink-50 text-[#FC2779] border-pink-100"
                                : "bg-gray-200 text-gray-500 border-gray-300"
                            }`}
                          >
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              {u.name}
                            </p>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                              <Mail size={10} /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(u.user_id, u.is_active)}
                          disabled={toggling === u.user_id}
                          className={`relative w-12 h-6 rounded-full transition-all duration-300 ease-in-out focus:outline-none ${
                            u.is_active ? "bg-[#10B981]" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                              u.is_active ? "translate-x-6" : "translate-x-0"
                            }`}
                          >
                            {toggling === u.user_id ? (
                              <Loader2
                                size={10}
                                className="animate-spin text-gray-400"
                              />
                            ) : u.is_active ? (
                              <Check
                                size={10}
                                className="text-[#10B981] stroke-4"
                              />
                            ) : (
                              <X size={10} className="text-gray-400 stroke-4" />
                            )}
                          </span>
                        </button>
                        <div className="text-[9px] font-bold uppercase tracking-wider mt-1 text-gray-400 pl-1">
                          {u.is_active ? "Active" : "Inactive"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium capitalize">
                          <UserIcon size={12} className="text-gray-400" />
                          {u.gender || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                          <MapPin size={12} className="text-gray-400" />
                          {u.city || "Not Set"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {renderChannels(u.preferences?.offers)}
                      </td>
                      <td className="px-6 py-4">
                        {renderChannels(u.preferences?.order_updates)}
                      </td>
                      <td className="px-6 py-4">
                        {renderChannels(u.preferences?.newsletter)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;
