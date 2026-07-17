import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { mockClients } from "../../../mocks";
import { ClientsContext } from "./clients-context";

const CLIENTS_STORAGE_KEY = "lr-pos-clients";

function createClientId(name) {
  const normalizedName = String(name ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (normalizedName) {
    return `client-${normalizedName}-${Date.now()}`;
  }

  return `client-${Date.now()}`;
}

function buildCreatedClient(clientData) {
  return {
    id: createClientId(clientData.name),
    name: String(clientData.name ?? "").trim(),
    phone: String(clientData.phone ?? "").trim(),
    address: String(clientData.address ?? "").trim(),
    isActive: clientData.isActive ?? true,
  };
}

function loadClientsFromStorage() {
  if (typeof window === "undefined") {
    return [...mockClients];
  }

  try {
    const storedClients =
      window.localStorage.getItem(CLIENTS_STORAGE_KEY);

    if (!storedClients) {
      return [...mockClients];
    }

    const parsedClients = JSON.parse(storedClients);

    if (!Array.isArray(parsedClients)) {
      return [...mockClients];
    }

    return parsedClients;
  } catch (error) {
    console.error(
      "No se pudieron cargar los clientes desde localStorage:",
      error,
    );

    return [...mockClients];
  }
}

function saveClientsToStorage(clients) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      CLIENTS_STORAGE_KEY,
      JSON.stringify(clients),
    );
  } catch (error) {
    console.error(
      "No se pudieron guardar los clientes en localStorage:",
      error,
    );
  }
}

function ClientsProvider({ children }) {
  const [clients, setClients] = useState(() =>
    loadClientsFromStorage(),
  );

  useEffect(() => {
    saveClientsToStorage(clients);
  }, [clients]);

  const createClient = useCallback((clientData) => {
    let createdClient = null;

    setClients((currentClients) => {
      createdClient = buildCreatedClient(clientData);

      return [createdClient, ...currentClients];
    });

    return createdClient;
  }, []);

  const updateClient = useCallback(
    (clientId, clientData) => {
      setClients((currentClients) =>
        currentClients.map((client) => {
          if (client.id !== clientId) {
            return client;
          }

          return {
            ...client,
            name: String(
              clientData.name ?? client.name,
            ).trim(),
            phone: String(
              clientData.phone ?? client.phone ?? "",
            ).trim(),
            address: String(
              clientData.address ?? client.address ?? "",
            ).trim(),
            isActive:
              clientData.isActive ?? client.isActive,
          };
        }),
      );
    },
    [],
  );

  const toggleClientStatus = useCallback((clientId) => {
    setClients((currentClients) =>
      currentClients.map((client) => {
        if (client.id !== clientId) {
          return client;
        }

        return {
          ...client,
          isActive: !client.isActive,
        };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({
      clients,
      createClient,
      updateClient,
      toggleClientStatus,
    }),
    [
      clients,
      createClient,
      updateClient,
      toggleClientStatus,
    ],
  );

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
}

export default ClientsProvider;