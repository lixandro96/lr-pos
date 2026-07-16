import { useState } from "react";

import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";
import Toast from "../../components/ui/Toast";

import { useCategories } from "../categories/context/useCategories";

import ProductAdminCard from "./components/ProductAdminCard";
import ProductDeactivateConfirmSheet from "./components/ProductDeactivateConfirmSheet";
import ProductDetailsSheet from "./components/ProductDetailsSheet";
import ProductFormSheet from "./components/ProductFormSheet";
import { useProducts } from "./context/useProducts";

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getCategoryName(categoryId, categories) {
  const category = categories.find(
    (currentCategory) =>
      currentCategory.id === categoryId,
  );

  return category?.name ?? "Sin categoría";
}

function ProductsPage() {

  const {
    products,
    createProduct,
    updateProduct,
    toggleProductStatus,
  } = useProducts();

  const { categories } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] =
    useState("ALL");

  const [selectedProductId, setSelectedProductId] =
    useState(null);

  const [
    productPendingDeactivation,
    setProductPendingDeactivation,
  ] = useState(null);

  const [productFormMode, setProductFormMode] =
    useState(null);

  const [editingProductId, setEditingProductId] =
    useState(null);

  const [toast, setToast] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const sortedCategories = [...categories].sort(
  (firstCategory, secondCategory) => {
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
  },
);

