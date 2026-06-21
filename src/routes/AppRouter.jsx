import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../features/dashboard/DashboardPage";
import OrdersPage from "../features/orders/OrdersPage";
import KitchenPage from "../features/kitchen/KitchenPage";
import DispatchPage from "../features/deliveries/DispatchPage";
import MorePage from "../features/more/MorePage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
          <Route path="/deliveries" element={<DispatchPage />} />
          <Route path="/more" element={<MorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;