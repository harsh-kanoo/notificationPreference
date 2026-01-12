import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (token == null) navigate("/login");

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("http://localhost:8080/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);
      if (data) setUsers(data.users);
      else navigate("/login");
    };

    fetchUsers();
  }, []);

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
