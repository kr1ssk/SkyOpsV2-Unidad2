import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import useStoredData from "../hooks/useStoredData";
import { keys } from "../services/storage";
import { addToCart } from "../services/shop";
import ProductCard from "../components/ProductCard";

export default function CatalogPage({ offersOnly = false }) {
  const catalog = useStoredData(keys.catalog),
    categories = useStoredData(keys.categories);
  const [params, setParams] = useSearchParams();
  const search = params.get("buscar") || "",
    category = params.get("categoria") || "",
    ata = params.get("ata") || "",
    onlyStock = params.get("stock") === "1";
  const selected = sessionStorage.getItem("skyops_u2_aeronave");
  function filter(name, value) {
    const next = new URLSearchParams(params);
    value ? next.set(name, value) : next.delete(name);
    setParams(next, { replace: true });
  }
  const filtered = catalog.filter(
    (item) =>
      (item.nombre + " " + item.pn + " " + item.sn + " " + item.ata)
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!category || item.categoria === category) &&
      (!ata || item.ata === ata) &&
      (!onlyStock || item.stock > 0) &&
      (!offersOnly || item.descuento > 0),
  );
  return (
    <>
      <div className="page-title">
        <h1>
          {offersOnly ? "Ofertas de componentes" : "Catálogo de componentes"}
        </h1>
        <p className="text-secondary">
          Repuestos aeronáuticos para tu orden AOG.
        </p>
      </div>
      {selected && (
        <Alert variant="warning">
          Armando manifiesto para <strong>{selected}</strong>.
        </Alert>
      )}
      <Row className="g-3 mb-3">
        <Col md={4}>
          <Form.Label htmlFor="catalog-search">Buscar componente</Form.Label>
          <Form.Control
            id="catalog-search"
            value={search}
            onChange={(event) => filter("buscar", event.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Label htmlFor="catalog-category">Categoría</Form.Label>
          <Form.Select
            id="catalog-category"
            value={category}
            onChange={(event) => filter("categoria", event.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label htmlFor="catalog-ata">Capítulo ATA</Form.Label>
          <Form.Select
            id="catalog-ata"
            value={ata}
            onChange={(event) => filter("ata", event.target.value)}
          >
            <option value="">Todos los capítulos</option>
            {[...new Set(catalog.map((item) => item.ata))].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2} className="d-flex flex-column justify-content-end gap-2">
          <Form.Check
            id="only-stock"
            label="Solo con stock"
            checked={onlyStock}
            onChange={(event) =>
              filter("stock", event.target.checked ? "1" : "")
            }
          />
          <Button variant="outline-secondary" onClick={() => setParams({})}>
            Limpiar filtros
          </Button>
        </Col>
      </Row>
      <p role="status">{filtered.length} componentes encontrados.</p>
      {!filtered.length && (
        <Alert variant="secondary">No se encontraron componentes.</Alert>
      )}
      <Row className="g-3">
        {filtered.map((product) => (
          <Col md={6} lg={4} key={product.pn}>
            <ProductCard product={product} onAdd={addToCart} />
          </Col>
        ))}
      </Row>
    </>
  );
}
