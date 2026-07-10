import Select from "../../../components/ui/Select";
import TextArea from "../../../components/ui/TextArea";

function DeliveryDetailsForm({
  clients = [],
  clientId = "",
  deliveryAddress = "",
  onClientChange,
  onDeliveryAddressChange,
}) {
  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: `${client.name} · ${client.phone}`,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900">
          Datos de entrega
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Selecciona el cliente y confirma la dirección del
          delivery.
        </p>
      </div>

      <Select
        id="delivery-client"
        label="Cliente"
        placeholder="Selecciona un cliente"
        options={clientOptions}
        value={clientId}
        onChange={(event) =>
          onClientChange(event.target.value)
        }
      />

      <TextArea
        id="delivery-address"
        label="Dirección de entrega"
        placeholder="Escribe la dirección completa"
        value={deliveryAddress}
        onChange={(event) =>
          onDeliveryAddressChange(event.target.value)
        }
        rows={3}
        helperText="Puedes modificar la dirección para este pedido sin cambiar los datos originales del cliente."
      />
    </div>
  );
}

export default DeliveryDetailsForm;