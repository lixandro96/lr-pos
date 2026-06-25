const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

function getStartingPrice(product) {
  const activeVariantPrices = (product.variants ?? [])
    .filter((variant) => variant.isActive)
    .map((variant) => variant.price);

  if (activeVariantPrices.length > 0) {
    return Math.min(...activeVariantPrices);
  }

  return product.basePrice;
}

function ProductCard({ product, onSelect }) {
  const activeVariants = (product.variants ?? []).filter(
    (variant) => variant.isActive,
  );

  const hasVariants = activeVariants.length > 0;
  const startingPrice = getStartingPrice(product);

  function handleSelect() {
    if (!product.isActive) {
      return;
    }

    onSelect?.(product);
  }

  return (
    <button
      type="button"
      onClick={handleSelect}
      disabled={!product.isActive}
      aria-label={`Seleccionar ${product.name}`}
      className="
        group overflow-hidden rounded-2xl
        border border-gray-200 bg-white
        text-left shadow-sm transition
        hover:-translate-y-0.5 hover:border-[#6F4E37]/30
        hover:shadow-md
        focus:outline-none focus:ring-2
        focus:ring-[#6F4E37]/30
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      <div
        className="
          relative flex aspect-[4/3]
          items-center justify-center
          overflow-hidden bg-[#F4ECE7]
        "
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt=""
            className="
              h-full w-full object-cover
              transition duration-300
              group-hover:scale-105
            "
          />
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-12 w-12 text-[#6F4E37]/50"
          >
            <path d="M4 8h13v6a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V8Z" />
            <path d="M17 10h1a3 3 0 0 1 0 6h-2" />
            <path d="M7 4v2M11 4v2M15 4v2" />
          </svg>
        )}

        {!product.isActive && (
          <span
            className="
              absolute inset-x-3 bottom-3
              rounded-full bg-gray-900/80
              px-3 py-1 text-center
              text-xs font-medium text-white
            "
          >
            No disponible
          </span>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h2
          className="
            min-h-12 text-sm font-semibold
            leading-5 text-gray-900
            sm:text-base
          "
        >
          {product.name}
        </h2>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            {hasVariants && (
              <p className="text-xs text-gray-500">
                Desde
              </p>
            )}

            <p className="font-bold text-[#6F4E37]">
              {currencyFormatter.format(startingPrice)}
            </p>
          </div>

          {hasVariants && (
            <span
              className="
                rounded-full bg-[#6F4E37]/10
                px-2 py-1 text-[9px]
                font-medium text-[#6F4E37] text-center
              "
            >
              {activeVariants.length} tamaños
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default ProductCard;