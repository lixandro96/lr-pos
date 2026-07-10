import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { mockOrders } from "../../../mocks";
import { OrdersContext } from "./orders-context";

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

function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => [
    ...mockOrders,
  ]);

  const nextOrderNumberRef = useRef(
    getHighestOrderNumber(mockOrders) + 1,
  );

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

  const updateOrderPayment = useCallback((orderId, paymentData) => {
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
  }, []);


  const value = useMemo(
    () => ({
        orders,
        createOrder,
        updateOrderStatus,
         updateOrderPayment
    }),
    [orders, createOrder, updateOrderStatus, updateOrderPayment],
  );

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export default OrdersProvider;