import { Col, Row, Alert } from 'react-bootstrap';
import { keys, read } from '../services/storage';
import KpiCard from '../components/molecules/KpiCard';

export default function HomePage(){
  const fleet=read(keys.fleet), catalog=read(keys.catalog), logbook=read(keys.logbook);
  const aog=fleet.filter(x=>x.aog).length;
  return <>
    <div className="page-title text-center">
      <h1>Panel de Control Central</h1>
      <p className="text-secondary">Plataforma React para minimizar tiempos de inactividad AOG.</p>
    </div>
    <Row className="g-3 mb-4">
      <Col md={4}><KpiCard titulo="AOG activos" valor={aog}/></Col>
      <Col md={4}><KpiCard titulo="Repuestos" valor={catalog.length}/></Col>
      <Col md={4}><KpiCard titulo="Despachos registrados" valor={logbook.length}/></Col>
    </Row>
    <Alert variant="info"><strong>Flujo operativo:</strong> Flota → Catálogo → Manifiesto → Despacho AOG → Bitácora.</Alert>
    <div className="panel-dark">
      <h2 className="h4">¿Qué es una aeronave AOG?</h2>
      <p className="mb-0">Aircraft On Ground describe una aeronave inmovilizada por una condición técnica. SkyOps concentra la selección del avión, búsqueda del componente, armado del manifiesto, autorización y trazabilidad del despacho.</p>
    </div>
  </>;
}
