import { Outlet } from "react-router-dom";

import AppHeader from "../components/layout/AppHeader";
import BottomNavigation from "../components/layout/BottomNavigation";
import DesktopSidebar from "../components/layout/DesktopSidebar";
import DesktopTopbar from "../components/layout/DesktopTopbar";

function MainLayout() {
  return (
    <div className="min-h-dvh bg-gray-50 lg:pl-64">
      <DesktopSidebar />

      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <DesktopTopbar />`
        <main
          className="
            flex-1
            pb-[calc(5rem+env(safe-area-inset-bottom))]
            lg:pb-0
          "
        >
          <Outlet />
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}

export default MainLayout;