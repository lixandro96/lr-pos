import BottomSheet from "../../../components/ui/BottomSheet";
import Button from "../../../components/ui/Button";

function CategoryDeactivateConfirmSheet({
  isOpen,
  category,
  onClose,
  onConfirm,
}) {
  if (!category) {
    return null;
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Desactivar categoría"
      footer={
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            onClick={() => onConfirm(category.id)}
          >
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
            ¿Seguro que quieres desactivar esta categoría?
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            La categoría dejará de aparecer como opción activa,
            pero se conservará para mantener el historial y los
            productos ya asociados.
          </p>
        </div>

        <div
          className="
            rounded-2xl border border-gray-200
            bg-white p-4
          "
        >
          <p className="text-sm text-gray-500">
            Categoría
          </p>

          <p className="mt-1 font-bold text-gray-900">
            {category.name}
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}

export default CategoryDeactivateConfirmSheet;