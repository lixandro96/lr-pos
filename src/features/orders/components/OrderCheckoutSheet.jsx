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

function OrderCheckoutSheet({
    isOpen,
    onClose,
    orderType,
    onOrderTypeChange,
    clients,
    clientId,
    deliveryAddress,
    onClientChange,
    onDeliveryAddressChange,
    totalQuantity,
    total,
    onContinue,
}) {


  const isDeliveryComplete =
  orderType === "DELIVERY" &&
  Boolean(clientId) &&
  deliveryAddress.trim() !== "";

  const canContinue =
    orderType === "MOSTRADOR" ||
    isDeliveryComplete;


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
          Continuar
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
      </div>
    </BottomSheet>
  );
}

export default OrderCheckoutSheet;