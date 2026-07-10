import PageHeader from "../../components/layout/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

import { useOrders } from "../orders/context/useOrders";

const currencyFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
});

const numberFormatter = new Intl.NumberFormat("es-DO");

const orderTypeLabels = {
  MOSTRADOR: "Mostrador",
  DELIVERY: "Delivery",
};

const paymentMethodLabels = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  PENDING_PAYMENT: "Pendiente de cobro",
};

const statusLabels = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  LISTO: "Listo",
  DESPACHADO: "Despachado",
  CANCELADO: "Cancelado",
};

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function getSafeTotal(value) {
  return Number(value ?? 0);
}

function MetricCard({ title, value, description }) {
  return (
    <article
      className="
        rounded-2xl border border-gray-200
        bg-white p-5 shadow-sm
      "
    >
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-3 text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </article>
  );
}

function ReportSection({ title, description, children }) {
  return (
    <section
      className="
        rounded-2xl border border-gray-200
        bg-white p-5 shadow-sm
      "
    >
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function SummaryRows({ rows, valueType = "currency" }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title="Sin datos disponibles"
        description="Cuando existan pedidos relacionados, aparecerán aquí."
      />
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {rows.map((row) => (
        <div
          key={row.id}
          className="
            flex items-center justify-between
            gap-4 py-3
          "
        >
          <div>
            <p className="font-medium text-gray-900">
              {row.label}
            </p>

            <p className="mt-0.5 text-sm text-gray-500">
              {row.count} pedidos
            </p>
          </div>

          <p className="font-bold text-[#6F4E37]">
            {valueType === "currency"
              ? formatCurrency(row.total)
              : numberFormatter.format(row.total)}
          </p>
        </div>
      ))}
    </div>
  );
}

function TopProductsList({ products }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Sin productos vendidos"
        description="Cuando se creen pedidos, podrás ver los productos más vendidos."
      />
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="
            flex items-center justify-between
            gap-4 py-3
          "
        >
          <div className="flex items-center gap-3">
            <span
              className="
                flex h-8 w-8 items-center
                justify-center rounded-full
                bg-[#6F4E37]/10 text-sm
                font-bold text-[#6F4E37]
              "
            >
              {index + 1}
            </span>

            <div>
              <p className="font-medium text-gray-900">
                {product.name}
              </p>

              {product.variantName && (
                <p className="mt-0.5 text-sm text-gray-500">
                  {product.variantName}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold text-gray-900">
              {numberFormatter.format(product.quantity)}
            </p>

            <p className="text-sm text-gray-500">
              {formatCurrency(product.total)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function buildGroupedSummary({
  orders,
  getKey,
  getLabel,
}) {
  const summary = new Map();

  orders.forEach((order) => {
    const key = getKey(order);
    const currentItem = summary.get(key) ?? {
      id: key,
      label: getLabel(key),
      count: 0,
      total: 0,
    };

    summary.set(key, {
      ...currentItem,
      count: currentItem.count + 1,
      total:
        currentItem.total +
        getSafeTotal(order.total),
    });
  });

  return [...summary.values()].sort(
    (firstItem, secondItem) =>
      secondItem.total - firstItem.total,
  );
}

function buildTopProducts(orders) {
  const productsSummary = new Map();

  orders.forEach((order) => {
    order.items?.forEach((item) => {
      const productKey = [
        item.productId,
        item.variantId ?? "base",
      ].join("::");

      const currentProduct =
        productsSummary.get(productKey) ?? {
          id: productKey,
          name: item.name,
          variantName: item.variantName,
          quantity: 0,
          total: 0,
        };

      productsSummary.set(productKey, {
        ...currentProduct,
        quantity:
          currentProduct.quantity +
          getSafeTotal(item.quantity),
        total:
          currentProduct.total +
          getSafeTotal(item.subtotal),
      });
    });
  });

  return [...productsSummary.values()]
    .sort((firstProduct, secondProduct) => {
      const quantityDifference =
        secondProduct.quantity -
        firstProduct.quantity;

      if (quantityDifference !== 0) {
        return quantityDifference;
      }

      return secondProduct.total - firstProduct.total;
    })
    .slice(0, 5);
}

function calculateReports(orders) {
  const validOrders = orders.filter(
    (order) => order.status !== "CANCELADO",
  );

  const paidOrders = validOrders.filter(
    (order) => order.paymentStatus === "PAGADO",
  );

  const pendingPaymentOrders = validOrders.filter(
    (order) => order.paymentStatus === "PENDIENTE",
  );

  const totalSales = paidOrders.reduce(
    (total, order) => total + getSafeTotal(order.total),
    0,
  );

  const pendingPaymentsTotal =
    pendingPaymentOrders.reduce(
      (total, order) =>
        total + getSafeTotal(order.total),
      0,
    );

  const averageTicket =
    paidOrders.length > 0
      ? totalSales / paidOrders.length
      : 0;

  const salesByOrderType = buildGroupedSummary({
    orders: paidOrders,
    getKey: (order) => order.type ?? "UNKNOWN",
    getLabel: (key) =>
      orderTypeLabels[key] ?? "No especificado",
  });

  const salesByPaymentMethod = buildGroupedSummary({
    orders: paidOrders,
    getKey: (order) =>
      order.paymentMethod ?? "UNKNOWN",
    getLabel: (key) =>
      paymentMethodLabels[key] ??
      "No especificado",
  });

  const ordersByStatus = buildGroupedSummary({
    orders: validOrders,
    getKey: (order) =>
      order.status ?? "UNKNOWN",
    getLabel: (key) =>
      statusLabels[key] ?? "No especificado",
  });

  const topProducts = buildTopProducts(validOrders);

  return {
    totalSales,
    paidOrdersCount: paidOrders.length,
    totalOrdersCount: validOrders.length,
    pendingPaymentsTotal,
    pendingPaymentOrdersCount:
      pendingPaymentOrders.length,
    averageTicket,
    salesByOrderType,
    salesByPaymentMethod,
    ordersByStatus,
    topProducts,
  };
}

function ReportsPage() {
  const { orders } = useOrders();

  const reports = calculateReports(orders);

  return (
    <section className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Reportes"
        description="Analiza ventas, cobros, pedidos y productos vendidos."
      />

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <MetricCard
          title="Ventas cobradas"
          value={formatCurrency(reports.totalSales)}
          description={`${reports.paidOrdersCount} pedidos pagados`}
        />

        <MetricCard
          title="Ticket promedio"
          value={formatCurrency(reports.averageTicket)}
          description="Promedio por pedido pagado"
        />

        <MetricCard
          title="Cobros pendientes"
          value={formatCurrency(
            reports.pendingPaymentsTotal,
          )}
          description={`${reports.pendingPaymentOrdersCount} pedidos sin cobrar`}
        />

        <MetricCard
          title="Pedidos registrados"
          value={numberFormatter.format(
            reports.totalOrdersCount,
          )}
          description="Pedidos no cancelados"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportSection
          title="Ventas por tipo de pedido"
          description="Comparación entre mostrador y delivery."
        >
          <SummaryRows rows={reports.salesByOrderType} />
        </ReportSection>

        <ReportSection
          title="Ventas por método de pago"
          description="Solo toma en cuenta pedidos pagados."
        >
          <SummaryRows
            rows={reports.salesByPaymentMethod}
          />
        </ReportSection>

        <ReportSection
          title="Estado de pedidos"
          description="Cantidad y monto acumulado por estado operativo."
        >
          <SummaryRows rows={reports.ordersByStatus} />
        </ReportSection>

        <ReportSection
          title="Productos más vendidos"
          description="Ranking por cantidad vendida."
        >
          <TopProductsList
            products={reports.topProducts}
          />
        </ReportSection>
      </div>
    </section>
  );
}

export default ReportsPage;