const Input = ({ label, type = "text", ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        required
        type={type}
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        {...props}
      />
    </div>
  );
};

export default Input;
