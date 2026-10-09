import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useStoredData from "../hooks/useStoredData";
import { keys, read } from "../services/storage";
import { confirmOrder, money, orderTotal } from "../services/shop";
import {
  validarLicencia,
  validarMatricula,
  validarNombreCompleto,
} from "../utils/validators";

export default function DispatchPage() {
  const navigate = useNavigate(),
    items = useStoredData(keys.manifest),
    fleet = useStoredData(keys.fleet);
  const user = read(keys.session, null);
  const [form, setForm] = useState({
    matricula: sessionStorage.getItem("skyops_u2_aeronave") || "",
    destino: "",
    ingeniero: user?.nombre || "",
    licencia: "",
    direccion: user?.direccion || "",
    entrega: "Estándar",
    autorizacion: false,
  });
  const [errors, setErrors] = useState({}),
    [payment, setPayment] = useState("aprobado"),
    [busy, setBusy] = useState(false);
  function change(event) {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }
  function fieldError(name, value) {
    if (name === "matricula" && !validarMatricula(value))
      return "Formato requerido: CC- y tres letras.";
    if (name === "ingeniero" && !validarNombreCompleto(value))
      return "Ingresa nombre y apellido.";
    if (name === "licencia" && !validarLicencia(value))
      return "Formato requerido: LE-3401.";
    if ((name === "destino" || name === "direccion") && !value.trim())
      return "Completa este campo.";
    if (name === "autorizacion" && !value)
      return "Debes confirmar la declaración.";
    return "";
  }
  function blur(event) {
    const { name, value } = event.target;
    setErrors({ ...errors, [name]: fieldError(name, value) });
  }
  function submit(event) {
    event.preventDefault();
    if (busy) return;
    const next = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, fieldError(key, value)]),
    );
    if (!items.length)
      next.general = "No puedes comprar con el manifiesto vacío.";
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    setBusy(true);
    try {
      const order = confirmOrder(form, payment);
      navigate("/compra/exitosa/" + order.id, { replace: true });
    } catch (error) {
      navigate("/compra/error", { state: { message: error.message } });
    } finally {
      setBusy(false);
    }
  }
  const fields = [
    ["matricula", "Matrícula de aeronave"],
    ["ingeniero", "Ingeniero responsable"],
    ["licencia", "Licencia"],
    ["direccion", "Dirección de entrega"],
  ];
  return (
    <>
      <div className="page-title">
        <h1>Compra y despacho AOG</h1>
        <p className="text-secondary">
          Confirma los datos de entrega y autoriza la orden.
        </p>
      </div>
      {!items.length && (
        <Alert variant="warning">
          El manifiesto está vacío. Vuelve al catálogo antes de autorizar.
        </Alert>
      )}
      {errors.general && <Alert variant="danger">{errors.general}</Alert>}
      {user && (
        <Alert variant="info">
          Nombre y dirección completados desde tu perfil.
        </Alert>
      )}
      <p className="fs-4">
        Total de la orden: <strong>{money(orderTotal(items))}</strong>
      </p>
      <Form onSubmit={submit} noValidate className="panel-dark">
        <Row className="g-3">
          {fields.map(([name, label]) => (
            <Col md={6} key={name}>
              <Form.Group controlId={"checkout-" + name}>
                <Form.Label>{label} *</Form.Label>
                <Form.Control
                  name={name}
                  value={form[name]}
                  onChange={change}
                  onBlur={blur}
                  isInvalid={!!errors[name]}
                  list={name === "matricula" ? "fleet-list" : undefined}
                />
                <Form.Control.Feedback type="invalid">
                  {errors[name]}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          ))}
          <datalist id="fleet-list">
            {fleet.map((item) => (
              <option key={item.matricula} value={item.matricula} />
            ))}
          </datalist>
          <Col md={6}>
            <Form.Group controlId="checkout-destino">
              <Form.Label>Puerta o hangar *</Form.Label>
              <Form.Select
                name="destino"
                value={form.destino}
                onChange={change}
                onBlur={blur}
                isInvalid={!!errors.destino}
              >
                <option value="">Selecciona...</option>
                {[
                  "Puerta 9",
                  "Puerta 14",
                  "Hangar 1",
                  "Hangar 2",
                  "Plataforma Remota 1",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.destino}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="checkout-entrega">
              <Form.Label>Modalidad de entrega</Form.Label>
              <Form.Select
                name="entrega"
                value={form.entrega}
                onChange={change}
              >
                <option>Estándar</option>
                <option>Urgencia AOG</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="checkout-payment">
              <Form.Label>Resultado del pago de demostración</Form.Label>
              <Form.Select
                value={payment}
                onChange={(event) => setPayment(event.target.value)}
              >
                <option value="aprobado">Pago aprobado</option>
                <option value="rechazado">Pago rechazado</option>
              </Form.Select>
              <Form.Text className="text-light">
                Simulación académica: no se realizan cobros.
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Form.Check
          className="my-3"
          id="checkout-authorization"
          name="autorizacion"
          checked={form.autorizacion}
          onChange={change}
          label="Declaro que la información es correcta y autorizo el despacho."
          isInvalid={!!errors.autorizacion}
          feedback={errors.autorizacion}
        />
        <Button type="submit" disabled={!items.length || busy}>
          Confirmar compra y despacho
        </Button>
      </Form>
    </>
  );
}