const activeCategories = sortedCategories.filter(
  (category) => category.isActive,
);

  const categoryOptions = [
  {
    value: "ALL",
    label: "Todas las categorías",
  },
  ...sortedCategories.map((category) => ({
    value: category.id,
    label: category.isActive
      ? category.name
      : `${category.name} (inactiva)`,
  })),
];

  const normalizedSearchTerm =
    normalizeText(searchTerm);

  const filteredProducts = [...products]
    .filter((product) => {
      if (selectedCategoryId === "ALL") {
        return true;
      }

      return product.categoryId === selectedCategoryId;
    })
    .filter((product) => {
      if (!normalizedSearchTerm) {
        return true;
      }

      const searchableContent = normalizeText(
        `${product.name} ${product.description}`,
      );

      return searchableContent.includes(
        normalizedSearchTerm,
      );
    })
    .sort((firstProduct, secondProduct) => {
      const firstCategory =
        activeCategories.find(
          (category) =>
            category.id === firstProduct.categoryId,
        );

      const secondCategory =
        activeCategories.find(
          (category) =>
            category.id === secondProduct.categoryId,
        );

      const categoryDifference =
        (firstCategory?.sortOrder ??
          Number.MAX_SAFE_INTEGER) -
        (secondCategory?.sortOrder ??
          Number.MAX_SAFE_INTEGER);

      if (categoryDifference !== 0) {
        return categoryDifference;
      }

      const productOrderDifference =
        (firstProduct.sortOrder ??
          Number.MAX_SAFE_INTEGER) -
        (secondProduct.sortOrder ??
          Number.MAX_SAFE_INTEGER);

      if (productOrderDifference !== 0) {
        return productOrderDifference;
      }

      return firstProduct.name.localeCompare(
        secondProduct.name,
        "es",
      );
    });

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  const selectedProductCategoryName = selectedProduct
  ? getCategoryName(
      selectedProduct.categoryId,
      sortedCategories,
    )
  : "";

  const editingProduct = products.find(
    (product) => product.id === editingProductId,
  );

  const isProductFormOpen = productFormMode !== null;

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.isActive,
  ).length;

  const inactiveProducts =
    totalProducts - activeProducts;

  function handleOpenCreateProduct() {
    setProductFormMode("create");
    setEditingProductId(null);
    setSelectedProductId(null);
    setProductPendingDeactivation(null);
  }

  function handleOpenEditProduct(product) {
    setProductFormMode("edit");
    setEditingProductId(product.id);
    setSelectedProductId(null);
    setProductPendingDeactivation(null);
  }

  function handleCloseProductForm() {
    setProductFormMode(null);
    setEditingProductId(null);
  }

  function handleSubmitProductForm(productData) {
    if (productFormMode === "edit") {
      handleUpdateProduct(productData);
      return;
    }

    handleCreateProduct(productData);
  }

  function handleCreateProduct(productData) {
    const createdProduct = createProduct(productData);

    handleCloseProductForm();
    setSelectedProductId(createdProduct.id);

    setToast({
      isOpen: true,
      title: "Producto creado",
      message: `${createdProduct.name} fue agregado al catálogo.`,
    });
  }

  function handleUpdateProduct(productData) {
    if (!editingProduct) {
      return;
    }

    updateProduct(editingProduct.id, productData);

    handleCloseProductForm();
    setSelectedProductId(editingProduct.id);

    setToast({
      isOpen: true,
      title: "Producto actualizado",
      message: `${productData.name} fue actualizado correctamente.`,
    });
  }

  function handleCloseDetails() {
    setSelectedProductId(null);
    setProductPendingDeactivation(null);
  }

  function handleRequestToggleProductStatus(product) {
    if (!product) {
      return;
    }

    if (product.isActive) {
      setProductPendingDeactivation(product);
      return;
    }

    toggleProductStatus(product.id);

    setToast({
      isOpen: true,
      title: "Producto activado",
      message: `${product.name} vuelve a estar disponible.`,
    });
  }

  function handleCancelProductDeactivation() {
    setProductPendingDeactivation(null);
  }

  function handleConfirmProductDeactivation(productId) {
    const product = products.find(
      (currentProduct) =>
        currentProduct.id === productId,
    );

    toggleProductStatus(productId);
    setProductPendingDeactivation(null);

    setToast({
      isOpen: true,
      title: "Producto desactivado",
      message: `${
        product?.name ?? "El producto"
      } ya no aparecerá en pedidos.`,
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
        title="Productos"
        description="Administra el catálogo de productos."
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
            Catálogo administrativo
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Crea productos, revisa detalles y administra su
            disponibilidad.
          </p>
        </div>

        <Button onClick={handleOpenCreateProduct}>
          Nuevo producto
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
            {totalProducts}
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
            {activeProducts}
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
            {inactiveProducts}
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
          id="products-search"
          label="Buscar producto"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          onClear={() => setSearchTerm("")}
        />

        <Select
          id="products-category-filter"
          label="Categoría"
          value={selectedCategoryId}
          options={categoryOptions}
          onChange={(event) =>
            setSelectedCategoryId(event.target.value)
          }
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div
          className="
            grid grid-cols-2 gap-3
            sm:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
            sm:gap-4
          "
        >
          {filteredProducts.map((product) => (
            <ProductAdminCard
              key={product.id}
              product={product}
              categoryName={getCategoryName(
                product.categoryId,
                sortedCategories,
              )}
              onClick={setSelectedProductId}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No se encontraron productos"
          description="Prueba con otro término de búsqueda o selecciona otra categoría."
        />
      )}

      <ProductDetailsSheet
        isOpen={Boolean(selectedProduct)}
        onClose={handleCloseDetails}
        product={selectedProduct}
        categoryName={selectedProductCategoryName}
        onToggleStatus={
          handleRequestToggleProductStatus
        }
        onEdit={handleOpenEditProduct}
      />

      <ProductDeactivateConfirmSheet
        isOpen={Boolean(productPendingDeactivation)}
        product={productPendingDeactivation}
        onClose={handleCancelProductDeactivation}
        onConfirm={handleConfirmProductDeactivation}
      />

      {isProductFormOpen &&
        (productFormMode === "create" ||
          editingProduct) && (
          <ProductFormSheet
            key={
              productFormMode === "edit"
                ? `edit-${editingProductId}`
                : "create"
            }
            isOpen={isProductFormOpen}
            onClose={handleCloseProductForm}
            categories={activeCategories}
            onSubmit={handleSubmitProductForm}
            product={editingProduct}
            mode={productFormMode}
          />
        )}

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

export default ProductsPage;