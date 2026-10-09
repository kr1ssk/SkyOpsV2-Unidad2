import { Alert, Button, Table } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import useStoredData from "../hooks/useStoredData";
import { keys } from "../services/storage";
import { money, unitPrice } from "../services/shop";

export function Receipt({ order }) {
  return (
    <>
      <h2 className="h4">Comprobante {order.folio}</h2>
      <p>Fecha: {new Date(order.fecha).toLocaleString("es-CL")}</p>
      <p>
        Responsable: {order.ingeniero} · Aeronave: {order.matricula}
      </p>
      <p>
        Entrega: {order.direccion} · {order.destino} · {order.entrega}
      </p>
      <div className="table-responsive">
        <Table striped>
          <thead>
            <tr>
              <th>Componente</th>
              <th>P/N</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.pn}>
                <td>{item.nombre}</td>
                <td>{item.pn}</td>
                <td>{item.cantidad}</td>
                <td>{money(unitPrice(item) * item.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <p className="fs-4">Total: {money(order.total)}</p>
      <p>
        Comprobante académico de pago simulado; no es una boleta tributaria.
      </p>
    </>
  );
}
export function SuccessPage() {
  const { id } = useParams(),
    order = useStoredData(keys.orders).find((item) => item.id === id);
  if (!order)
    return (
      <>
        <h1>Orden no encontrada</h1>
        <Link to="/catalogo">Volver al catálogo</Link>
      </>
    );
  return (
    <>
      <h1>Compra exitosa</h1>
      <Alert variant="success">
        Pago simulado aprobado. Tu orden fue registrada y el stock se actualizó.
      </Alert>
      <Receipt order={order} />
      <div className="mt-3">
        <Button as={Link} role="link" to="/bitacora">
          Ver bitácora
        </Button>
      </div>
    </>
  );
}
export function ErrorPage() {
  const { state } = useLocation();
  return (
    <>
      <h1>No se pudo completar la compra</h1>
      <Alert variant="danger">
        {state?.message || "Revisa tu orden y vuelve a intentar."}
      </Alert>
      <p>El manifiesto se conserva para que puedas corregirlo.</p>
      <Button as={Link} role="link" to="/despacho">
        Volver al despacho
      </Button>{" "}
      <Button as={Link} role="link" to="/manifiesto" variant="outline-primary">
        Revisar manifiesto
      </Button>
    </>
  );
}
export function OrdersPage() {
  const user = useStoredData(keys.session, null),
    orders = useStoredData(keys.orders);
  if (!user)
    return (
      <>
        <h1>Mis pedidos</h1>
        <Link to="/login">Inicia sesión para consultar tus pedidos.</Link>
      </>
    );
  return (
    <>
      <h1>Mis pedidos</h1>
      {orders
        .filter((order) => order.usuarioId === user.id)
        .map((order) => (
          <div className="border rounded p-3 my-3" key={order.id}>
            <Link to={"/compra/exitosa/" + order.id}>{order.folio}</Link>
            <p>
              {money(order.total)} · {order.estado}
            </p>
          </div>
        ))}
      {!orders.some((order) => order.usuarioId === user.id) && (
        <p>Todavía no tienes pedidos.</p>
      )}
    </>
  );
}
