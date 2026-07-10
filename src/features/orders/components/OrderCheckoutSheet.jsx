import BottomSheet from "../../../components/ui/BottomSheet";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

import DeliveryDetailsForm from "./DeliveryDetailsForm";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

const orderTypeOptions = [
  {
    value: "MOSTRADOR",
    label: "Mostrador",
  },
  {
    value: "DELIVERY",
    label: "Delivery",
  },
];

const paymentMethodOptionsByOrderType = {
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
    {
      value: "PENDING_PAYMENT",
      label: "Pendiente de cobro",
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
    {
      value: "PENDING_PAYMENT",
      label: "Pendiente de cobro",
    },
  ],
};

function OrderCheckoutSheet({
  isOpen,
  onClose,
  orderType,
  onOrderTypeChange,
  clients = [],
  clientId = "",
  deliveryAddress = "",
  onClientChange,
  onDeliveryAddressChange,
  paymentMethod = "",
  onPaymentMethodChange,
  totalQuantity,
  total,
  onContinue,
}) {
  const paymentMethodOptions =
    paymentMethodOptionsByOrderType[orderType] ?? [];

  const hasOrderType = Boolean(orderType);
  const hasPaymentMethod = Boolean(paymentMethod);

  const hasDeliveryDetails =
    orderType !== "DELIVERY" ||
    (Boolean(clientId) &&
      deliveryAddress.trim() !== "");

  const canContinue =
    hasOrderType &&
    hasDeliveryDetails &&
    hasPaymentMethod;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar pedido"
      footer={
        <Button
          className="w-full"
          disabled={!canContinue}
          onClick={onContinue}
        >
          Confirmar Pedido
        </Button>
      }
    >
      <div className="space-y-6">
        <div
          className="
            flex items-center justify-between
            rounded-2xl bg-gray-50 p-4
          "
        >
          <div>
            <p className="text-sm text-gray-500">
              Resumen del pedido
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {totalQuantity} unidades
            </p>
          </div>

          <p className="text-lg font-bold text-[#6F4E37]">
            {currencyFormatter.format(total)}
          </p>
        </div>

        <Select
          id="order-type"
          label="Tipo de pedido"
          placeholder="Selecciona el tipo de pedido"
          options={orderTypeOptions}
          value={orderType}
          onChange={(event) =>
            onOrderTypeChange(event.target.value)
          }
          helperText="Indica si el cliente recogerá el pedido o si será enviado por delivery."
        />

        {orderType === "MOSTRADOR" && (
          <div
            className="
              rounded-xl border border-[#6F4E37]/20
              bg-[#6F4E37]/5 p-4
            "
          >
            <p className="text-sm text-gray-700">
              El pedido será preparado para recogida en el
              mostrador.
            </p>
          </div>
        )}

        {orderType === "DELIVERY" && (
          <DeliveryDetailsForm
            clients={clients}
            clientId={clientId}
            deliveryAddress={deliveryAddress}
            onClientChange={onClientChange}
            onDeliveryAddressChange={
              onDeliveryAddressChange
            }
          />
        )}

        {hasOrderType && (
          <Select
            id="payment-method"
            label="Método de pago"
            placeholder="Selecciona el método de pago"
            options={paymentMethodOptions}
            value={paymentMethod}
            onChange={(event) =>
              onPaymentMethodChange(event.target.value)
            }
            helperText="Si seleccionas pendiente de cobro, el pedido quedará registrado para cobrar después."
          />
        )}

        {paymentMethod === "PENDING_PAYMENT" && (
          <div
            className="
              rounded-xl border border-amber-200
              bg-amber-50 p-4
            "
          >
            <p className="text-sm font-medium text-amber-900">
              Este pedido quedará pendiente de cobro.
            </p>

            <p className="mt-1 text-sm text-amber-800">
              Más adelante aparecerá en el módulo de Cobros para
              marcarlo como pagado.
            </p>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

export default OrderCheckoutSheet;