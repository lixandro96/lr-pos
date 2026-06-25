import { useState } from "react";

import BottomSheet from "../../../components/ui/BottomSheet";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import TextArea from "../../../components/ui/TextArea";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

function getDefaultVariantId(product) {
  const activeVariants = (product?.variants ?? []).filter(
    (variant) => variant.isActive,
  );

  const defaultVariant =
    activeVariants.find((variant) => variant.isDefault) ??
    activeVariants[0];

  return defaultVariant?.id ?? "";
}

function ProductOptionsSheet({
  isOpen,
  product,
  onClose,
  onAdd,
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => getDefaultVariantId(product),
  );

  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");

  if (!product) {
    return null;
  }

  const activeVariants = (product.variants ?? []).filter(
    (variant) => variant.isActive,
  );

  const hasVariants = activeVariants.length > 0;

  const selectedVariant =
    activeVariants.find(
      (variant) => variant.id === selectedVariantId,
    ) ?? null;

  const unitPrice =
    selectedVariant?.price ?? product.basePrice;

  const normalizedQuantity = Math.max(
    1,
    Number(quantity) || 1,
  );

  const subtotal = unitPrice * normalizedQuantity;

  const variantOptions = activeVariants.map((variant) => ({
    value: variant.id,
    label: `${variant.name} — ${currencyFormatter.format(
      variant.price,
    )}`,
  }));

  function handleAddProduct() {
    if (hasVariants && !selectedVariant) {
      return;
    }

    onAdd({
      productId: product.id,
      name: product.name,
      variantId: selectedVariant?.id ?? null,
      variantName: selectedVariant?.name ?? null,
      quantity: normalizedQuantity,
      unitPrice,
      subtotal,
      notes: notes.trim(),
    });

    onClose();
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      footer={
        <Button
          className="w-full"
          disabled={hasVariants && !selectedVariant}
          onClick={handleAddProduct}
        >
          Agregar · {currencyFormatter.format(subtotal)}
        </Button>
      }
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm leading-6 text-gray-600">
            {product.description}
          </p>
        </div>

        {hasVariants && (
          <Select
            id="product-variant"
            label="Tamaño"
            placeholder="Selecciona un tamaño"
            options={variantOptions}
            value={selectedVariantId}
            onChange={(event) =>
              setSelectedVariantId(event.target.value)
            }
          />
        )}

        <Input
          id="product-quantity"
          label="Cantidad"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) =>
            setQuantity(event.target.value)
          }
        />

        <TextArea
          id="product-notes"
          label="Observaciones para cocina"
          placeholder="Ejemplo: sin azúcar, poca leche..."
          helperText={`${notes.length}/200 caracteres`}
          maxLength={200}
          rows={3}
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
        />

        <div
          className="
            flex items-center justify-between
            rounded-xl bg-gray-50 p-4
          "
        >
          <span className="text-sm text-gray-600">
            Subtotal
          </span>

          <span className="font-bold text-[#6F4E37]">
            {currencyFormatter.format(subtotal)}
          </span>
        </div>
      </div>
    </BottomSheet>
  );
}

export default ProductOptionsSheet;