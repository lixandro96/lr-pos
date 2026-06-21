import { NavLink } from "react-router-dom";

const navigationSections = [
  {
    title: "Operaciones",
    items: [
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
        to: "/kitchen",
        label: "Cocina",
      },
      {
        to: "/deliveries",
        label: "Entregas",
      },
      {
        to: "/payments",
        label: "Cobros Delivery",
      },
    ],
  },
  {
    title: "Administración",
    items: [
      {
        to: "/products",
        label: "Productos",
      },
      {
        to: "/categories",
        label: "Categorías",
      },
      {
        to: "/clients",
        label: "Clientes",
      },
      {
        to: "/users",
        label: "Usuarios",
      },
      {
        to: "/reports",
        label: "Reportes",
      },
      {
        label: "Configuración",
        to: "/settings",
      },
    ],
  },
];

function SidebarItem({ item }) {
  if (item.disabled) {
    return (
      <div
        aria-disabled="true"
        className="
          flex min-h-11 cursor-not-allowed items-center
          justify-between rounded-xl px-3
          text-sm text-white/40
        "
      >
        <span>{item.label}</span>

        <span className="text-[10px] uppercase tracking-wide">
          Próximo
        </span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => `
        flex min-h-11 items-center rounded-xl
        px-3 text-sm font-medium transition-colors
        ${
          isActive
            ? "bg-white/15 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      {item.label}
    </NavLink>
  );
}

function DesktopSidebar() {
  return (
    <aside
      className="
        fixed inset-y-0 left-0 z-50
        hidden w-64 flex-col
        bg-[#3B281F] text-white
        lg:flex
      "
    >
      <div
        className="
          flex h-20 items-center
          border-b border-white/10 px-6
        "
      >
        <div>
          <p className="text-xl font-bold">
            LR POS
          </p>

          <p className="mt-0.5 text-xs text-white/60">
            Sistema de gestión
          </p>
        </div>
      </div>

      <nav
        aria-label="Navegación principal de escritorio"
        className="
          flex-1 space-y-6 overflow-y-auto
          px-4 py-6
          sidebar-scroll
        "
      >
        {navigationSections.map((section) => (
          <div key={section.title}>
            <p
              className="
                mb-2 px-3 text-xs font-semibold
                uppercase tracking-wider text-white/40
              "
            >
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarItem
                  key={item.to ?? item.label}
                  item={item}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div
        className="
          border-t border-white/10
          px-6 py-4 text-xs text-white/50
        "
      >
        LR POS · Versión de desarrollo
      </div>
    </aside>
  );
}

export default DesktopSidebar;