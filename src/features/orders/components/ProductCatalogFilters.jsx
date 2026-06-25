import SearchInput from "../../../components/ui/SearchInput";

function ProductCatalogFilters({
  searchTerm,
  onSearchChange,
  onClearSearch,
  categories = [],
  selectedCategoryId = "ALL",
  onCategoryChange,
}) {
  return (
    <div className="space-y-4">
      <SearchInput
        id="product-search"
        label="Buscar productos"
        placeholder="Buscar por nombre o descripción..."
        value={searchTerm}
        onChange={onSearchChange}
        onClear={onClearSearch}
      />

      <div
        className="
          flex gap-2 overflow-x-auto pb-1
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
        aria-label="Filtrar productos por categoría"
      >
        <button
          type="button"
          aria-pressed={selectedCategoryId === "ALL"}
          onClick={() => onCategoryChange("ALL")}
          className={`
            shrink-0 rounded-full border
            px-4 py-2 text-sm font-medium
            transition-colors
            ${
              selectedCategoryId === "ALL"
                ? "border-[#6F4E37] bg-[#6F4E37] text-white"
                : `
                    border-gray-300 bg-white text-gray-700
                    hover:border-[#6F4E37]/50
                    hover:text-[#6F4E37]
                  `
            }
          `}
        >
          Todos
        </button>

        {categories.map((category) => {
          const isSelected =
            selectedCategoryId === category.id;

          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                onCategoryChange(category.id)
              }
              className={`
                shrink-0 rounded-full border
                px-4 py-2 text-sm font-medium
                transition-colors
                ${
                  isSelected
                    ? "border-[#6F4E37] bg-[#6F4E37] text-white"
                    : `
                        border-gray-300 bg-white text-gray-700
                        hover:border-[#6F4E37]/50
                        hover:text-[#6F4E37]
                      `
                }
              `}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProductCatalogFilters;  