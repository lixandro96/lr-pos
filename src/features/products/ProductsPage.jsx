import { useState } from "react";

import PageHeader from "../../components/layout/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";

import { mockCategories } from "../../mocks";

import { useProducts } from "./context/useProducts";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

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

function getLowestVariantPrice(product) {
  const activeVariants = product.variants?.filter(
    (variant) => variant.isActive,
  );

  if (!activeVariants || activeVariants.length === 0) {
    return product.basePrice;
  }

  return Math.min(
    ...activeVariants.map((variant) => variant.price),
  );
}

function ProductAdminCard({ product, categories }) {
  const lowestPrice = getLowestVariantPrice(product);
  const activeVariants =
    product.variants?.filter((variant) => variant.isActive) ??
    [];

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
              {product.name}
            </h2>

            <span
              className={`
                rounded-full px-2.5 py-1
                text-xs font-semibold
                ${
                  product.isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }
              `}
            >
              {product.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            {getCategoryName(product.categoryId, categories)}
          </p>
        </div>

        <p className="shrink-0 font-bold text-[#6F4E37]">
          {currencyFormatter.format(lowestPrice)}
        </p>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
        {product.description}
      </p>

      <div className="mt-4 rounded-xl bg-gray-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Variantes
        </p>

        {activeVariants.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {activeVariants.map((variant) => (
              <span
                key={variant.id}
                className="
                  rounded-full bg-white px-3 py-1
                  text-xs font-medium text-gray-700
                  ring-1 ring-gray-200
                "
              >
                {variant.name} ·{" "}
                {currencyFormatter.format(variant.price)}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Sin variantes activas.
          </p>
        )}
      </div>
    </article>
  );
}

function ProductsPage() {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] =
    useState("ALL");

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

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.isActive,
  ).length;

  const inactiveProducts =
    totalProducts - activeProducts;

  return (
    <section className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Productos"
        description="Consulta y administra el catálogo de productos."
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
              categories={activeCategories}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No se encontraron productos"
          description="Prueba con otro término de búsqueda o selecciona otra categoría."
        />
      )}
    </section>
  );
}

export default ProductsPage;