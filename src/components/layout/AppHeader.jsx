function AppHeader() {
  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-gray-200
        bg-white
        lg:hidden
      "
    >
      <div className="flex h-16 items-center px-4">
        <p className="text-lg font-semibold text-[#6F4E37]">
          LR POS
        </p>
      </div>
    </header>
  );
}

export default AppHeader;