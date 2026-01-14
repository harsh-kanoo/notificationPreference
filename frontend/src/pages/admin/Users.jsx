import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  useEffect(() => {
    if (!token || user?.role !== "ADMIN") {
      logout();
      navigate("/");
    }
  }, [user, token]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(data);
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);

        if (error.response && error.response.status === 403) {
          alert("Access Denied: You are not an Admin.");
          navigate("/");
        } else if (error.response && error.response.status === 401) {
          navigate("/");
        }
      }
    };

    if (token) {
      fetchUsers();
    } else {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Users & Preferences</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Gender</th>
                <th className="p-2">Email</th>
                <th className="p-2">City</th>
                <th className="p-2">Offers</th>
                <th className="p-2">Order Updates</th>
                <th className="p-2">Newsletter</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.gender}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.city}</td>
                  <td className="p-2">{u.preferences.offers}</td>
                  <td className="p-2">{u.preferences.order_updates}</td>
                  <td className="p-2">{u.preferences.newsletter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;
