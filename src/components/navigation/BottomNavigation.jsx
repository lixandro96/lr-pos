import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    to: "/",
    label: "Inicio",
    end: true,
  },
  {
    to: "/orders",
    label: "Pedidos",
  },
  {
    to: "/deliveries",
    label: "Entregas",
  },
  {
    to: "/payments",
    label: "Cobros",
  },
  {
    to: "/more",
    label: "Más",
  },
];

function BottomNavigation() {
  return (
    <nav
      aria-label="Navegación principal móvil"
      className="
        fixed inset-x-0 bottom-0 z-50
        border-t border-gray-200 bg-white
        md:hidden
      "
    >
      <div
        className="
          grid grid-cols-5
          pb-[env(safe-area-inset-bottom)]
        "
      >
        {navigationItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `
              flex min-h-16 items-center justify-center
              px-1 text-center text-xs font-medium
              transition-colors
              ${
                isActive
                  ? "text-[#6F4E37]"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNavigation;