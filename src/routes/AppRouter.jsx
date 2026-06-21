import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../features/dashboard/DashboardPage";
import OrdersPage from "../features/orders/OrdersPage";
import DeliveriesPage from "../features/deliveries/DeliveriesPage";
import MorePage from "../features/more/MorePage";
import PaymentsPage from "../features/payments/PaymentsPage";
import KitchenPage from "../features/kitchen/KitchenPage";
import ProductsPage from "../features/products/ProductsPage";
import CategoriesPage from "../features/categories/CategoriesPage";
import ClientsPage from "../features/clients/ClientsPage";
import UsersPage from "../features/users/UsersPage";
import ReportsPage from "../features/reports/ReportsPage";
import SettingsPage from "../features/settings/SettingsPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="kitchen" element={<KitchenPage />} />
          <Route path="deliveries" element={<DeliveriesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="more" element={<MorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;