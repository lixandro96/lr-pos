function Badge({ status }) {
  let styles = "";
  let text = "";

  if (status === "PENDIENTE") {
    styles = "bg-yellow-100 text-yellow-800";
    text = "Pendiente";
  }

  if (status === "EN_PREPARACION") {
    styles = "bg-blue-100 text-blue-800";
    text = "Preparando";
  }

  if (status === "LISTO") {
    styles = "bg-green-100 text-green-800";
    text = "Listo";
  }

  if (status === "DESPACHADO") {
    styles = "bg-gray-300 text-gray-800";
    text = "Despachado";
  }

  if (status === "CANCELADO") {
    styles = "bg-red-100 text-red-800";
    text = "Cancelado";
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles}`}
    >
      {text}
    </span>
  );
}

export default Badge;