import { useState } from "react";

import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Select from "../../components/ui/Select";
import Toast from "../../components/ui/Toast";

import { mockClients } from "../../mocks";
import { useOrders } from "../orders/context/useOrders";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

const collectedPaymentOptionsByOrderType = {
  MOSTRADOR: [
    {
      value: "CASH",
      label: "Efectivo",
    },
    {
      value: "CARD",
      label: "Tarjeta",
    },
    {
      value: "TRANSFER",
      label: "Transferencia",
    },
  ],
  DELIVERY: [
    {
      value: "CASH",
      label: "Efectivo",
    },
    {
      value: "TRANSFER",
      label: "Transferencia",
    },
  ],
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

function PendingPaymentCard({
  order,
  selectedPaymentMethod = "",
  onPaymentMethodChange,
  onMarkAsPaid,
}) {
  const paymentOptions =
    collectedPaymentOptionsByOrderType[order.type] ?? [];

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
                rounded-full bg-amber-100
                px-2.5 py-1 text-xs
                font-semibold text-amber-800
              "
            >
              Pendiente de cobro
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
              Tipo:
            </span>{" "}
            <span className="text-gray-700">
              Retiro en mostrador
            </span>
          </p>
        )}

        <p className="mt-2">
          <span className="font-semibold text-gray-900">
            Total a cobrar:
          </span>{" "}
          <span className="text-gray-700">
            {currencyFormatter.format(order.total)}
          </span>
        </p>
      </div>

      <div className="mt-4 space-y-4">
        <Select
          id={`payment-method-${order.id}`}
          label="Método recibido"
          placeholder="Selecciona cómo se cobró"
          options={paymentOptions}
          value={selectedPaymentMethod}
          onChange={(event) =>
            onPaymentMethodChange(
              order.id,
              event.target.value,
            )
          }
          helperText="Este método reemplazará el estado pendiente de cobro."
        />

        <Button
          className="w-full"
          disabled={!selectedPaymentMethod}
          onClick={() => onMarkAsPaid(order.id)}
        >
          Marcar como pagado
        </Button>
      </div>
    </article>
  );
}

function PaymentsPage() {
  const { orders, updateOrderPayment } = useOrders();

  const [selectedPaymentMethods, setSelectedPaymentMethods] =
    useState({});

  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const pendingPaymentOrders = orders
    .filter(
      (order) =>
        order.status === "DESPACHADO" &&
        order.paymentStatus === "PENDIENTE",
    )
    .sort(
      (firstOrder, secondOrder) =>
        new Date(firstOrder.createdAt) -
        new Date(secondOrder.createdAt),
    );

  function handlePaymentMethodChange(
    orderId,
    paymentMethod,
  ) {
    setSelectedPaymentMethods((currentMethods) => ({
      ...currentMethods,
      [orderId]: paymentMethod,
    }));
  }

  function handleMarkAsPaid(orderId) {
    const paymentMethod =
      selectedPaymentMethods[orderId];

    if (!paymentMethod) {
      return;
    }

    const order = orders.find(
      (currentOrder) => currentOrder.id === orderId,
    );

    updateOrderPayment(orderId, {
      paymentMethod,
      paymentStatus: "PAGADO",
      paidAt: new Date().toISOString(),
    });

    setSelectedPaymentMethods((currentMethods) => {
      const updatedMethods = {
        ...currentMethods,
      };

      delete updatedMethods[orderId];

      return updatedMethods;
    });

    setToast({
      isOpen: true,
      title: "Cobro registrado",
      message: `El pedido ${
        order?.number ?? ""
      } fue marcado como pagado.`,
    });
  }

  function handleCloseToast() {
    setToast((currentToast) => ({
      ...currentToast,
      isOpen: false,
    }));
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Cobros"
        description="Gestiona los pedidos despachados que todavía están pendientes de pago."
      />

      {pendingPaymentOrders.length === 0 ? (
        <EmptyState
          title="No hay cobros pendientes"
          description="Cuando un pedido despachado quede pendiente de cobro, aparecerá en esta sección."
        />
      ) : (
        <div
          className="
            grid gap-4
            lg:grid-cols-2
            2xl:grid-cols-3
          "
        >
          {pendingPaymentOrders.map((order) => (
            <PendingPaymentCard
              key={order.id}
              order={order}
              selectedPaymentMethod={
                selectedPaymentMethods[order.id] ?? ""
              }
              onPaymentMethodChange={
                handlePaymentMethodChange
              }
              onMarkAsPaid={handleMarkAsPaid}
            />
          ))}
        </div>
      )}

      <Toast
        isOpen={toast.isOpen}
        type="success"
        title={toast.title}
        message={toast.message}
        onClose={handleCloseToast}
      />
    </section>
  );
}

export default PaymentsPage;