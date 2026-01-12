import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, description, path }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-[#FC2779]"
    >
      <h3 className="text-lg font-semibold text-[#FC2779] mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default DashboardCard;
