import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signIn, signUp, updateUser } from "../services/auth";
import { keys } from "../services/storage";
import useStoredData from "../hooks/useStoredData";

export function AccountPage({ register = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
      nombre: "",
      email: "",
      password: "",
      direccion: "",
    }),
    [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    try {
      register ? signUp(form) : signIn(form.email, form.password);
      navigate("/perfil");
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <>
      <h1>{register ? "Registro de usuario" : "Iniciar sesión"}</h1>
      <p>Cuenta de demostración para el proyecto académico.</p>
      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}
      <Form onSubmit={submit} className="account-form" noValidate>
        {(register
          ? ["nombre", "email", "password", "direccion"]
          : ["email", "password"]
        ).map((name) => (
          <Form.Group controlId={"account-" + name} className="mb-3" key={name}>
            <Form.Label>
              {
                {
                  nombre: "Nombre completo",
                  email: "Correo electrónico",
                  password: "Contraseña",
                  direccion: "Dirección de entrega",
                }[name]
              }
            </Form.Label>
            <Form.Control
              type={
                name === "password"
                  ? "password"
                  : name === "email"
                    ? "email"
                    : "text"
              }
              autoComplete={
                name === "password"
                  ? register
                    ? "new-password"
                    : "current-password"
                  : undefined
              }
              value={form[name]}
              onChange={(event) =>
                setForm({ ...form, [name]: event.target.value })
              }
            />
          </Form.Group>
        ))}
        <Button type="submit">{register ? "Crear cuenta" : "Entrar"}</Button>
      </Form>
      <p className="mt-3">
        <Link to={register ? "/login" : "/registro"}>
          {register ? "Ya tengo una cuenta" : "Registrarme"}
        </Link>
      </p>
    </>
  );
}
export function ProfilePage() {
  const user = useStoredData(keys.session, null);
  const [form, setForm] = useState(() => ({
      nombre: user?.nombre || "",
      direccion: user?.direccion || "",
    })),
    [message, setMessage] = useState("");
  if (!user) return <Navigate to="/login" replace />;
  function submit(event) {
    event.preventDefault();
    try {
      updateUser(user.id, form);
      setMessage("Perfil actualizado.");
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <>
      <h1>Mi perfil</h1>
      <p>
        {user.email} · {user.rol}
      </p>
      {message && <Alert role="status">{message}</Alert>}
      <Form onSubmit={submit} className="account-form">
        {["nombre", "direccion"].map((name) => (
          <Form.Group controlId={"profile-" + name} className="mb-3" key={name}>
            <Form.Label>
              {name === "nombre" ? "Nombre completo" : "Dirección de entrega"}
            </Form.Label>
            <Form.Control
              value={form[name]}
              onChange={(event) =>
                setForm({ ...form, [name]: event.target.value })
              }
            />
          </Form.Group>
        ))}
        <Button type="submit">Guardar perfil</Button>
      </Form>
      <p className="mt-3">
        <Link to="/pedidos">Ver mis pedidos</Link>
      </p>
    </>
  );
}
