import { useState } from "react";

import BottomSheet from "../../../components/ui/BottomSheet";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

function createInitialFormData(user) {
  if (!user) {
    return {
      name: "",
      email: "",
      role: "CAJERO",
      isActive: true,
    };
  }

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    role: user.role ?? "CAJERO",
    isActive: user.isActive ?? true,
  };
}

function UserFormSheet({
  isOpen,
  onClose,
  onSubmit,
  user = null,
  mode = "create",
  userRoles,
}) {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(user),
  );

  const isEditMode = mode === "edit";

  const roleOptions = Object.values(userRoles).map((role) => ({
    value: role.value,
    label: role.label,
  }));

  const isValidEmail =
    formData.email.trim() !== "" &&
    formData.email.includes("@");

  const canSubmit =
    formData.name.trim() !== "" &&
    isValidEmail &&
    formData.role !== "";

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
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      isActive: formData.isActive,
    });
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Editar usuario" : "Nuevo usuario"}
      footer={
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button disabled={!canSubmit} onClick={handleSubmit}>
            {isEditMode ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Input
          id="user-name"
          label="Nombre"
          placeholder="Ej. Juan Pérez"
          value={formData.name}
          onChange={(event) =>
            updateField("name", event.target.value)
          }
        />

        <Input
          id="user-email"
          label="Correo"
          type="email"
          placeholder="Ej. usuario@lrpos.com"
          value={formData.email}
          onChange={(event) =>
            updateField("email", event.target.value)
          }
          helperText="Más adelante este correo podrá usarse para el inicio de sesión."
        />

        <Select
          id="user-role"
          label="Rol"
          options={roleOptions}
          value={formData.role}
          onChange={(event) =>
            updateField("role", event.target.value)
          }
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
              Usuario activo
            </span>

            <span className="block text-sm text-gray-500">
              Si está activo, podrá operar dentro del sistema.
            </span>
          </span>
        </label>
      </div>
    </BottomSheet>
  );
}

export default UserFormSheet;