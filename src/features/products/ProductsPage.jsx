import { useState } from "react";

import PageHeader from "../../components/layout/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";

import { mockCategories } from "../../mocks";

import ProductAdminCard from "./components/ProductAdminCard";
import ProductDetailsSheet from "./components/ProductDetailsSheet";
import { useProducts } from "./context/useProducts";
import ProductDeactivateConfirmSheet from "./components/ProductDeactivateConfirmSheet";

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
    toggleProductStatus,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] =
    useState("ALL");
  const [selectedProductId, setSelectedProductId] =
    useState(null);
    const [
  productPendingDeactivation,
  setProductPendingDeactivation,
] = useState(null);

  const activeCategories = [...mockCategories]
    .filter((category) => category.isActive)
    .sort(
      (firstCategory, secondCategory) =>
        firstCategory.sortOrder -
        secondCategory.sortOrder,
    );

  const categoryOptions = [
    {
      value: "ALL",
      label: "Todas las categorías",
    },
    ...activeCategories.map((category) => ({
      value: category.id,
      label: category.name,
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

      return (
        (firstProduct.sortOrder ??
          Number.MAX_SAFE_INTEGER) -
        (secondProduct.sortOrder ??
          Number.MAX_SAFE_INTEGER)
      );
    });

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  const selectedProductCategoryName = selectedProduct
    ? getCategoryName(
        selectedProduct.categoryId,
        activeCategories,
      )
    : "";

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.isActive,
  ).length;

  const inactiveProducts =
    totalProducts - activeProducts;

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
  }

  function handleCancelProductDeactivation() {
    setProductPendingDeactivation(null);
  }

  function handleConfirmProductDeactivation(productId) {
    toggleProductStatus(productId);
    setProductPendingDeactivation(null);
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Productos"
        description="Administra el catálogo de productos."
      />

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
                activeCategories,
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
        onToggleStatus={handleRequestToggleProductStatus}
      />

      <ProductDeactivateConfirmSheet
        isOpen={Boolean(productPendingDeactivation)}
        product={productPendingDeactivation}
        onClose={handleCancelProductDeactivation}
        onConfirm={handleConfirmProductDeactivation}
      />
    </section>
  );
}

export default ProductsPage;