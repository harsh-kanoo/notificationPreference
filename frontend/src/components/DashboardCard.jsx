import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const DashboardCard = ({ title, description, path, icon: Icon }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="group cursor-pointer bg-white p-6 rounded-sm shadow-sm hover:shadow-md transition-all border border-gray-100 flex justify-between items-start"
    >
      <div>
        <div className="flex items-center gap-3 mb-3">
          {Icon && <Icon size={20} className="text-[#FC2779]" />}
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">
            {title}
          </h3>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed max-w-50">
          {description}
        </p>
      </div>
      <div className="bg-gray-50 p-2 rounded-full group-hover:bg-pink-50 transition-colors">
        <ArrowRight
          size={16}
          className="text-gray-400 group-hover:text-[#FC2779]"
        />
      </div>
    </div>
  );
};

export default DashboardCard;
