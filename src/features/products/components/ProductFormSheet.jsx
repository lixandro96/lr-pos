import { useState } from "react";

import BottomSheet from "../../../components/ui/BottomSheet";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import TextArea from "../../../components/ui/TextArea";

function createLocalVariantId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return `local-variant-${crypto.randomUUID()}`;
  }

  return `local-variant-${Date.now()}-${Math.random()}`;
}

function createEmptyVariant({
  name = "",
  price = "",
  isDefault = false,
} = {}) {
  return {
    localId: createLocalVariantId(),
    name,
    price,
    isDefault,
    isActive: true,
  };
}

function ProductFormSheet({
  isOpen,
  onClose,
  categories = [],
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    isActive: true,
    variants: [
      createEmptyVariant({
        name: "Regular",
        price: "",
        isDefault: true,
      }),
    ],
  });

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const hasValidProductInfo =
    formData.name.trim() !== "" &&
    formData.categoryId !== "";

  const hasValidVariants =
    formData.variants.length > 0 &&
    formData.variants.every((variant) => {
      const price = Number(variant.price);

      return (
        variant.name.trim() !== "" &&
        Number.isFinite(price) &&
        price > 0
      );
    });

  const hasDefaultVariant = formData.variants.some(
    (variant) => variant.isDefault,
  );

  const canSubmit =
    hasValidProductInfo &&
    hasValidVariants &&
    hasDefaultVariant;

  function updateField(field, value) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function updateVariant(localId, field, value) {
    setFormData((currentData) => ({
      ...currentData,
      variants: currentData.variants.map((variant) => {
        if (variant.localId !== localId) {
          return variant;
        }

        return {
          ...variant,
          [field]: value,
        };
      }),
    }));
  }

  function handleAddVariant() {
    setFormData((currentData) => ({
      ...currentData,
      variants: [
        ...currentData.variants,
        createEmptyVariant(),
      ],
    }));
  }

  function handleRemoveVariant(localId) {
    setFormData((currentData) => {
      if (currentData.variants.length === 1) {
        return currentData;
      }

      const removedVariant =
        currentData.variants.find(
          (variant) => variant.localId === localId,
        );

      const remainingVariants =
        currentData.variants.filter(
          (variant) => variant.localId !== localId,
        );

      const shouldAssignNewDefault =
        removedVariant?.isDefault &&
        !remainingVariants.some(
          (variant) => variant.isDefault,
        );

      return {
        ...currentData,
        variants: shouldAssignNewDefault
          ? remainingVariants.map((variant, index) => ({
              ...variant,
              isDefault: index === 0,
            }))
          : remainingVariants,
      };
    });
  }

  function handleSetDefaultVariant(localId) {
    setFormData((currentData) => ({
      ...currentData,
      variants: currentData.variants.map((variant) => ({
        ...variant,
        isDefault: variant.localId === localId,
      })),
    }));
  }

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    const normalizedVariants = formData.variants.map(
      (variant) => ({
        name: variant.name.trim(),
        price: Number(variant.price),
        isDefault: variant.isDefault,
        isActive: variant.isActive,
      }),
    );

    const defaultVariant =
      normalizedVariants.find(
        (variant) => variant.isDefault,
      ) ?? normalizedVariants[0];

    onSubmit({
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      description: formData.description.trim(),
      basePrice: defaultVariant.price,
      imageUrl: null,
      isActive: formData.isActive,
      variants: normalizedVariants,
    });
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo producto"
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
            Crear producto
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Input
          id="product-name"
          label="Nombre del producto"
          placeholder="Ej. Café mocha"
          value={formData.name}
          onChange={(event) =>
            updateField("name", event.target.value)
          }
        />

        <Select
          id="product-category"
          label="Categoría"
          placeholder="Selecciona una categoría"
          options={categoryOptions}
          value={formData.categoryId}
          onChange={(event) =>
            updateField("categoryId", event.target.value)
          }
        />

        <TextArea
          id="product-description"
          label="Descripción"
          placeholder="Describe brevemente el producto..."
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
              Producto activo
            </span>

            <span className="block text-sm text-gray-500">
              Si está activo, aparecerá en la pantalla de
              pedidos.
            </span>
          </span>
        </label>

        <section className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                Variantes
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Agrega los tamaños, presentaciones o precios
                disponibles para este producto.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={handleAddVariant}
            >
              Agregar
            </Button>
          </div>

          <div className="space-y-3">
            {formData.variants.map((variant, index) => (
              <div
                key={variant.localId}
                className="
                  rounded-2xl border border-gray-200
                  bg-white p-4
                "
              >
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
                  <Input
                    id={`variant-name-${variant.localId}`}
                    label={`Variante ${index + 1}`}
                    placeholder="Ej. Pequeño, Mediano, Grande"
                    value={variant.name}
                    onChange={(event) =>
                      updateVariant(
                        variant.localId,
                        "name",
                        event.target.value,
                      )
                    }
                  />

                  <Input
                    id={`variant-price-${variant.localId}`}
                    label="Precio"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="150"
                    value={variant.price}
                    onChange={(event) =>
                      updateVariant(
                        variant.localId,
                        "price",
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div
                  className="
                    mt-4 flex flex-col gap-3
                    sm:flex-row sm:items-center
                    sm:justify-between
                  "
                >
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="default-product-variant"
                      checked={variant.isDefault}
                      onChange={() =>
                        handleSetDefaultVariant(
                          variant.localId,
                        )
                      }
                      className="h-4 w-4 border-gray-300"
                    />

                    Variante principal
                  </label>

                  <button
                    type="button"
                    disabled={
                      formData.variants.length === 1
                    }
                    onClick={() =>
                      handleRemoveVariant(
                        variant.localId,
                      )
                    }
                    className="
                      text-left text-sm font-semibold
                      text-red-600
                      disabled:cursor-not-allowed
                      disabled:text-gray-300
                    "
                  >
                    Eliminar variante
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!hasValidVariants && (
            <p className="text-sm text-amber-700">
              Cada variante debe tener nombre y precio mayor a
              cero.
            </p>
          )}
        </section>
      </div>
    </BottomSheet>
  );
}

export default ProductFormSheet;