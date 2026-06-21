import { Link } from "react-router-dom";

function BottomNavigation() {
  return (
    <nav className="bg-white border-t">
      <div className="grid grid-cols-5">
        <Link to="/" className="p-3 text-center">
          Inicio
        </Link>

        <Link to="/orders" className="p-3 text-center">
          Pedidos
        </Link>

        <Link to="/kitchen" className="p-3 text-center">
          Cocina
        </Link>

        <Link to="/deliveries" className="p-3 text-center">
          Despacho
        </Link>

        <Link to="/more" className="p-3 text-center">
          Más
        </Link>
      </div>
    </nav>
  );
}

export default BottomNavigation;