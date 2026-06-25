import Badge from "../../../components/ui/Badge";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});
const orderTypeLabels = {
  MOSTRADOR: "Mostrador",
  DELIVERY: "Delivery",
};
function formatOrderTime(createdAt) {
  return new Intl.DateTimeFormat("es-DO", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

function RecentOrders({ orders = [] }) {
  return (
    <section
      className="
        overflow-hidden rounded-2xl
        border border-gray-200 bg-white shadow-sm
      "
    >
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="font-semibold text-gray-900">
          Pedidos recientes
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Últimos pedidos registrados durante el día.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-gray-500">
            Todavía no hay pedidos registrados.
          </p>
        </div>
      ) : (
        <>
          {/* Vista móvil */}
            <div className="space-y-3 bg-gray-50 p-3 md:hidden">
            {orders.map((order) => (
                <article
                key={order.id}
                className="
                    rounded-2xl border border-gray-200
                    bg-white p-4 shadow-sm
                "
                >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                        Pedido #{order.number}
                    </p>

                    <div
                        className="
                        mt-1 flex flex-wrap items-center
                        gap-x-2 gap-y-1 text-sm text-gray-500
                        "
                    >
                        <span>
                        {orderTypeLabels[order.type] ?? order.type}
                        </span>

                        <span aria-hidden="true">•</span>

                        <time dateTime={order.createdAt}>
                        {formatOrderTime(order.createdAt)}
                        </time>
                    </div>
                    </div>

                    <div className="shrink-0">
                    <Badge status={order.status} />
                    </div>
                </div>

                <div
                    className="
                    mt-4 flex items-center justify-between
                    border-t border-gray-100 pt-3
                    "
                >
                    <span className="text-sm text-gray-500">
                    Total
                    </span>

                    <span className="text-base font-bold text-gray-900">
                    {currencyFormatter.format(order.total)}
                    </span>
                </div>
                </article>
            ))}
            </div>

          {/* Vista de escritorio */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-gray-50">
                <tr className="text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3 font-semibold">
                    Pedido
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Tipo
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Hora
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Estado
                  </th>

                  <th className="px-5 py-3 text-right font-semibold">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      #{order.number}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {orderTypeLabels[order.type] ?? order.type}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatOrderTime(order.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <Badge status={order.status} />
                    </td>

                    <td className="px-5 py-4 text-right font-semibold text-gray-900">
                      {currencyFormatter.format(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

export default RecentOrders;