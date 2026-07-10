import PageHeader from "../../components/layout/PageHeader";

import { useOrders } from "../orders/context/useOrders";

import RecentOrders from "./components/RecentOrders";
import StatCard from "./components/StatCard";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

function calculateDashboardStats(orders) {
  const paidOrders = orders.filter(
    (order) =>
      order.status !== "CANCELADO" &&
      order.paymentStatus === "PAGADO",
  );

  const totalSales = paidOrders.reduce(
    (total, order) => total + order.total,
    0,
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDIENTE",
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "EN_PREPARACION",
  ).length;

  const readyOrders = orders.filter(
    (order) => order.status === "LISTO",
  ).length;

  const pendingPaymentsOrders = orders.filter(
    (order) =>
      order.status === "DESPACHADO" &&
      order.paymentStatus === "PENDIENTE",
  );

  const pendingPayments = pendingPaymentsOrders.reduce(
    (total, order) => total + order.total,
    0,
  );

  return [
    {
      id: "sales",
      title: "Ventas cobradas",
      value: currencyFormatter.format(totalSales),
      description: `${paidOrders.length} pedidos pagados`,
      tone: "brown",
    },
    {
      id: "pending",
      title: "Pedidos pendientes",
      value: pendingOrders,
      description: "Esperando ser tomados",
      tone: "yellow",
    },
    {
      id: "preparing",
      title: "En preparación",
      value: preparingOrders,
      description: "Pedidos trabajando en cocina",
      tone: "blue",
    },
    {
      id: "ready",
      title: "Listos",
      value: readyOrders,
      description: "Esperando ser entregados",
      tone: "green",
    },
    {
      id: "payments",
      title: "Cobros pendientes",
      value: currencyFormatter.format(pendingPayments),
      description: `${pendingPaymentsOrders.length} pedidos sin cobrar`,
      tone: "red",
    },
  ];
}

function DashboardPage() {
  const { orders } = useOrders();

  const dashboardStats = calculateDashboardStats(orders);

  const recentOrders = [...orders]
    .sort(
      (firstOrder, secondOrder) =>
        new Date(secondOrder.createdAt) -
        new Date(firstOrder.createdAt),
    )
    .slice(0, 4);

  return (
    <section className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Inicio"
        description="Resumen general de las operaciones de LR POS."
      />

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-5
        "
      >
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            tone={stat.tone}
          />
        ))}
      </div>

      <RecentOrders orders={recentOrders} />
    </section>
  );
}

export default DashboardPage;