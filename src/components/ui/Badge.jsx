const badgeVariants = {
  PENDIENTE: {
    text: "Pendiente",
    styles: "bg-yellow-100 text-yellow-800",
  },

  EN_PREPARACION: {
    text: "Preparando",
    styles: "bg-blue-100 text-blue-800",
  },

  LISTO: {
    text: "Listo",
    styles: "bg-green-100 text-green-800",
  },

  DESPACHADO: {
    text: "Despachado",
    styles: "bg-gray-300 text-gray-900",
  },

  CANCELADO: {
    text: "Cancelado",
    styles: "bg-red-100 text-red-800",
  },
};

function Badge({ status }) {
  const variant = badgeVariants[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variant.styles}`}
    >
      {variant.text}
    </span>
  );
}

export default Badge;