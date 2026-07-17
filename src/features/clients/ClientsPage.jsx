import { useState } from "react";

import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import SearchInput from "../../components/ui/SearchInput";
import Toast from "../../components/ui/Toast";

import ClientDeactivateConfirmSheet from "./components/ClientDeactivateConfirmSheet";
import ClientFormSheet from "./components/ClientFormSheet";
import { useClients } from "./context/useClients";

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function ClientCard({ client, onEdit, onToggleStatus }) {
  return (
    <article
      className="
        rounded-2xl border border-gray-200
        bg-white p-4 shadow-sm
      "
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-bold text-gray-900">
              {client.name}
            </h2>

            <span
              className={`
                rounded-full px-2.5 py-1
                text-xs font-semibold
                ${
                  client.isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }
              `}
            >
              {client.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>

          <p className="mt-1 text-sm font-medium text-[#6F4E37]">
            {client.phone || "Sin teléfono"}
          </p>
        </div>
      </div>

      <div
        className="
          mt-4 rounded-xl border border-gray-100
          bg-gray-50 p-3
        "
      >
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Dirección
        </p>

        <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">
          {client.address || "Sin dirección registrada."}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button
          variant="secondary"
          onClick={() => onEdit(client)}
        >
          Editar
        </Button>

        <Button onClick={() => onToggleStatus(client)}>
          {client.isActive ? "Desactivar" : "Activar"}
        </Button>
      </div>
    </article>
  );
}

function ClientsPage() {
  const {
    clients,
    createClient,
    updateClient,
    toggleClientStatus,
  } = useClients();

  const [searchTerm, setSearchTerm] = useState("");
  const [clientFormMode, setClientFormMode] =
    useState(null);
  const [editingClientId, setEditingClientId] =
    useState(null);
  const [
    clientPendingDeactivation,
    setClientPendingDeactivation,
  ] = useState(null);

  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const normalizedSearchTerm = normalizeText(searchTerm);

  const filteredClients = [...clients]
    .filter((client) => {
      if (!normalizedSearchTerm) {
        return true;
      }

      const searchableContent = normalizeText(
        `${client.name} ${client.phone} ${client.address}`,
      );

      return searchableContent.includes(normalizedSearchTerm);
    })
    .sort((firstClient, secondClient) =>
      firstClient.name.localeCompare(secondClient.name, "es"),
    );

  const totalClients = clients.length;

  const activeClients = clients.filter(
    (client) => client.isActive,
  ).length;

  const inactiveClients = totalClients - activeClients;

  const editingClient = clients.find(
    (client) => client.id === editingClientId,
  );

  const isClientFormOpen = clientFormMode !== null;

  function handleOpenCreateClient() {
    setClientFormMode("create");
    setEditingClientId(null);
    setClientPendingDeactivation(null);
  }

  function handleOpenEditClient(client) {
    setClientFormMode("edit");
    setEditingClientId(client.id);
    setClientPendingDeactivation(null);
  }

  function handleCloseClientForm() {
    setClientFormMode(null);
    setEditingClientId(null);
  }

  function handleSubmitClientForm(clientData) {
    if (clientFormMode === "edit") {
      handleUpdateClient(clientData);
      return;
    }

    handleCreateClient(clientData);
  }

  function handleCreateClient(clientData) {
    const createdClient = createClient(clientData);

    handleCloseClientForm();

    setToast({
      isOpen: true,
      title: "Cliente creado",
      message: `${createdClient.name} fue agregado correctamente.`,
    });
  }

  function handleUpdateClient(clientData) {
    if (!editingClient) {
      return;
    }

    updateClient(editingClient.id, clientData);

    handleCloseClientForm();

    setToast({
      isOpen: true,
      title: "Cliente actualizado",
      message: `${clientData.name} fue actualizado correctamente.`,
    });
  }

  function handleRequestToggleClientStatus(client) {
    if (!client) {
      return;
    }

    if (client.isActive) {
      setClientPendingDeactivation(client);
      return;
    }

    toggleClientStatus(client.id);

    setToast({
      isOpen: true,
      title: "Cliente activado",
      message: `${client.name} vuelve a estar disponible.`,
    });
  }

  function handleCancelClientDeactivation() {
    setClientPendingDeactivation(null);
  }

  function handleConfirmClientDeactivation(clientId) {
    const client = clients.find(
      (currentClient) => currentClient.id === clientId,
    );

    toggleClientStatus(clientId);
    setClientPendingDeactivation(null);

    setToast({
      isOpen: true,
      title: "Cliente desactivado",
      message: `${
        client?.name ?? "El cliente"
      } ya no aparecerá en delivery.`,
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
        title="Clientes"
        description="Administra los clientes utilizados para pedidos delivery."
      />

      <div
        className="
          flex flex-col gap-3
          rounded-2xl border border-gray-200
          bg-white p-4 shadow-sm
          sm:flex-row sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h2 className="font-bold text-gray-900">
            Registro de clientes
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Crea clientes y controla cuáles pueden usarse en delivery.
          </p>
        </div>

        <Button onClick={handleOpenCreateClient}>
          Nuevo cliente
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <article
          className="
            rounded-2xl border border-gray-200
            bg-white p-3 text-center shadow-sm
            sm:p-4 sm:text-left
          "
        >
          <p className="text-xs text-gray-500 sm:text-sm">
            Total
          </p>

          <p className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
            {totalClients}
          </p>
        </article>

        <article
          className="
            rounded-2xl border border-gray-200
            bg-white p-3 text-center shadow-sm
            sm:p-4 sm:text-left
          "
        >
          <p className="text-xs text-gray-500 sm:text-sm">
            Activos
          </p>

          <p className="mt-2 text-xl font-bold text-emerald-700 sm:text-2xl">
            {activeClients}
          </p>
        </article>

        <article
          className="
            rounded-2xl border border-gray-200
            bg-white p-3 text-center shadow-sm
            sm:p-4 sm:text-left
          "
        >
          <p className="text-xs text-gray-500 sm:text-sm">
            Inactivos
          </p>

          <p className="mt-2 text-xl font-bold text-gray-700 sm:text-2xl">
            {inactiveClients}
          </p>
        </article>
      </div>

      <div
        className="
          rounded-2xl border border-gray-200
          bg-white p-4 shadow-sm
        "
      >
        <SearchInput
          id="clients-search"
          label="Buscar cliente"
          placeholder="Buscar por nombre, teléfono o dirección..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          onClear={() => setSearchTerm("")}
        />
      </div>

      {filteredClients.length > 0 ? (
        <div
          className="
            grid gap-4
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={handleOpenEditClient}
              onToggleStatus={
                handleRequestToggleClientStatus
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No se encontraron clientes"
          description="Prueba con otro término de búsqueda."
        />
      )}

      {isClientFormOpen &&
        (clientFormMode === "create" || editingClient) && (
          <ClientFormSheet
            key={
              clientFormMode === "edit"
                ? `edit-${editingClientId}`
                : "create"
            }
            isOpen={isClientFormOpen}
            onClose={handleCloseClientForm}
            onSubmit={handleSubmitClientForm}
            client={editingClient}
            mode={clientFormMode}
          />
        )}

      <ClientDeactivateConfirmSheet
        isOpen={Boolean(clientPendingDeactivation)}
        client={clientPendingDeactivation}
        onClose={handleCancelClientDeactivation}
        onConfirm={handleConfirmClientDeactivation}
      />

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

export default ClientsPage;