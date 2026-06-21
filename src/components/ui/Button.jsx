function Button({ children, onClick }) {
  return (
    <button className="bg-[#6F4E37] text-white px-4 py-2 rounded-lg cursor-pointer"  onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;