import { useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import useStoredData from "../hooks/useStoredData";
import { keys, write } from "../services/storage";
import { money, orderTotal, unitPrice, updateCart } from "../services/shop";

export default function ManifestPage() {
  const items = useStoredData(keys.manifest),
    [error, setError] = useState("");
  function update(pn, value) {
    try {
      updateCart(pn, Number(value));
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }
  function clear() {
    if (window.confirm("¿Vaciar el manifiesto de repuestos?"))
      write(keys.manifest, []);
  }
  return (
    <>
      <div className="page-title">
        <h1>Manifiesto de repuestos</h1>
        <p className="text-secondary">
          Revisa tu carrito antes de confirmar la compra y el despacho.
        </p>
      </div>
      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}
      {!items.length && (
        <Alert variant="secondary">
          El manifiesto está vacío. Agrega componentes desde el catálogo.
        </Alert>
      )}
      <Row className="g-3">
        <Col lg={8}>
          {items.map((item) => (
            <Card className="mb-3" key={item.pn}>
              <Card.Body className="d-flex justify-content-between align-items-center responsive-stack gap-3">
                <div>
                  <h2 className="h5">{item.nombre}</h2>
                  <p>
                    {item.pn} · {item.bodega}
                  </p>
                  <p>
                    {money(unitPrice(item))} por unidad · Subtotal:{" "}
                    {money(unitPrice(item) * item.cantidad)}
                  </p>
                  {!item.certificado && (
                    <Alert variant="warning">
                      Sin certificado 8130-3 registrado.
                    </Alert>
                  )}
                </div>
                <div>
                  <Form.Label htmlFor={"cart-" + item.pn}>
                    Cantidad de {item.nombre}
                  </Form.Label>
                  <Form.Control
                    id={"cart-" + item.pn}
                    type="number"
                    min="0"
                    max={item.stock}
                    value={item.cantidad}
                    onChange={(event) => update(item.pn, event.target.value)}
                  />
                  <Button
                    variant="outline-danger"
                    className="mt-2"
                    onClick={() => update(item.pn, 0)}
                  >
                    Quitar {item.nombre}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>
        <Col lg={4}>
          <div className="panel-dark">
            <h2 className="h5">Resumen de compra</h2>
            <p>Líneas: {items.length}</p>
            <p>
              Unidades: {items.reduce((sum, item) => sum + item.cantidad, 0)}
            </p>
            <p>Entrega: sin costo adicional</p>
            <p className="fs-4">
              Total: <strong>{money(orderTotal(items))}</strong>
            </p>
            <div className="d-grid gap-2">
              <Button
                variant="outline-light"
                onClick={clear}
                disabled={!items.length}
              >
                Vaciar
              </Button>
              {items.length > 0 && (
                <Button as={Link} role="link" to="/despacho">
                  Continuar al despacho
                </Button>
              )}
              <Button
                as={Link}
                role="link"
                to="/catalogo"
                variant="outline-light"
              >
                Seguir buscando
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
