import { useState } from "react";

import BottomSheet from "../../../components/ui/BottomSheet";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import TextArea from "../../../components/ui/TextArea";

function createInitialFormData(category) {
  if (!category) {
    return {
      name: "",
      description: "",
      isActive: true,
    };
  }

  return {
    name: category.name ?? "",
    description: category.description ?? "",
    isActive: category.isActive ?? true,
  };
}

function CategoryFormSheet({
  isOpen,
  onClose,
  onSubmit,
  category = null,
  mode = "create",
}) {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(category),
  );

  const isEditMode = mode === "edit";

  const canSubmit = formData.name.trim() !== "";

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
      description: formData.description.trim(),
      isActive: formData.isActive,
    });
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditMode
          ? "Editar categoría"
          : "Nueva categoría"
      }
      footer={
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isEditMode
              ? "Guardar cambios"
              : "Crear categoría"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Input
          id="category-name"
          label="Nombre de la categoría"
          placeholder="Ej. Desayunos"
          value={formData.name}
          onChange={(event) =>
            updateField("name", event.target.value)
          }
        />

        <TextArea
          id="category-description"
          label="Descripción"
          placeholder="Describe brevemente esta categoría..."
          value={formData.description}
          onChange={(event) =>
            updateField("description", event.target.value)
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
              updateField(
                "isActive",
                event.target.checked,
              )
            }
            className="h-4 w-4 rounded border-gray-300"
          />

          <span>
            <span className="block font-medium text-gray-900">
              Categoría activa
            </span>

            <span className="block text-sm text-gray-500">
              Si está activa, podrá usarse en productos y filtros.
            </span>
          </span>
        </label>
      </div>
    </BottomSheet>
  );
}

export default CategoryFormSheet;