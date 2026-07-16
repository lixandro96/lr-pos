const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

function getLowestVariantPrice(product) {
  const activeVariants =
    product.variants?.filter((variant) => variant.isActive) ??
    [];

  if (activeVariants.length === 0) {
    return product.basePrice;
  }

  return Math.min(
    ...activeVariants.map((variant) => variant.price),
  );
}

function ProductAdminCard({
  product,
  categoryName,
  onClick,
}) {
  const lowestPrice = getLowestVariantPrice(product);

  return (
    <button
      type="button"
      onClick={() => onClick(product.id)}
      className="
        rounded-2xl border border-gray-200
        bg-white p-3 text-left shadow-sm
        transition hover:-translate-y-0.5
        hover:border-[#6F4E37]/30
        hover:shadow-md
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#6F4E37]/30
        sm:p-4
      "
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-gray-900 sm:text-base">
            {product.name}
          </h2>

          <p className="mt-1 truncate text-xs text-gray-500">
            {categoryName}
          </p>
        </div>

        <span
          className={`
            shrink-0 rounded-full px-2 py-0.5
            text-[0.65rem] font-semibold
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

      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Desde
        </p>

        <p className="text-base font-bold text-[#6F4E37] sm:text-lg">
          {currencyFormatter.format(lowestPrice)}
        </p>
      </div>
    </button>
  );
}

export default ProductAdminCard;