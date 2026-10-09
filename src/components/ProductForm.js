import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";

export const emptyProduct = {
  nombre: "",
  pn: "",
  sn: "",
  ata: "",
  bodega: "",
  categoria: "",
  stock: 0,
  precio: 0,
  descuento: 0,
  certificado: false,
  imagen: "/assets/img/actuador-tren.svg",
};
export default function ProductForm({
  initial = emptyProduct,
  categories,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState({ ...initial }),
    [error, setError] = useState("");
  function change(event) {
    const { name, type, value, checked } = event.target;
    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    });
  }
  function submit(event) {
    event.preventDefault();
    try {
      onSave({
        ...form,
        nombre: form.nombre.trim(),
        pn: form.pn.trim().toUpperCase(),
      });
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <Form onSubmit={submit} noValidate className="border rounded p-3 mb-4">
      <h2 className="h4">
        {initial.pn ? "Editar componente" : "Nuevo componente"}
      </h2>
      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}
      <Row className="g-3">
        {[
          ["nombre", "Nombre"],
          ["pn", "P/N"],
          ["sn", "S/N"],
          ["ata", "Capítulo ATA"],
          ["bodega", "Bodega"],
          ["stock", "Stock"],
          ["precio", "Precio CLP"],
          ["descuento", "Descuento %"],
        ].map(([name, label]) => (
          <Col md={6} key={name}>
            <Form.Group controlId={"product-" + name}>
              <Form.Label>{label}</Form.Label>
              <Form.Control
                name={name}
                type={
                  ["stock", "precio", "descuento"].includes(name)
                    ? "number"
                    : "text"
                }
                value={form[name]}
                min="0"
                disabled={name === "pn" && !!initial.pn}
                onChange={change}
              />
            </Form.Group>
          </Col>
        ))}
        <Col md={6}>
          <Form.Group controlId="product-category">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={form.categoria}
              onChange={change}
            >
              <option value="">Selecciona...</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="product-image">
            <Form.Label>Imagen del componente</Form.Label>
            <Form.Select name="imagen" value={form.imagen} onChange={change}>
              <option value="/assets/img/actuador-superficie.svg">
                Actuador de superficie
              </option>
              <option value="/assets/img/actuador-tren.svg">
                Actuador de tren
              </option>
              <option value="/assets/img/alabe-turbina.svg">
                Álabe de turbina
              </option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Form.Check
        id="product-certificate"
        name="certificado"
        label="Certificado 8130-3 registrado"
        checked={form.certificado}
        onChange={change}
        className="my-3"
      />
      <Button type="submit">Guardar componente</Button>{" "}
      <Button variant="outline-secondary" onClick={onCancel}>
        Cancelar
      </Button>
    </Form>
  );
}
