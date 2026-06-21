import { useState } from "react";
import Input from "../../components/ui/Input";

function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">
        Nuevo pedido
      </h1>

      <Input
        id="product-search"
        type="search"
        label="Buscar producto"
        placeholder="Escribe el nombre de un producto"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <p className="text-sm text-gray-600">
        Búsqueda actual: {searchTerm || "Ninguna"}
      </p>
    </div>
  );
}

export default OrdersPage;