import { Button, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import useStoredData from "../hooks/useStoredData";
import { keys } from "../services/storage";
import { addToCart } from "../services/shop";

export default function ProductDetailPage() {
  const { pn } = useParams();
  const product = useStoredData(keys.catalog).find((item) => item.pn === pn);
  if (!product)
    return (
      <>
        <h1>Componente no encontrado</h1>
        <Button as={Link} role="link" to="/catalogo">
          Volver al catálogo
        </Button>
      </>
    );
  return (
    <>
      <h1>Detalle del componente</h1>
      <Row className="g-4">
        <Col md={6}>
          <ProductCard product={product} onAdd={addToCart} />
        </Col>
        <Col md={6}>
          <h2 className="h4">Trazabilidad del repuesto</h2>
          <p>
            La orden registra el número de parte, serie, origen y cantidad del
            componente.
          </p>
          <p>
            {product.certificado
              ? "Cuenta con certificado 8130-3 registrado en los datos de ejemplo."
              : "Sin certificado 8130-3 registrado. Requiere revisión del responsable técnico."}
          </p>
          <Button
            as={Link}
            role="link"
            variant="outline-primary"
            to="/catalogo"
          >
            Volver al catálogo
          </Button>
        </Col>
      </Row>
    </>
  );
}
