import { Card, Col, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
const articles = [
  {
    id: "aog",
    titulo: "¿Qué significa AOG?",
    texto:
      "Aircraft On Ground describe una aeronave detenida en tierra por una condición que requiere atención. SkyOps organiza la selección de repuestos y el registro de una orden de despacho en un caso académico.",
  },
  {
    id: "trazabilidad",
    titulo: "Trazabilidad de componentes",
    texto:
      "El número de parte identifica el tipo de componente y el número de serie identifica una unidad. Registrar ambos junto con la bodega y la orden permite seguir el recorrido del repuesto. Los datos y certificados de esta aplicación son ejemplos.",
  },
];
export default function BlogPage() {
  const { id } = useParams();
  if (id) {
    const article = articles.find((item) => item.id === id);
    return article ? (
      <>
        <h1>{article.titulo}</h1>
        <p>{article.texto}</p>
        <Link to="/blog">Volver al blog</Link>
      </>
    ) : (
      <>
        <h1>Artículo no encontrado</h1>
        <Link to="/blog">Volver al blog</Link>
      </>
    );
  }
  return (
    <>
      <h1>Blog SkyOps</h1>
      <Row className="g-3">
        {articles.map((article) => (
          <Col md={6} key={article.id}>
            <Card>
              <Card.Body>
                <h2 className="h4">{article.titulo}</h2>
                <Link to={"/blog/" + article.id}>Leer artículo</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
