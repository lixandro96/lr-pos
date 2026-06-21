import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../features/dashboard/DashboardPage";
import OrdersPage from "../features/orders/OrdersPage";
import DeliveriesPage  from "../features/deliveries/DeliveriesPage";
import MorePage from "../features/more/MorePage";
import PaymentsPage from "../features/payments/PaymentsPage";
import KitchenPage from "../features/kitchen/KitchenPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="kitchen" element={<KitchenPage />} />
          <Route path="deliveries" element={<DeliveriesPage  />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="more" element={<MorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;