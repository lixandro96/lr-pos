import { useContext } from "react";

import { OrdersContext } from "./orders-context";

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error(
      "useOrders debe usarse dentro de OrdersProvider.",
    );
  }

  return context;
}