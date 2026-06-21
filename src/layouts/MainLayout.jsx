import { Outlet } from "react-router-dom";
import AppHeader from "../components/navigation/AppHeader";
import BottomNavigation from "../components/navigation/BottomNavigation";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AppHeader />

      <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))]
        md:pb-0">
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  );
}

export default MainLayout;