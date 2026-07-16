import BottomSheet from "../../../components/ui/BottomSheet";
import Button from "../../../components/ui/Button";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

function ProductDetailsSheet({
  isOpen,
  onClose,
  product,
  categoryName,
  onToggleStatus,
  onEdit,
}) {
  if (!product) {
    return null;
  }

  const activeVariants =
    product.variants?.filter((variant) => variant.isActive) ??
    [];

  const inactiveVariants =
    product.variants?.filter((variant) => !variant.isActive) ??
    [];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del producto"
      footer={
        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cerrar
          </Button>

          <Button
            variant="secondary"
            onClick={() => onEdit(product)}
          >
            Editar
          </Button>

          <Button
            onClick={() => onToggleStatus(product)}
          >
            {product.isActive
              ? "Desactivar"
              : "Activar"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              {product.name}
            </h2>

            <span
              className={`
                rounded-full px-2.5 py-1
                text-xs font-semibold
                ${
                  product.isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }
              `}
            >
              {product.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            {categoryName}
          </p>
        </div>

        <div
          className="
            rounded-2xl border border-gray-200
            bg-gray-50 p-4
          "
        >
          <p className="text-sm font-medium text-gray-500">
            Precio base
          </p>

          <p className="mt-1 text-2xl font-bold text-[#6F4E37]">
            {currencyFormatter.format(product.basePrice)}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Descripción
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {product.description || "Sin descripción."}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Variantes activas
          </h3>

          {activeVariants.length > 0 ? (
            <div className="mt-3 space-y-2">
              {activeVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="
                    flex items-center justify-between
                    rounded-xl border border-gray-200
                    bg-white px-4 py-3
                  "
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {variant.name}
                    </p>

                    {variant.isDefault && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        Variante principal
                      </p>
                    )}
                  </div>

                  <p className="font-bold text-[#6F4E37]">
                    {currencyFormatter.format(variant.price)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              Este producto no tiene variantes activas.
            </p>
          )}
        </div>

        {inactiveVariants.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900">
              Variantes inactivas
            </h3>

            <div className="mt-3 space-y-2">
              {inactiveVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="
                    flex items-center justify-between
                    rounded-xl border border-gray-200
                    bg-gray-50 px-4 py-3
                  "
                >
                  <p className="font-medium text-gray-500">
                    {variant.name}
                  </p>

                  <p className="font-semibold text-gray-500">
                    {currencyFormatter.format(variant.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

export default ProductDetailsSheet;