import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import PageHeader from "../../components/layout/PageHeader";

import { useOrders } from "../orders/context/useOrders";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

const statusStyles = {
  PENDIENTE: {
    label: "Pendiente",
    className: "bg-amber-100 text-amber-800",
  },
  EN_PREPARACION: {
    label: "En preparación",
    className: "bg-blue-100 text-blue-800",
  },
};

function formatOrderType(type) {
  if (type === "DELIVERY") {
    return "Delivery";
  }

  return "Mostrador";
}

function formatCreatedAt(createdAt) {
  return new Intl.DateTimeFormat("es-DO", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

function KitchenOrderCard({
  order,
  onStartPreparation,
  onMarkReady,
}) {
  const status = statusStyles[order.status];

  return (
    <article
      className="
        rounded-2xl border border-gray-200
        bg-white p-4 shadow-sm
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">
              {order.number}
            </h2>

            <span
              className={`
                rounded-full px-2.5 py-1
                text-xs font-semibold
                ${status.className}
              `}
            >
              {status.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            {formatOrderType(order.type)} ·{" "}
            {formatCreatedAt(order.createdAt)}
          </p>
        </div>

        <p className="font-bold text-[#6F4E37]">
          {currencyFormatter.format(order.total)}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {order.items.map((item) => (
          <div
            key={`${order.id}-${item.productId}-${item.variantId}-${item.notes}`}
            className="
              rounded-xl bg-gray-50 p-3
            "
          >
            <div className="flex justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900">
                  {item.quantity} × {item.name}
                </p>

                {item.variantName && (
                  <p className="mt-0.5 text-sm text-gray-500">
                    Tamaño: {item.variantName}
                  </p>
                )}
              </div>

              <p className="text-sm font-semibold text-gray-700">
                {currencyFormatter.format(item.subtotal)}
              </p>
            </div>

            {item.notes && (
              <p
                className="
                  mt-2 rounded-lg bg-white px-3 py-2
                  text-sm text-gray-600
                "
              >
                Nota: {item.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5">
        {order.status === "PENDIENTE" && (
          <Button
            className="w-full"
            onClick={() => onStartPreparation(order.id)}
          >
            Tomar pedido
          </Button>
        )}

        {order.status === "EN_PREPARACION" && (
          <Button
            className="w-full"
            onClick={() => onMarkReady(order.id)}
          >
            Marcar como listo
          </Button>
        )}
      </div>
    </article>
  );
}

function KitchenPage() {
  const { orders, updateOrderStatus } = useOrders();

  const kitchenOrders = orders
    .filter((order) =>
      ["PENDIENTE", "EN_PREPARACION"].includes(
        order.status,
      ),
    )
    .sort(
      (firstOrder, secondOrder) =>
        new Date(firstOrder.createdAt) -
        new Date(secondOrder.createdAt),
    );

  const pendingOrders = kitchenOrders.filter(
    (order) => order.status === "PENDIENTE",
  );

  const preparingOrders = kitchenOrders.filter(
    (order) => order.status === "EN_PREPARACION",
  );

  function handleStartPreparation(orderId) {
    updateOrderStatus(orderId, "EN_PREPARACION");
  }

  function handleMarkReady(orderId) {
    updateOrderStatus(orderId, "LISTO");
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Cocina"
        description="Gestiona los pedidos pendientes y en preparación."
      />

      {kitchenOrders.length === 0 ? (
        <EmptyState
          title="No hay pedidos en cocina"
          description="Cuando se confirme un pedido, aparecerá aquí automáticamente."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Pendientes
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Pedidos que todavía no han sido tomados por cocina.
              </p>
            </div>

            {pendingOrders.length > 0 ? (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onStartPreparation={
                      handleStartPreparation
                    }
                    onMarkReady={handleMarkReady}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sin pedidos pendientes"
                description="No hay pedidos esperando para ser tomados."
              />
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                En preparación
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Pedidos que cocina está preparando actualmente.
              </p>
            </div>

            {preparingOrders.length > 0 ? (
              <div className="space-y-4">
                {preparingOrders.map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onStartPreparation={
                      handleStartPreparation
                    }
                    onMarkReady={handleMarkReady}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nada en preparación"
                description="Cuando tomes un pedido, aparecerá en esta sección."
              />
            )}
          </section>
        </div>
      )}
    </section>
  );
}

export default KitchenPage;