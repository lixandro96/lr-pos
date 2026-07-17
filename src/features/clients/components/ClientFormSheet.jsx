import { useState } from "react";

import BottomSheet from "../../../components/ui/BottomSheet";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import TextArea from "../../../components/ui/TextArea";

function createInitialFormData(client) {
  if (!client) {
    return {
      name: "",
      phone: "",
      address: "",
      isActive: true,
    };
  }

  return {
    name: client.name ?? "",
    phone: client.phone ?? "",
    address: client.address ?? "",
    isActive: client.isActive ?? true,
  };
}

function ClientFormSheet({
  isOpen,
  onClose,
  onSubmit,
  client = null,
  mode = "create",
}) {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(client),
  );

  const isEditMode = mode === "edit";

  const canSubmit =
    formData.name.trim() !== "" &&
    formData.phone.trim() !== "";

  function updateField(field, value) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      isActive: formData.isActive,
    });
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Editar cliente" : "Nuevo cliente"}
      footer={
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button disabled={!canSubmit} onClick={handleSubmit}>
            {isEditMode ? "Guardar cambios" : "Crear cliente"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Input
          id="client-name"
          label="Nombre del cliente"
          placeholder="Ej. Ana Pérez"
          value={formData.name}
          onChange={(event) =>
            updateField("name", event.target.value)
          }
        />

        <Input
          id="client-phone"
          label="Teléfono"
          placeholder="Ej. 809-555-0101"
          value={formData.phone}
          onChange={(event) =>
            updateField("phone", event.target.value)
          }
        />

        <TextArea
          id="client-address"
          label="Dirección"
          placeholder="Ej. Calle Duarte #25, Santo Domingo"
          value={formData.address}
          onChange={(event) =>
            updateField("address", event.target.value)
          }
          rows={3}
        />

        <label
          className="
            flex items-center gap-3
            rounded-xl border border-gray-200
            bg-gray-50 p-4
          "
        >
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(event) =>
              updateField("isActive", event.target.checked)
            }
            className="h-4 w-4 rounded border-gray-300"
          />

          <span>
            <span className="block font-medium text-gray-900">
              Cliente activo
            </span>

            <span className="block text-sm text-gray-500">
              Si está activo, aparecerá en el checkout de delivery.
            </span>
          </span>
        </label>
      </div>
    </BottomSheet>
  );
}

export default ClientFormSheet;