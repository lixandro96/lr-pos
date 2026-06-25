import { NavLink } from "react-router-dom";

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </svg>
  );
}

function DeliveriesIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

function PaymentsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <rect x="4" y="4" width="5" height="5" rx="1" />
      <rect x="15" y="4" width="5" height="5" rx="1" />
      <rect x="4" y="15" width="5" height="5" rx="1" />
      <rect x="15" y="15" width="5" height="5" rx="1" />
    </svg>
  );
}

const navigationItems = [
  {
    to: "/",
    label: "Inicio",
    end: true,
    icon: <HomeIcon />,
  },
  {
    to: "/orders",
    label: "Pedidos",
    icon: <OrdersIcon />,
  },
  {
    to: "/deliveries",
    label: "Entregas",
    icon: <DeliveriesIcon />,
  },
  {
    to: "/payments",
    label: "Cobros",
    icon: <PaymentsIcon />,
  },
  {
    to: "/more",
    label: "Más",
    icon: <MoreIcon />,
  },
];

function BottomNavigation() {
  return (
    <nav
      aria-label="Navegación principal móvil"
      className="
        fixed inset-x-0 bottom-0 z-50
        border-t border-gray-200
        bg-white/95
        shadow-[0_-6px_20px_rgba(0,0,0,0.08)]
        backdrop-blur-md
        lg:hidden
      "
    >
      <div
        className="
          mx-auto grid max-w-xl grid-cols-5
          px-1
          pb-[env(safe-area-inset-bottom)]
        "
      >
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `
              relative flex min-h-[4.5rem]
              min-w-0 flex-col items-center
              justify-center gap-1
              rounded-xl px-1 py-2
              text-xs font-medium
              transition-colors duration-200
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#6F4E37]/30
              ${
                isActive
                  ? `
                      bg-[#6F4E37]/5
                      text-[#6F4E37]
                      before:absolute
                      before:top-0
                      before:h-0.5
                      before:w-8
                      before:rounded-full
                      before:bg-[#6F4E37]
                    `
                  : `
                      text-gray-500
                      hover:bg-gray-50
                      hover:text-gray-800
                    `
              }
            `}
          >
            <span
              className="
                flex h-7 items-center
                justify-center
              "
            >
              {item.icon}
            </span>

            <span className="max-w-full truncate leading-none">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNavigation;

