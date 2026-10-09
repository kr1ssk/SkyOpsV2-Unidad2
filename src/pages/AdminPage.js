import { useState } from "react";
import { Alert, Button, Col, Form, Row, Table } from "react-bootstrap";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import useStoredData from "../hooks/useStoredData";
import { keys, write } from "../services/storage";
import {
  deleteCategory,
  deleteProduct,
  money,
  saveCategory,
  saveProduct,
} from "../services/shop";
import { updateUser } from "../services/auth";
import { Receipt } from "./OrderPages";

export default function AdminPage() {
  const user = useStoredData(keys.session, null),
    catalog = useStoredData(keys.catalog),
    categories = useStoredData(keys.categories),
    orders = useStoredData(keys.orders),
    users = useStoredData(keys.users);
  const [params, setParams] = useSearchParams(),
    tab = params.get("vista") || "resumen";
  const [editing, setEditing] = useState(null),
    [category, setCategory] = useState(""),
    [originalCategory, setOriginalCategory] = useState(null),
    [message, setMessage] = useState(""),
    [receipt, setReceipt] = useState(null),
    [editingUser, setEditingUser] = useState(null);
  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== "admin")
    return (
      <>
        <h1>Acceso restringido</h1>
        <p>Esta sección es para el administrador de demostración.</p>
        <Link to="/catalogo">Volver al catálogo</Link>
      </>
    );
  function act(action) {
    try {
      action();
      setMessage("Cambios guardados.");
    } catch (error) {
      setMessage(error.message);
    }
  }
  function removeProduct(product) {
    if (window.confirm("¿Eliminar " + product.nombre + "?"))
      act(() => deleteProduct(product.pn));
  }
  function save(product) {
    saveProduct(product, editing?.pn || null);
    setEditing(null);
    setMessage("Componente guardado.");
  }
  function saveCat(event) {
    event.preventDefault();
    act(() => {
      saveCategory(category, originalCategory);
      setCategory("");
      setOriginalCategory(null);
    });
  }
  return (
    <>
      <h1>Administración SkyOps</h1>
      <div className="d-flex flex-wrap gap-2 my-3">
        {[
          ["resumen", "Dashboard"],
          ["componentes", "Componentes"],
          ["categorias", "Categorías"],
          ["ordenes", "Órdenes"],
          ["usuarios", "Usuarios"],
          ["reportes", "Reportes"],
        ].map(([value, label]) => (
          <Button
            key={value}
            variant={tab === value ? "primary" : "outline-primary"}
            onClick={() => {
              setParams({ vista: value });
              setMessage("");
              setReceipt(null);
            }}
          >
            {label}
          </Button>
        ))}
        <Link to="/perfil" className="btn btn-outline-primary">
          Mi perfil
        </Link>
      </div>
      {message && <Alert role="status">{message}</Alert>}
      {tab === "resumen" && (
        <Row className="g-3">
          {[
            ["Componentes", catalog.length],
            ["Stock total", catalog.reduce((sum, item) => sum + item.stock, 0)],
            ["Órdenes", orders.length],
            [
              "Ventas simuladas",
              money(orders.reduce((sum, order) => sum + order.total, 0)),
            ],
          ].map(([label, value]) => (
            <Col md={6} lg={3} key={label}>
              <div className="border rounded p-3">
                <h2 className="h5">{label}</h2>
                <p className="fs-3">{value}</p>
              </div>
            </Col>
          ))}
        </Row>
      )}
      {tab === "componentes" && (
        <>
          <Button className="mb-3" onClick={() => setEditing({})}>
            Nuevo componente
          </Button>
          {editing && (
            <ProductForm
              key={editing.pn || "new"}
              initial={editing.pn ? editing : undefined}
              categories={categories}
              onSave={save}
              onCancel={() => setEditing(null)}
            />
          )}
          <div className="table-responsive">
            <Table striped>
              <thead>
                <tr>
                  <th>Componente</th>
                  <th>P/N</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((product) => (
                  <tr key={product.pn}>
                    <td>{product.nombre}</td>
                    <td>{product.pn}</td>
                    <td>{product.categoria}</td>
                    <td>{product.stock}</td>
                    <td>
                      <Link to={"/catalogo/" + product.pn}>Detalle</Link>{" "}
                      <Button size="sm" onClick={() => setEditing(product)}>
                        Editar {product.nombre}
                      </Button>{" "}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => removeProduct(product)}
                      >
                        Eliminar {product.nombre}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
      {tab === "categorias" && (
        <>
          <Form onSubmit={saveCat} className="d-flex gap-2 mb-3">
            <Form.Label htmlFor="admin-category" className="visually-hidden">
              Nombre de categoría
            </Form.Label>
            <Form.Control
              id="admin-category"
              placeholder="Nombre de categoría"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
            <Button type="submit">
              {originalCategory ? "Guardar categoría" : "Crear categoría"}
            </Button>
            {originalCategory && (
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setOriginalCategory(null);
                  setCategory("");
                }}
              >
                Cancelar
              </Button>
            )}
          </Form>
          {categories.map((name) => (
            <div
              key={name}
              className="border rounded p-3 mb-2 d-flex flex-wrap gap-2 align-items-center"
            >
              <strong className="me-auto">{name}</strong>
              <Button
                size="sm"
                onClick={() => {
                  setCategory(name);
                  setOriginalCategory(name);
                }}
              >
                Editar {name}
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() =>
                  window.confirm("¿Eliminar categoría " + name + "?") &&
                  act(() => deleteCategory(name))
                }
              >
                Eliminar {name}
              </Button>
            </div>
          ))}
        </>
      )}
      {tab === "ordenes" && (
        <>
          {!orders.length && <p>No hay órdenes registradas.</p>}
          {orders.map((order) => (
            <div className="border rounded p-3 mb-2" key={order.id}>
              <strong>{order.folio}</strong> · {money(order.total)} ·{" "}
              {order.estado}{" "}
              <Button size="sm" onClick={() => setReceipt(order)}>
                Mostrar comprobante
              </Button>
            </div>
          ))}
          {receipt && <Receipt order={receipt} />}
        </>
      )}
      {tab === "usuarios" && (
        <>
          <p>
            Usuarios de demostración. Los registros nuevos se crean desde
            Registro.
          </p>
          <Link to="/registro">Nuevo usuario</Link>
          {users.map((item) => (
            <div className="border rounded p-3 my-2" key={item.id}>
              <strong>{item.nombre}</strong> · {item.email} · {item.rol}{" "}
              <Button size="sm" onClick={() => setEditingUser({ ...item })}>
                Editar usuario
              </Button>{" "}
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setReceipt({ usuarioId: item.id })}
              >
                Historial de compras
              </Button>
              {item.rol !== "admin" && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() =>
                    window.confirm("¿Eliminar usuario " + item.nombre + "?") &&
                    act(() =>
                      write(
                        keys.users,
                        users.filter((other) => other.id !== item.id),
                      ),
                    )
                  }
                >
                  Eliminar usuario
                </Button>
              )}
            </div>
          ))}
          {editingUser && (
            <Form
              className="border p-3"
              onSubmit={(event) => {
                event.preventDefault();
                act(() => {
                  updateUser(editingUser.id, editingUser);
                  setEditingUser(null);
                });
              }}
            >
              {["nombre", "direccion"].map((name) => (
                <Form.Group
                  controlId={"admin-user-" + name}
                  key={name}
                  className="mb-3"
                >
                  <Form.Label>
                    {name === "nombre"
                      ? "Nombre completo"
                      : "Dirección de entrega"}
                  </Form.Label>
                  <Form.Control
                    value={editingUser[name]}
                    onChange={(event) =>
                      setEditingUser({
                        ...editingUser,
                        [name]: event.target.value,
                      })
                    }
                  />
                </Form.Group>
              ))}
              <Button type="submit">Guardar usuario</Button>{" "}
              <Button
                variant="outline-secondary"
                onClick={() => setEditingUser(null)}
              >
                Cancelar
              </Button>
            </Form>
          )}
          {receipt?.usuarioId && (
            <>
              <h2 className="h4">Historial del usuario</h2>
              {orders
                .filter((order) => order.usuarioId === receipt.usuarioId)
                .map((order) => (
                  <p key={order.id}>
                    {order.folio} · {money(order.total)}
                  </p>
                ))}
              {!orders.some(
                (order) => order.usuarioId === receipt.usuarioId,
              ) && <p>Sin compras registradas.</p>}
            </>
          )}
        </>
      )}
      {tab === "reportes" && (
        <>
          <h2 className="h4">Componentes con stock crítico</h2>
          <p>Umbral de esta propuesta: dos unidades o menos.</p>
          <div className="table-responsive">
            <Table striped>
              <thead>
                <tr>
                  <th>P/N</th>
                  <th>Componente</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {catalog
                  .filter((item) => item.stock <= 2)
                  .map((item) => (
                    <tr key={item.pn}>
                      <td>{item.pn}</td>
                      <td>{item.nombre}</td>
                      <td>{item.stock}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
          <h2 className="h4">Reporte de ventas simuladas</h2>
          <p>
            Total: {money(orders.reduce((sum, order) => sum + order.total, 0))}
          </p>
          <p>
            Órdenes en curso:{" "}
            {orders.filter((order) => order.estado === "EN CURSO").length}
          </p>
        </>
      )}
    </>
  );
}
