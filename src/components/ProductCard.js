import { useState } from "react";
import { Alert, Badge, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { money, unitPrice } from "../services/shop";

export default function ProductCard({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  function add() {
    try {
      onAdd(product.pn, quantity);
      setMessage("Componente agregado al manifiesto.");
      setError("");
    } catch (error) {
      setError(error.message);
      setMessage("");
    }
  }
  return (
    <Card className="h-100 component-card">
      <Card.Img
        variant="top"
        src={product.imagen || "/assets/img/actuador-tren.svg"}
        alt={product.nombre}
        className="product-image"
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h2" className="h5">
          {product.nombre}
        </Card.Title>
        <p className="small text-secondary">
          {product.pn} · {product.sn}
          <br />
          {product.ata}
          <br />
          {product.bodega}
        </p>
        <p>
          <Badge bg={product.stock ? "success" : "secondary"}>
            Stock {product.stock}
          </Badge>{" "}
          <Badge bg={product.certificado ? "info" : "warning"} text="dark">
            {product.certificado ? "8130-3 OK" : "Sin 8130-3"}
          </Badge>
        </p>
        <p className="fs-5 fw-bold">
          {money(unitPrice(product))}{" "}
          {product.descuento > 0 && (
            <>
              <del className="small text-secondary">
                {money(product.precio)}
              </del>{" "}
              <Badge bg="danger">-{product.descuento}%</Badge>
            </>
          )}
        </p>
        <Form.Label htmlFor={"quantity-" + product.pn}>
          Cantidad de {product.nombre}
        </Form.Label>
        <Form.Control
          id={"quantity-" + product.pn}
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
        <div className="d-grid gap-2 mt-3">
          <Button disabled={product.stock < 1} onClick={add}>
            Agregar al manifiesto
          </Button>
          <Button
            as={Link}
            role="link"
            variant="outline-primary"
            to={"/catalogo/" + product.pn}
          >
            Ver detalle
          </Button>
        </div>
        {message && (
          <Alert variant="success" role="status" className="mt-2">
            {message}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" role="alert" className="mt-2">
            {error}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}
