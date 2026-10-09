import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import useStoredData from "../hooks/useStoredData";
import { keys } from "../services/storage";
export default function CategoriesPage() {
  const categories = useStoredData(keys.categories),
    catalog = useStoredData(keys.catalog);
  return (
    <>
      <h1>Categorías de componentes</h1>
      <Row className="g-3 mt-2">
        {categories.map((category) => (
          <Col md={6} lg={4} key={category}>
            <Card>
              <Card.Body>
                <Card.Title as="h2" className="h5">
                  {category}
                </Card.Title>
                <p>
                  {catalog.filter((item) => item.categoria === category).length}{" "}
                  componentes
                </p>
                <Link
                  to={"/catalogo?categoria=" + encodeURIComponent(category)}
                >
                  Explorar categoría
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
