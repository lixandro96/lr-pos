import { useContext } from "react";

import { ProductsContext } from "./products-context";

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProducts debe usarse dentro de ProductsProvider.",
    );
  }

  return context;
}