import { useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Inicio",
  "/orders": "Pedidos",
  "/kitchen": "Cocina",
  "/deliveries": "Entregas",
  "/payments": "Cobros Delivery",
  "/products": "Productos",
  "/categories": "Categorías",
  "/clients": "Clientes",
  "/users": "Usuarios",
  "/reports": "Reportes",
  "/settings": "Configuración",
  "/more": "Más",
};

function DesktopTopbar() {
  const { pathname } = useLocation();

  const pageTitle = pageTitles[pathname] ?? "LR POS";

  return (
    <header
      className="
        sticky top-0 z-40
        hidden h-16 items-center justify-between
        border-b border-gray-200 bg-white
        px-6 lg:flex
      "
    >
      <h1 className="text-xl font-semibold text-gray-900">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            Admin
          </p>

          <p className="text-xs text-gray-500">
            Administrador
          </p>
        </div>

        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full bg-[#6F4E37]/10
            font-semibold text-[#6F4E37]
          "
        >
          A
        </div>
      </div>
    </header>
  );
}

export default DesktopTopbar;