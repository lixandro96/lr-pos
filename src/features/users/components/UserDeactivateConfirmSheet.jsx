import BottomSheet from "../../../components/ui/BottomSheet";
import Button from "../../../components/ui/Button";

function UserDeactivateConfirmSheet({
  isOpen,
  user,
  onClose,
  onConfirm,
}) {
  if (!user) {
    return null;
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Desactivar usuario"
      footer={
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button onClick={() => onConfirm(user.id)}>
            Sí, desactivar
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div
          className="
            rounded-2xl border border-amber-200
            bg-amber-50 p-4
          "
        >
          <p className="font-semibold text-amber-900">
            ¿Seguro que quieres desactivar este usuario?
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            El usuario dejará de estar disponible para operar en el
            sistema, pero se conservará su registro.
          </p>
        </div>

        <div
          className="
            rounded-2xl border border-gray-200
            bg-white p-4
          "
        >
          <p className="text-sm text-gray-500">Usuario</p>

          <p className="mt-1 font-bold text-gray-900">
            {user.name}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {user.email}
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}

export default UserDeactivateConfirmSheet;
