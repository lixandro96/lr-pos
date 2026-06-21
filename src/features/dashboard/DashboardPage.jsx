import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

function DashboardPage() {

  function CrearPedido(){
    alert("Crear Pedido");
  }


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        Dashboard
      </h1>

      <Button onClick={CrearPedido}>
        Nuevo Pedido
      </Button>

      <div className="flex flex-wrap gap-2">
        <Badge status="PENDIENTE" />
        <Badge status="EN_PREPARACION" />
        <Badge status="LISTO" />
        <Badge status="DESPACHADO" />
        <Badge status="CANCELADO" />
      </div>

    </div>
  );
}

export default DashboardPage;