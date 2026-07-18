import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { mockUsers } from "../../../mocks";
import { UsersContext } from "./users-context";

const USERS_STORAGE_KEY = "lr-pos-users";

const USER_ROLES = {
  ADMIN: {
    value: "ADMIN",
    label: "Administrador",
    description: "Acceso completo al sistema.",
  },
  CAJERO: {
    value: "CAJERO",
    label: "Cajero",
    description: "Puede crear pedidos, entregar y cobrar.",
  },
  COCINA: {
    value: "COCINA",
    label: "Cocina",
    description: "Puede gestionar pedidos de cocina.",
  },
};

function createUserId(name) {
  const normalizedName = String(name ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (normalizedName) {
    return `user-${normalizedName}-${Date.now()}`;
  }

  return `user-${Date.now()}`;
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function buildCreatedUser(userData) {
  return {
    id: createUserId(userData.name),
    name: String(userData.name ?? "").trim(),
    email: normalizeEmail(userData.email),
    role: userData.role ?? "CAJERO",
    isActive: userData.isActive ?? true,
    createdAt: new Date().toISOString(),
  };
}

function loadUsersFromStorage() {
  if (typeof window === "undefined") {
    return [...mockUsers];
  }

  try {
    const storedUsers =
      window.localStorage.getItem(USERS_STORAGE_KEY);

    if (!storedUsers) {
      return [...mockUsers];
    }

    const parsedUsers = JSON.parse(storedUsers);

    if (!Array.isArray(parsedUsers)) {
      return [...mockUsers];
    }

    return parsedUsers;
  } catch (error) {
    console.error(
      "No se pudieron cargar los usuarios desde localStorage:",
      error,
    );

    return [...mockUsers];
  }
}

function saveUsersToStorage(users) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(users),
    );
  } catch (error) {
    console.error(
      "No se pudieron guardar los usuarios en localStorage:",
      error,
    );
  }
}

function UsersProvider({ children }) {
  const [users, setUsers] = useState(() =>
    loadUsersFromStorage(),
  );

  useEffect(() => {
    saveUsersToStorage(users);
  }, [users]);

  const createUser = useCallback((userData) => {
    let createdUser = null;

    setUsers((currentUsers) => {
      createdUser = buildCreatedUser(userData);

      return [createdUser, ...currentUsers];
    });

    return createdUser;
  }, []);

  const updateUser = useCallback((userId, userData) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.id !== userId) {
          return user;
        }

        return {
          ...user,
          name: String(
            userData.name ?? user.name,
          ).trim(),
          email: normalizeEmail(
            userData.email ?? user.email,
          ),
          role: userData.role ?? user.role,
          isActive:
            userData.isActive ?? user.isActive,
        };
      }),
    );
  }, []);

  const toggleUserStatus = useCallback((userId) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.id !== userId) {
          return user;
        }

        return {
          ...user,
          isActive: !user.isActive,
        };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({
      users,
      createUser,
      updateUser,
      toggleUserStatus,
      userRoles: USER_ROLES,
    }),
    [users, createUser, updateUser, toggleUserStatus],
  );

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
}

export default UsersProvider;