import { Card, Col, Row } from "react-bootstrap";

export default function ProjectPage() {
  const bloques = [
    [
      "React + JSX",
      "La interfaz se migró desde ocho HTML separados a una SPA basada en componentes reutilizables.",
    ],
    [
      "React Bootstrap",
      "Navbar, grillas, formularios, cards, badges y tablas responsivas usan componentes de React Bootstrap.",
    ],
    [
      "Persistencia",
      "Se conserva localStorage/sessionStorage para simular datos mientras el backend corresponde a una unidad posterior.",
    ],
    [
      "Pruebas",
      "El repositorio incorpora React Testing Library/Jest y configuración Jasmine + Karma con cobertura.",
    ],
  ];
  return (
    <>
      <div className="page-title">
        <h1>Proyecto SkyOps · Unidad 2</h1>
        <p className="text-secondary">
          Evolución del prototipo estático de la Unidad 1.
        </p>
      </div>
      <Row className="g-3">
        {bloques.map(([t, d]) => (
          <Col md={6} key={t}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{t}</Card.Title>
                <Card.Text>{d}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
