const Button = ({ children, ...props }) => {
  return (
    <button
      className="w-full bg-[#FC2779] hover:bg-[#E91E63] text-white py-2 rounded-md font-semibold transition"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
