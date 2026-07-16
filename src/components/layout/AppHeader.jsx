import { useLocation } from "react-router-dom";

const pageMetaByPath = {
  "/": {
    title: "Inicio",
    description: "Resumen general del negocio",
  },
  "/orders": {
    title: "Pedidos",
    description: "Crea y confirma nuevos pedidos",
  },
  "/kitchen": {
    title: "Cocina",
    description: "Pedidos pendientes y en preparación",
  },
  "/deliveries": {
    title: "Entregas",
    description: "Pedidos listos para despachar",
  },
  "/payments": {
    title: "Cobros",
    description: "Pedidos pendientes de pago",
  },
  "/more": {
    title: "Más",
    description: "Opciones y administración",
  },
  "/products": {
    title: "Productos",
    description: "Gestiona el catálogo",
  },
  "/categories": {
    title: "Categorías",
    description: "Organiza tus productos",
  },
  "/clients": {
    title: "Clientes",
    description: "Información de clientes",
  },
  "/users": {
    title: "Usuarios",
    description: "Gestión del personal",
  },
  "/reports": {
    title: "Reportes",
    description: "Ventas, cobros y productos",
  },
  "/settings": {
    title: "Configuración",
    description: "Ajustes generales",
  },
};

function getPageMeta(pathname) {
  return (
    pageMetaByPath[pathname] ?? {
      title: "LR POS",
      description: "Gestión de pedidos y ventas",
    }
  );
}

function AppHeader() {
  const { pathname } = useLocation();
  const pageMeta = getPageMeta(pathname);

  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-gray-200/80
        bg-white/95
        shadow-sm
        backdrop-blur-md
        lg:hidden
      "
    >
      <div
        className="
          mx-auto flex min-h-[4.5rem]
          max-w-xl items-center justify-between
          gap-4 px-4
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-2xl bg-[#3B281F]
              text-sm font-bold text-white
              shadow-sm
            "
          >
            LR
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold text-gray-900">
              {pageMeta.title}
            </p>

            <p className="mt-0.5 truncate text-xs text-gray-500">
              {pageMeta.description}
            </p>
          </div>
        </div>

        <div
          className="
            flex shrink-0 items-center gap-1.5
            rounded-full bg-emerald-50
            px-3 py-1.5
            text-xs font-semibold
            text-emerald-700
          "
        >
          <span
            className="
              h-2 w-2 rounded-full
              bg-emerald-500
            "
          />

          Activo
        </div>
      </div>
    </header>
  );
}

export default AppHeader;