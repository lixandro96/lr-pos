import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

import { mockClients } from "../../mocks";
import { useOrders } from "../orders/context/useOrders";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

const paymentMethodLabels = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  PENDING_PAYMENT: "Pendiente de cobro",
};

const paymentStatusStyles = {
  PAGADO: {
    label: "Pagado",
    className: "bg-emerald-100 text-emerald-800",
  },
  PENDIENTE: {
    label: "Pendiente de cobro",
    className: "bg-amber-100 text-amber-800",
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

function getClientName(clientId) {
  const client = mockClients.find(
    (currentClient) => currentClient.id === clientId,
  );

  return client?.name ?? "Cliente no especificado";
}

function DeliveryOrderCard({ order, onDispatch }) {
  const paymentStatus =
    paymentStatusStyles[order.paymentStatus] ??
    paymentStatusStyles.PENDIENTE;

  const paymentMethodLabel =
    paymentMethodLabels[order.paymentMethod] ??
    "No especificado";

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
              className="
                rounded-full bg-green-100
                px-2.5 py-1 text-xs
                font-semibold text-green-800
              "
            >
              Listo
            </span>

            <span
              className={`
                rounded-full px-2.5 py-1
                text-xs font-semibold
                ${paymentStatus.className}
              `}
            >
              {paymentStatus.label}
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

      <div
        className="
          mt-4 rounded-xl bg-gray-50
          p-4 text-sm
        "
      >
        {order.type === "DELIVERY" ? (
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-900">
                Cliente:
              </span>{" "}
              <span className="text-gray-700">
                {getClientName(order.clientId)}
              </span>
            </p>

            <p>
              <span className="font-semibold text-gray-900">
                Dirección:
              </span>{" "}
              <span className="text-gray-700">
                {order.deliveryAddress}
              </span>
            </p>
          </div>
        ) : (
          <p>
            <span className="font-semibold text-gray-900">
              Entrega:
            </span>{" "}
            <span className="text-gray-700">
              Retiro en mostrador
            </span>
          </p>
        )}

        <p className="mt-2">
          <span className="font-semibold text-gray-900">
            Pago:
          </span>{" "}
          <span className="text-gray-700">
            {paymentMethodLabel}
          </span>
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {order.items.map((item) => (
          <div
            key={`${order.id}-${item.productId}-${item.variantId}-${item.notes}`}
            className="rounded-xl border border-gray-100 p-3"
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
                  mt-2 rounded-lg bg-gray-50 px-3 py-2
                  text-sm text-gray-600
                "
              >
                Nota: {item.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      <Button
        className="mt-5 w-full"
        onClick={() => onDispatch(order.id)}
      >
        Marcar como despachado
      </Button>
    </article>
  );
}

function DeliveriesPage() {
  const { orders, updateOrderStatus } = useOrders();

  const readyOrders = orders
    .filter((order) => order.status === "LISTO")
    .sort(
      (firstOrder, secondOrder) =>
        new Date(firstOrder.createdAt) -
        new Date(secondOrder.createdAt),
    );

  function handleDispatchOrder(orderId) {
    updateOrderStatus(orderId, "DESPACHADO");
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Entregas"
        description="Gestiona los pedidos listos para entregar o despachar."
      />

      {readyOrders.length === 0 ? (
        <EmptyState
          title="No hay pedidos listos"
          description="Cuando cocina marque un pedido como listo, aparecerá en esta sección."
        />
      ) : (
        <div
          className="
            grid gap-4
            lg:grid-cols-2
            2xl:grid-cols-3
          "
        >
          {readyOrders.map((order) => (
            <DeliveryOrderCard
              key={order.id}
              order={order}
              onDispatch={handleDispatchOrder}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default DeliveriesPage;