import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { validarCorreo, validarNombreCompleto } from "../utils/validators";

export default function ContactPage() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    aeropuerto: "",
    tipo: "",
    mensaje: "",
    consentimiento: false,
  });
  const [errors, setErrors] = useState({}),
    [sent, setSent] = useState("");
  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }
  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!validarNombreCompleto(form.nombre))
      next.nombre = "Ingresa nombre y apellido.";
    if (!validarCorreo(form.correo)) next.correo = "Ingresa un correo válido.";
    if (form.aeropuerto.trim().length < 3 || form.aeropuerto.trim().length > 4)
      next.aeropuerto = "Usa código IATA/OACI de 3 o 4 letras.";
    if (!form.tipo) next.tipo = "Selecciona el tipo de solicitud.";
    if (form.mensaje.trim().length < 20 || form.mensaje.length > 500)
      next.mensaje = "El mensaje debe tener entre 20 y 500 caracteres.";
    if (!form.consentimiento)
      next.consentimiento = "Debes autorizar el contacto.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSent("SOP-" + Math.floor(1000 + Math.random() * 9000));
    setForm({
      nombre: "",
      correo: "",
      aeropuerto: "",
      tipo: "",
      mensaje: "",
      consentimiento: false,
    });
  }
  return (
    <>
      <div className="page-title">
        <h1>Contacto</h1>
        <p className="text-secondary">
          Formulario controlado en React con validación.
        </p>
      </div>
      {sent && (
        <Alert variant="success">
          Solicitud de demostración registrada. Ticket: <strong>{sent}</strong>
        </Alert>
      )}
      <Form onSubmit={submit} noValidate className="panel-dark">
        <div className="row g-3">
          <Form.Group className="col-md-6" controlId="contact-nombre">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              name="nombre"
              value={form.nombre}
              onChange={change}
              isInvalid={!!errors.nombre}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col-md-6" controlId="contact-correo">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              name="correo"
              type="email"
              value={form.correo}
              onChange={change}
              isInvalid={!!errors.correo}
            />
            <Form.Control.Feedback type="invalid">
              {errors.correo}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col-md-6" controlId="contact-aeropuerto">
            <Form.Label>Aeropuerto base</Form.Label>
            <Form.Control
              name="aeropuerto"
              value={form.aeropuerto}
              onChange={change}
              isInvalid={!!errors.aeropuerto}
            />
            <Form.Control.Feedback type="invalid">
              {errors.aeropuerto}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col-md-6" controlId="contact-tipo">
            <Form.Label>Tipo de solicitud</Form.Label>
            <Form.Select
              name="tipo"
              value={form.tipo}
              onChange={change}
              isInvalid={!!errors.tipo}
            >
              <option value="">Selecciona...</option>
              <option>Soporte operativo</option>
              <option>Incidente crítico</option>
              <option>Consulta general</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.tipo}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="col-12" controlId="contact-mensaje">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="mensaje"
              value={form.mensaje}
              onChange={change}
              isInvalid={!!errors.mensaje}
            />
            <div className="small text-secondary mt-1">
              {form.mensaje.length} / 500
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.mensaje}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <Form.Check
          className="my-3"
          id="contact-consent"
          name="consentimiento"
          checked={form.consentimiento}
          onChange={change}
          label="Autorizo el contacto por correo."
          isInvalid={!!errors.consentimiento}
          feedback={errors.consentimiento}
        />
        <Button type="submit">Enviar solicitud</Button>
      </Form>
    </>
  );
}
