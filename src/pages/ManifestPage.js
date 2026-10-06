import { useState } from 'react';
import { Alert, Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { keys, read, write } from '../services/storage';
import { limitarCantidad } from '../utils/validators';

export default function ManifestPage(){
  const [items,setItems]=useState(()=>read(keys.manifest));
  function update(pn,delta){
    const next=items.map(x=>x.pn===pn?{...x,cantidad:limitarCantidad(x.cantidad+delta,x.stock)}:x).filter(x=>x.cantidad>0);
    write(keys.manifest,next); setItems(next);
  }
  function clear(){ write(keys.manifest,[]); setItems([]); }
  const units=items.reduce((n,x)=>n+x.cantidad,0), cert=items.filter(x=>x.certificado).length;
  return <>
    <div className="page-title"><h1>Manifiesto de repuestos</h1><p className="text-secondary">Orden de trabajo persistente en localStorage.</p></div>
    {items.length===0&&<Alert variant="secondary">El manifiesto está vacío. Agrega componentes desde el catálogo.</Alert>}
    <Row className="g-3">
      <Col lg={8}>{items.map(x=><Card className="mb-2" key={x.pn}><Card.Body className="d-flex justify-content-between align-items-center responsive-stack gap-2">
        <div><strong>{x.nombre}</strong><div className="small text-secondary">{x.pn} · {x.bodega}</div></div>
        <div className="d-flex align-items-center gap-2"><Button size="sm" variant="outline-secondary" onClick={()=>update(x.pn,-1)}>-</Button><strong>{x.cantidad}</strong><Button size="sm" onClick={()=>update(x.pn,1)}>+</Button></div>
      </Card.Body></Card>)}</Col>
      <Col lg={4}><div className="panel-dark"><h2 className="h5">Resumen</h2><p>Líneas: <strong>{items.length}</strong></p><p>Unidades: <strong>{units}</strong></p><p>Con certificado: <strong>{cert}</strong></p><div className="d-grid gap-2"><Button variant="outline-light" onClick={clear}>Vaciar</Button><Button as={Link} to="/despacho" disabled={!items.length}>Continuar al despacho</Button></div></div></Col>
    </Row>
  </>;
}
