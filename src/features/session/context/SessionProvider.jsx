import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useUsers } from "../../users/context/useUsers";
import { SessionContext } from "./session-context";

const SESSION_USER_STORAGE_KEY = "lr-pos-current-user-id";

const SIMULATED_PASSWORD = "123456";

const ROLE_ALLOWED_PATHS = {
  ADMIN: ["*"],
  CAJERO: ["/", "/orders", "/deliveries", "/payments"],
  COCINA: ["/kitchen"],
};

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function loadCurrentUserIdFromStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem(
      SESSION_USER_STORAGE_KEY,
    ) || null
  );
}

function saveCurrentUserIdToStorage(userId) {
  if (typeof window === "undefined") {
    return;
  }

  if (!userId) {
    window.localStorage.removeItem(
      SESSION_USER_STORAGE_KEY,
    );
    return;
  }

  window.localStorage.setItem(
    SESSION_USER_STORAGE_KEY,
    userId,
  );
}

function canRoleAccessPath(role, path) {
  const allowedPaths = ROLE_ALLOWED_PATHS[role] ?? [];

  if (allowedPaths.includes("*")) {
    return true;
  }

  return allowedPaths.includes(path);
}

function SessionProvider({ children }) {
  const { users, userRoles } = useUsers();

  const [currentUserId, setCurrentUserId] = useState(() =>
    loadCurrentUserIdFromStorage(),
  );

  const activeUsers = useMemo(
    () =>
      [...users]
        .filter((user) => user.isActive)
        .sort((firstUser, secondUser) =>
          firstUser.name.localeCompare(
            secondUser.name,
            "es",
          ),
        ),
    [users],
  );

const currentUser = useMemo(
  () =>
    activeUsers.find(
      (user) => user.id === currentUserId,
    ) ?? null,
  [activeUsers, currentUserId],
);

useEffect(() => {
  if (currentUserId && !currentUser) {
    saveCurrentUserIdToStorage(null);
    return;
  }

  saveCurrentUserIdToStorage(currentUserId);
}, [currentUserId, currentUser]);

const currentRole = currentUser?.role ?? null;

  useEffect(() => {
    saveCurrentUserIdToStorage(currentUserId);
  }, [currentUserId]);


  const currentRoleDetails = currentRole
    ? userRoles[currentRole]
    : null;

  const isAuthenticated = Boolean(currentUser);

  const login = useCallback(
    ({ email, password }) => {
      const normalizedEmail = normalizeEmail(email);

      const user = activeUsers.find(
        (currentUserItem) =>
          normalizeEmail(currentUserItem.email) ===
          normalizedEmail,
      );

      if (!user) {
        return {
          ok: false,
          message:
            "No encontramos un usuario activo con ese correo.",
        };
      }

      const expectedPassword =
        user.password ?? SIMULATED_PASSWORD;

      if (password !== expectedPassword) {
        return {
          ok: false,
          message: "La contraseña no es correcta.",
        };
      }

      setCurrentUserId(user.id);

      return {
        ok: true,
        message: "Sesión iniciada correctamente.",
      };
    },
    [activeUsers],
  );

  const logout = useCallback(() => {
    setCurrentUserId(null);
  }, []);

  const canAccessPath = useCallback(
    (path) => {
      if (!currentRole) {
        return false;
      }

      return canRoleAccessPath(currentRole, path);
    },
    [currentRole],
  );

  const value = useMemo(
    () => ({
      currentUser,
      currentRole,
      currentRoleDetails,
      activeUsers,
      userRoles,
      isAuthenticated,
      login,
      logout,
      canAccessPath,
      simulatedPassword: SIMULATED_PASSWORD,
    }),
    [
      currentUser,
      currentRole,
      currentRoleDetails,
      activeUsers,
      userRoles,
      isAuthenticated,
      login,
      logout,
      canAccessPath,
    ],
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export default SessionProvider;