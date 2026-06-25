import Button from "../../../components/ui/Button";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

function OrderCart({
  items = [],
  totalQuantity = 0,
  total = 0,
  onIncrease,
  onDecrease,
  onRemove,
  onContinue,
  embedded = false,
  showHeader = true,
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={
        embedded
          ? "bg-white"
          : `
              overflow-hidden rounded-2xl
              border border-gray-200 bg-white shadow-sm
            `
      }
    >
      {showHeader && (
        <header
          className="
            flex items-center justify-between gap-4
            border-b border-gray-200 px-4 py-4
            sm:px-5
          "
        >
          <div>
            <h2 className="font-semibold text-gray-900">
              Pedido actual
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {totalQuantity} unidades agregadas
            </p>
          </div>

          <p className="shrink-0 font-bold text-[#6F4E37]">
            {currencyFormatter.format(total)}
          </p>
        </header>
      )}

      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <article
            key={item.cartItemKey}
            className="space-y-4 px-4 py-4 sm:px-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-gray-900">
                  {item.name}
                </p>

                {item.variantName && (
                  <p className="mt-1 text-sm text-gray-500">
                    Tamaño: {item.variantName}
                  </p>
                )}

                {item.notes && (
                  <p className="mt-1 break-words text-sm text-gray-500">
                    Nota: {item.notes}
                  </p>
                )}
              </div>

              <p className="shrink-0 font-semibold text-gray-900">
                {currencyFormatter.format(item.subtotal)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div
                className="
                  inline-flex items-center overflow-hidden
                  rounded-xl border border-gray-300
                "
              >
                <button
                  type="button"
                  onClick={() => onDecrease(item.cartItemKey)}
                  disabled={item.quantity <= 1}
                  aria-label={`Disminuir cantidad de ${item.name}`}
                  className="
                    flex h-10 w-10 items-center justify-center
                    text-lg text-gray-700 transition
                    hover:bg-gray-100
                    disabled:cursor-not-allowed
                    disabled:text-gray-300
                  "
                >
                  −
                </button>

                <span
                  className="
                    flex h-10 min-w-10 items-center
                    justify-center border-x border-gray-300
                    px-2 text-sm font-semibold text-gray-900
                  "
                >
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => onIncrease(item.cartItemKey)}
                  aria-label={`Aumentar cantidad de ${item.name}`}
                  className="
                    flex h-10 w-10 items-center justify-center
                    text-lg text-gray-700 transition
                    hover:bg-gray-100
                  "
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.cartItemKey)}
                className="
                  rounded-lg px-3 py-2
                  text-sm font-medium text-red-600
                  transition hover:bg-red-50
                "
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>

      {!showHeader && (
        <footer
          className="
            flex items-center justify-between
            border-t border-gray-200 px-4 py-4
          "
        >
          <div>
            <p className="text-sm text-gray-500">
              {totalQuantity} unidades
            </p>

            <p className="font-semibold text-gray-900">
              Total
            </p>
          </div>

          <p className="text-lg font-bold text-[#6F4E37]">
            {currencyFormatter.format(total)}
          </p>


        </footer>

      )}
        <Button
          className="w-full"
          onClick={onContinue}>
          Continuar
        </Button>
    </section>
  );
}

export default OrderCart;