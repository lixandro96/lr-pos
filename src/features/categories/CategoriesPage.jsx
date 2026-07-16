import { useState } from "react";

import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import SearchInput from "../../components/ui/SearchInput";
import Toast from "../../components/ui/Toast";

import CategoryDeactivateConfirmSheet from "./components/CategoryDeactivateConfirmSheet";
import CategoryFormSheet from "./components/CategoryFormSheet";
import { useCategories } from "./context/useCategories";

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function CategoryCard({
  category,
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
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-bold text-gray-900">
              {category.name}
            </h2>

            <span
              className={`
                rounded-full px-2.5 py-1
                text-xs font-semibold
                ${
                  category.isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }
              `}
            >
              {category.isActive ? "Activa" : "Inactiva"}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Orden: {category.sortOrder}
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
        {category.description || "Sin descripción."}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Button
          variant="secondary"
          onClick={() => onEdit(category)}
        >
          Editar
        </Button>

        <Button
          onClick={() => onToggleStatus(category)}
        >
          {category.isActive ? "Desactivar" : "Activar"}
        </Button>
      </div>
    </article>
  );
}

function CategoriesPage() {
  const {
    categories,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
  } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFormMode, setCategoryFormMode] =
    useState(null);
  const [editingCategoryId, setEditingCategoryId] =
    useState(null);
  const [
    categoryPendingDeactivation,
    setCategoryPendingDeactivation,
  ] = useState(null);

  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const normalizedSearchTerm =
    normalizeText(searchTerm);

  const filteredCategories = [...categories]
    .filter((category) => {
      if (!normalizedSearchTerm) {
        return true;
      }

      const searchableContent = normalizeText(
        `${category.name} ${category.description}`,
      );

      return searchableContent.includes(
        normalizedSearchTerm,
      );
    })
    .sort((firstCategory, secondCategory) => {
      const sortDifference =
        (firstCategory.sortOrder ??
          Number.MAX_SAFE_INTEGER) -
        (secondCategory.sortOrder ??
          Number.MAX_SAFE_INTEGER);

      if (sortDifference !== 0) {
        return sortDifference;
      }

      return firstCategory.name.localeCompare(
        secondCategory.name,
        "es",
      );
    });

  const totalCategories = categories.length;

  const activeCategories = categories.filter(
    (category) => category.isActive,
  ).length;

  const inactiveCategories =
    totalCategories - activeCategories;

  const editingCategory = categories.find(
    (category) => category.id === editingCategoryId,
  );

  const isCategoryFormOpen =
    categoryFormMode !== null;

  function handleOpenCreateCategory() {
    setCategoryFormMode("create");
    setEditingCategoryId(null);
    setCategoryPendingDeactivation(null);
  }

  function handleOpenEditCategory(category) {
    setCategoryFormMode("edit");
    setEditingCategoryId(category.id);
    setCategoryPendingDeactivation(null);
  }

  function handleCloseCategoryForm() {
    setCategoryFormMode(null);
    setEditingCategoryId(null);
  }

  function handleSubmitCategoryForm(categoryData) {
    if (categoryFormMode === "edit") {
      handleUpdateCategory(categoryData);
      return;
    }

    handleCreateCategory(categoryData);
  }

  function handleCreateCategory(categoryData) {
    const createdCategory =
      createCategory(categoryData);

    handleCloseCategoryForm();

    setToast({
      isOpen: true,
      title: "Categoría creada",
      message: `${createdCategory.name} fue agregada correctamente.`,
    });
  }

  function handleUpdateCategory(categoryData) {
    if (!editingCategory) {
      return;
    }

    updateCategory(editingCategory.id, categoryData);

    handleCloseCategoryForm();

    setToast({
      isOpen: true,
      title: "Categoría actualizada",
      message: `${categoryData.name} fue actualizada correctamente.`,
    });
  }

  function handleRequestToggleCategoryStatus(category) {
    if (!category) {
      return;
    }

    if (category.isActive) {
      setCategoryPendingDeactivation(category);
      return;
    }

    toggleCategoryStatus(category.id);

    setToast({
      isOpen: true,
      title: "Categoría activada",
      message: `${category.name} vuelve a estar disponible.`,
    });
  }

  function handleCancelCategoryDeactivation() {
    setCategoryPendingDeactivation(null);
  }

  function handleConfirmCategoryDeactivation(categoryId) {
    const category = categories.find(
      (currentCategory) =>
        currentCategory.id === categoryId,
    );

    toggleCategoryStatus(categoryId);
    setCategoryPendingDeactivation(null);

    setToast({
      isOpen: true,
      title: "Categoría desactivada",
      message: `${
        category?.name ?? "La categoría"
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
        title="Categorías"
        description="Administra las categorías utilizadas para organizar productos."
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
            Organización del catálogo
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Crea categorías y controla cuáles están disponibles.
          </p>
        </div>

        <Button onClick={handleOpenCreateCategory}>
          Nueva categoría
        </Button>
      </div>

      <div
        className="
          grid grid-cols-3 gap-2
          sm:gap-4
        "
      >
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
            {totalCategories}
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
            Activas
          </p>

          <p className="mt-2 text-xl font-bold text-emerald-700 sm:text-2xl">
            {activeCategories}
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
            Inactivas
          </p>

          <p className="mt-2 text-xl font-bold text-gray-700 sm:text-2xl">
            {inactiveCategories}
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
          id="categories-search"
          label="Buscar categoría"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          onClear={() => setSearchTerm("")}
        />
      </div>

      {filteredCategories.length > 0 ? (
        <div
          className="
            grid gap-4
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleOpenEditCategory}
              onToggleStatus={
                handleRequestToggleCategoryStatus
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No se encontraron categorías"
          description="Prueba con otro término de búsqueda."
        />
      )}

      {isCategoryFormOpen &&
        (categoryFormMode === "create" ||
          editingCategory) && (
          <CategoryFormSheet
            key={
              categoryFormMode === "edit"
                ? `edit-${editingCategoryId}`
                : "create"
            }
            isOpen={isCategoryFormOpen}
            onClose={handleCloseCategoryForm}
            onSubmit={handleSubmitCategoryForm}
            category={editingCategory}
            mode={categoryFormMode}
          />
        )}

      <CategoryDeactivateConfirmSheet
        isOpen={Boolean(categoryPendingDeactivation)}
        category={categoryPendingDeactivation}
        onClose={handleCancelCategoryDeactivation}
        onConfirm={handleConfirmCategoryDeactivation}
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

export default CategoriesPage;