import { useState } from "react";

import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";
import Toast from "../../components/ui/Toast";

import UserDeactivateConfirmSheet from "./components/UserDeactivateConfirmSheet";
import UserFormSheet from "./components/UserFormSheet";
import { useUsers } from "./context/useUsers";

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getRoleLabel(userRoles, roleValue) {
  return userRoles[roleValue]?.label ?? "Rol no definido";
}

function getRoleDescription(userRoles, roleValue) {
  return userRoles[roleValue]?.description ?? "";
}

function UserCard({
  user,
  userRoles,
  onEdit,
  onToggleStatus,
}) {
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
              {user.name}
            </h2>

            <span
              className={`
                rounded-full px-2.5 py-1
                text-xs font-semibold
                ${
                  user.isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }
              `}
            >
              {user.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            {user.email}
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
          Rol
        </p>

        <p className="mt-1 font-semibold text-[#6F4E37]">
          {getRoleLabel(userRoles, user.role)}
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-600">
          {getRoleDescription(userRoles, user.role)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button
          variant="secondary"
          onClick={() => onEdit(user)}
        >
          Editar
        </Button>

        <Button onClick={() => onToggleStatus(user)}>
          {user.isActive ? "Desactivar" : "Activar"}
        </Button>
      </div>
    </article>
  );
}

function UsersPage() {
  const {
    users,
    createUser,
    updateUser,
    toggleUserStatus,
    userRoles,
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");

  const [userFormMode, setUserFormMode] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);

  const [
    userPendingDeactivation,
    setUserPendingDeactivation,
  ] = useState(null);

  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const normalizedSearchTerm = normalizeText(searchTerm);

  const roleOptions = [
    {
      value: "ALL",
      label: "Todos los roles",
    },
    ...Object.values(userRoles).map((role) => ({
      value: role.value,
      label: role.label,
    })),
  ];

  const filteredUsers = [...users]
    .filter((user) => {
      if (selectedRole === "ALL") {
        return true;
      }

      return user.role === selectedRole;
    })
    .filter((user) => {
      if (!normalizedSearchTerm) {
        return true;
      }

      const searchableContent = normalizeText(
        `${user.name} ${user.email} ${getRoleLabel(
          userRoles,
          user.role,
        )}`,
      );

      return searchableContent.includes(normalizedSearchTerm);
    })
    .sort((firstUser, secondUser) =>
      firstUser.name.localeCompare(secondUser.name, "es"),
    );

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.isActive,
  ).length;

  const inactiveUsers = totalUsers - activeUsers;

  const editingUser = users.find(
    (user) => user.id === editingUserId,
  );

  const isUserFormOpen = userFormMode !== null;

  function handleOpenCreateUser() {
    setUserFormMode("create");
    setEditingUserId(null);
    setUserPendingDeactivation(null);
  }

  function handleOpenEditUser(user) {
    setUserFormMode("edit");
    setEditingUserId(user.id);
    setUserPendingDeactivation(null);
  }

  function handleCloseUserForm() {
    setUserFormMode(null);
    setEditingUserId(null);
  }

  function handleSubmitUserForm(userData) {
    if (userFormMode === "edit") {
      handleUpdateUser(userData);
      return;
    }

    handleCreateUser(userData);
  }

  function handleCreateUser(userData) {
    const createdUser = createUser(userData);

    handleCloseUserForm();

    setToast({
      isOpen: true,
      title: "Usuario creado",
      message: `${createdUser.name} fue agregado correctamente.`,
    });
  }

  function handleUpdateUser(userData) {
    if (!editingUser) {
      return;
    }

    updateUser(editingUser.id, userData);

    handleCloseUserForm();

    setToast({
      isOpen: true,
      title: "Usuario actualizado",
      message: `${userData.name} fue actualizado correctamente.`,
    });
  }

  function handleRequestToggleUserStatus(user) {
    if (!user) {
      return;
    }

    if (user.isActive) {
      setUserPendingDeactivation(user);
      return;
    }

    toggleUserStatus(user.id);

    setToast({
      isOpen: true,
      title: "Usuario activado",
      message: `${user.name} vuelve a estar disponible.`,
    });
  }

  function handleCancelUserDeactivation() {
    setUserPendingDeactivation(null);
  }

  function handleConfirmUserDeactivation(userId) {
    const user = users.find(
      (currentUser) => currentUser.id === userId,
    );

    toggleUserStatus(userId);
    setUserPendingDeactivation(null);

    setToast({
      isOpen: true,
      title: "Usuario desactivado",
      message: `${
        user?.name ?? "El usuario"
      } ya no estará disponible.`,
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
        title="Usuarios"
        description="Administra los usuarios y roles operativos del sistema."
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
            Equipo operativo
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Crea usuarios y asigna el rol que tendrá cada persona.
          </p>
        </div>

        <Button onClick={handleOpenCreateUser}>
          Nuevo usuario
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
            {totalUsers}
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
            {activeUsers}
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
            {inactiveUsers}
          </p>
        </article>
      </div>

      <div
        className="
          grid gap-4
          rounded-2xl border border-gray-200
          bg-white p-4 shadow-sm
          lg:grid-cols-[minmax(0,1fr)_18rem]
        "
      >
        <SearchInput
          id="users-search"
          label="Buscar usuario"
          placeholder="Buscar por nombre, correo o rol..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          onClear={() => setSearchTerm("")}
        />

        <Select
          id="users-role-filter"
          label="Rol"
          value={selectedRole}
          options={roleOptions}
          onChange={(event) =>
            setSelectedRole(event.target.value)
          }
        />
      </div>

      {filteredUsers.length > 0 ? (
        <div
          className="
            grid gap-4
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              userRoles={userRoles}
              onEdit={handleOpenEditUser}
              onToggleStatus={handleRequestToggleUserStatus}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No se encontraron usuarios"
          description="Prueba con otro término de búsqueda o selecciona otro rol."
        />
      )}

      {isUserFormOpen &&
        (userFormMode === "create" || editingUser) && (
          <UserFormSheet
            key={
              userFormMode === "edit"
                ? `edit-${editingUserId}`
                : "create"
            }
            isOpen={isUserFormOpen}
            onClose={handleCloseUserForm}
            onSubmit={handleSubmitUserForm}
            user={editingUser}
            mode={userFormMode}
            userRoles={userRoles}
          />
        )}

      <UserDeactivateConfirmSheet
        isOpen={Boolean(userPendingDeactivation)}
        user={userPendingDeactivation}
        onClose={handleCancelUserDeactivation}
        onConfirm={handleConfirmUserDeactivation}
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

export default UsersPage;