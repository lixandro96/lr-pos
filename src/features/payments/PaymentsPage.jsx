function PaymentsPage() {
  return (
    <section className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Cobros Delivery
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Pedidos entregados que todavía están pendientes de cobro.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">
          No hay cobros pendientes.
        </p>
      </div>
    </section>
  );
}

export default PaymentsPage;