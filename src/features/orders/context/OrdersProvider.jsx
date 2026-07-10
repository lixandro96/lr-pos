import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { mockOrders } from "../../../mocks";
import { OrdersContext } from "./orders-context";

const ORDERS_STORAGE_KEY = "lr-pos-orders";

function getHighestOrderNumber(orders) {
  return orders.reduce((highestNumber, order) => {
    const numericPart = Number(
      String(order.number ?? "").replace(/\D/g, ""),
    );

    if (Number.isNaN(numericPart)) {
      return highestNumber;
    }

    return Math.max(highestNumber, numericPart);
  }, 0);
}

function formatOrderNumber(orderNumber) {
  return `#${String(orderNumber).padStart(4, "0")}`;
}

function createOrderId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return `order-${crypto.randomUUID()}`;
  }

  return `order-${Date.now()}`;
}

function buildCreatedOrder(orderDraft, orderNumber) {
  return {
    id: createOrderId(),
    number: formatOrderNumber(orderNumber),
    type: orderDraft.orderType,
    status: "PENDIENTE",
    paymentStatus: orderDraft.paymentStatus,
    paymentMethod: orderDraft.paymentMethod,
    total: orderDraft.total,
    totalQuantity: orderDraft.totalQuantity,
    createdAt: new Date().toISOString(),
    clientId: orderDraft.clientId,
    deliveryAddress: orderDraft.deliveryAddress,
    items: orderDraft.items,
  };
}

function loadOrdersFromStorage() {
  if (typeof window === "undefined") {
    return [...mockOrders];
  }

  try {
    const storedOrders = window.localStorage.getItem(
      ORDERS_STORAGE_KEY,
    );

    if (!storedOrders) {
      return [...mockOrders];
    }

    const parsedOrders = JSON.parse(storedOrders);

    if (!Array.isArray(parsedOrders)) {
      return [...mockOrders];
    }

    return parsedOrders;
  } catch (error) {
    console.error(
      "No se pudieron cargar los pedidos desde localStorage:",
      error,
    );

    return [...mockOrders];
  }
}

function saveOrdersToStorage(orders) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify(orders),
    );
  } catch (error) {
    console.error(
      "No se pudieron guardar los pedidos en localStorage:",
      error,
    );
  }
}

function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() =>
    loadOrdersFromStorage(),
  );

  const nextOrderNumberRef = useRef(
    getHighestOrderNumber(orders) + 1,
  );

  useEffect(() => {
    saveOrdersToStorage(orders);
  }, [orders]);

  const createOrder = useCallback((orderDraft) => {
    const orderNumber = nextOrderNumberRef.current;
    nextOrderNumberRef.current += 1;

    const createdOrder = buildCreatedOrder(
      orderDraft,
      orderNumber,
    );

    setOrders((currentOrders) => [
      createdOrder,
      ...currentOrders,
    ]);

    return createdOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        return {
          ...order,
          status,
        };
      }),
    );
  }, []);

  const updateOrderPayment = useCallback(
    (orderId, paymentData) => {
      setOrders((currentOrders) =>
        currentOrders.map((order) => {
          if (order.id !== orderId) {
            return order;
          }

          return {
            ...order,
            ...paymentData,
          };
        }),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      orders,
      createOrder,
      updateOrderStatus,
      updateOrderPayment,
    }),
    [
      orders,
      createOrder,
      updateOrderStatus,
      updateOrderPayment,
    ],
  );

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export default OrdersProvider;