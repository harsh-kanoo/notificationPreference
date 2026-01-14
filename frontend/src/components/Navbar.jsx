import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Search, Bell, User, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link
          to={user?.role === "CUSTOMER" ? "/userDashboard" : ""}
          className="text-2xl font-black text-nykaa tracking-tighter uppercase"
        >
          NYKAA
          <span className="text-gray-900 ml-1">
            {user?.role === "CUSTOMER" ? "SHOP" : user?.role}
          </span>
        </Link>

        <div className="flex items-center gap-5 text-gray-700">
          {user?.role === "CUSTOMER" && (
            <Link
              to="/notifications"
              className="relative hover:text-nykaa transition-colors"
            >
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 bg-nykaa text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                !
              </span>
            </Link>
          )}

          <div className="flex items-center gap-3 ml-2 border-l pl-5 border-gray-200">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-gray-400 leading-none">
                {user?.role || "Guest"}
              </span>
              <span className="text-xs font-medium text-gray-700 truncate max-w-25">
                {user?.email?.split("@")[0]}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-red-600 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
