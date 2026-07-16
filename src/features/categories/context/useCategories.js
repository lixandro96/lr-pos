import { useContext } from "react";

import { CategoriesContext } from "./categories-context";

export function useCategories() {
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error(
      "useCategories debe usarse dentro de CategoriesProvider.",
    );
  }

  return context;
}