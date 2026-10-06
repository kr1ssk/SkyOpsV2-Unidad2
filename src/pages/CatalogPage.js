import { useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { keys, read, write } from '../services/storage';

export default function CatalogPage(){
  const [catalog,setCatalog]=useState(()=>read(keys.catalog));
  const [search,setSearch]=useState(''), [onlyStock,setOnlyStock]=useState(false);
  const selected=sessionStorage.getItem('skyops_u2_aeronave');
  const filtered=useMemo(()=>catalog.filter(x=>{
    const hay=(x.nombre+' '+x.pn+' '+x.sn+' '+x.ata).toLowerCase().includes(search.toLowerCase());
    return hay && (!onlyStock || x.stock>0);
  }),[catalog,search,onlyStock]);
  function add(item){
    const manifest=read(keys.manifest);
    const current=manifest.find(x=>x.pn===item.pn);
    if(current) current.cantidad=Math.min(current.cantidad+1,item.stock);
    else manifest.push({...item,cantidad:1});
    write(keys.manifest,manifest);
    setCatalog([...catalog]);
    window.dispatchEvent(new Event('storage'));
  }
  return <>
    <div className="page-title"><h1>Catálogo de componentes</h1><p className="text-secondary">Busca por nombre, P/N, S/N o capítulo ATA.</p></div>
    {selected&&<Alert variant="warning">Armando manifiesto para <strong>{selected}</strong>.</Alert>}
    <div className="d-flex gap-3 mb-3 responsive-stack">
      <Form.Control placeholder="Buscar componente..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <Form.Check className="pt-2" label="Solo con stock" checked={onlyStock} onChange={e=>setOnlyStock(e.target.checked)}/>
    </div>
    <Row className="g-3">{filtered.map(x=><Col md={6} lg={4} key={x.pn}><Card className="component-card">
      <Card.Body><Card.Title className="h5">{x.nombre}</Card.Title><div className="small text-secondary">{x.pn} · {x.sn}</div><p className="mt-2 mb-1">{x.ata}</p><p className="mb-2">{x.bodega}</p>
      <Badge bg={x.stock?'success':'secondary'} className="me-2">Stock {x.stock}</Badge><Badge bg={x.certificado?'info':'warning'} text={x.certificado?undefined:'dark'}>{x.certificado?'8130-3 OK':'Sin 8130-3'}</Badge>
      <div><Button className="mt-3" disabled={x.stock<1} onClick={()=>add(x)}>Agregar al manifiesto</Button></div></Card.Body></Card></Col>)}</Row>
  </>;
}
