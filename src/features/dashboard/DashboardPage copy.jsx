import { useState } from "react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import SearchInput from "../../components/ui/SearchInput";
import TextArea from "../../components/ui/TextArea";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import BottomSheet from "../../components/ui/BottomSheet";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Toast from "../../components/ui/Toast";

const orderTypeOptions = [
  {
    value: "MOSTRADOR",
    label: "Mostrador",
  },
  {
    value: "DELIVERY",
    label: "Delivery",
  },
];

function DashboardPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState("");
  const [orderType, setOrderType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);  
  const [toast, setToast] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  function showToast(type, title, message) {
  setToast({
    isOpen: true,
    type,
    title,
    message,
  });
}

  function closeToast() {
    setToast((currentToast) => ({
      ...currentToast,
      isOpen: false,
    }));
  }

  function CrearPedido(){
    alert("Crear Pedido");
  }


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        Dashboard
      </h1>
        {/* Toast Notification */}
        
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() =>
            showToast(
              "success",
              "Pedido creado",
              "El pedido fue enviado correctamente a cocina.",
            )
          }
        >
          Probar éxito
        </Button>

        <Button
          onClick={() =>
            showToast(
              "error",
              "No se pudo guardar",
              "Ocurrió un error al procesar la operación.",
            )
          }
        >
          Probar error
        </Button>

        <Button
          onClick={() =>
            showToast(
              "warning",
              "Atención",
              "El pedido todavía tiene un cobro pendiente.",
            )
          }
        >
          Probar advertencia
        </Button>

        <Button
          onClick={() =>
            showToast(
              "info",
              "Información",
              "El pedido está siendo preparado.",
            )
          }
        >
          Probar información
        </Button>


        <Toast
          isOpen={toast.isOpen}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={closeToast}
        />
      </div>

                                                      {/* Empty State */}
      <EmptyState
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-7 w-7"
          >
            <path d="M6 2h9l3 3v17H6z" />
            <path d="M9 10h6" />
            <path d="M9 14h6" />
          </svg>
        }
        title="No hay pedidos pendientes"
        description="Cuando se cree un nuevo pedido, aparecerá en esta sección."
        action={
          <Button onClick={() => alert("Crear pedido")}>
            Nuevo pedido
          </Button>
        }
      />

                                                    {/* Loader */}
      <div className="space-y-6">
        <Loader />

        <Loader
          size="sm"
          label="Guardando..."
        />

        <Loader
          size="lg"
          label="Cargando pedidos..."
        />
      </div>


                                                        {/* Bottom Sheet */}
      <Button onClick={() => setIsBottomSheetOpen(true)}>
        Abrir Bottom Sheet
      </Button>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="Agregar Cappuccino"
        footer={
          <Button
            className="w-full"
            onClick={() => {
              alert("Producto agregado");
              setIsBottomSheetOpen(false);
            }}
          >
            Agregar al pedido
          </Button>
        }
      >
        <div className="space-y-4">
          <Select
            id="product-size"
            label="Tamaño"
            options={[
              { value: "SMALL", label: "Pequeño" },
              { value: "MEDIUM", label: "Mediano" },
              { value: "LARGE", label: "Grande" },
            ]}
          />

          <Input
            id="product-quantity"
            label="Cantidad"
            type="number"
            min="1"
            defaultValue="1"
          />

          <TextArea
            id="product-notes"
            label="Observaciones"
            placeholder="Ejemplo: sin azúcar"
            helperText="Esta nota será visible para cocina."
          />
        </div>
      </BottomSheet>

                                              {/* Form Inputs */}

      <div className="space-y-4">
        <Input
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
        />

        <Input
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Escribe tu contraseña"
          error="La contraseña es obligatoria"
        />
      </div>

                                                     {/* Button */}
      <Button onClick={CrearPedido}>
        Nuevo Pedido
      </Button>

      <div className="flex flex-wrap gap-2">
        <Badge status="PENDIENTE" />
        <Badge status="EN_PREPARACION" />
        <Badge status="LISTO" />
        <Badge status="DESPACHADO" />
        <Badge status="CANCELADO" />
      </div>


                                                 { /* Search Input */}

      <SearchInput
        id="component-search"
        label="Buscar"
        placeholder="Buscar productos o pedidos"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onClear={() => setSearchTerm("")}
      />

      <p className="text-sm text-gray-600">
        Búsqueda actual: {searchTerm || "Ninguna"}
      </p>

                                                       {/* TextArea */}

      <TextArea
        id="order-notes"
        label="Observaciones para cocina"
        placeholder="Ejemplo: sin cebolla, poco azúcar..."
        helperText={`${notes.length}/200 caracteres`}
        maxLength={200}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />


      <TextArea
        id="required-notes"
        label="Motivo de cancelación"
        placeholder="Explica por qué se canceló el pedido"
        error="El motivo de cancelación es obligatorio."
      />

                                                    { /* Select */}

      <Select
        id="order-type"
        name="orderType"
        label="Tipo de pedido"
        placeholder="Selecciona el tipo de pedido"
        options={orderTypeOptions}
        value={orderType}
        onChange={(event) => setOrderType(event.target.value)}
        helperText="Indica cómo será entregado el pedido."
      />

      <p className="text-sm text-gray-600">
        Tipo seleccionado: {orderType || "Ninguno"}
      </p>


      <Select
        id="user-role"
        label="Rol del usuario"
        placeholder="Selecciona un rol"
        options={[
          { value: "ADMIN", label: "Administrador" },
          { value: "CASHIER", label: "Cajero" },
          { value: "KITCHEN", label: "Cocina" },
        ]}
        value=""
        onChange={() => {}}
        error="Debes seleccionar un rol."
      />

                                                    { /* Modal*/}

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="
          rounded-xl bg-[#6F4E37]
          px-4 py-3 font-medium text-white
          transition hover:bg-[#5D4030]
        "
      >
        Abrir modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cancelar pedido"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="
                rounded-xl border border-gray-300
                px-4 py-2.5 font-medium text-gray-700
                transition hover:bg-gray-50
              "
            >
              Volver
            </button>

            <button
              type="button"
              onClick={() => {
                alert("Pedido cancelado");
                setIsModalOpen(false);
              }}
              className="
                rounded-xl bg-red-600
                px-4 py-2.5 font-medium text-white
                transition hover:bg-red-700
              "
            >
              Cancelar pedido
            </button>
          </>
        }
      >
        <p className="text-sm leading-6 text-gray-600">
          Esta acción cambiará el estado del pedido a cancelado.
          ¿Deseas continuar?
        </p>
      </Modal>


    </div>
    
  );
}

export default DashboardPage;