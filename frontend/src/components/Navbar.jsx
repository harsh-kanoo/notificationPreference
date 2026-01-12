import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-[#FC2779]">Nykaa Admin</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600 text-sm">{user?.email}</span>

        <button
          onClick={handleLogout}
          className="text-sm bg-[#FC2779] text-white px-4 py-1 rounded hover:bg-[#E91E63]"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
