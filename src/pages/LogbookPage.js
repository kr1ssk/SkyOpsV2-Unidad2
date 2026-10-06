import { useMemo, useState } from 'react';
import { Badge, Button, Form, Table } from 'react-bootstrap';
import { keys, read, write } from '../services/storage';

export default function LogbookPage(){
  const [rows,setRows]=useState(()=>read(keys.logbook));
  const [query,setQuery]=useState(''), [state,setState]=useState('');
  const filtered=useMemo(()=>rows.filter(x=>x.matricula.toLowerCase().includes(query.toLowerCase())&&(!state||x.estado===state)),[rows,query,state]);
  function resolve(folio){
    const next=rows.map(x=>x.folio===folio?{...x,estado:'COMPLETADO'}:x);
    write(keys.logbook,next); setRows(next);
  }
  return <>
    <div className="page-title"><h1>Bitácora</h1><p className="text-secondary">Trazabilidad de despachos AOG.</p></div>
    <div className="d-flex gap-3 mb-3 responsive-stack"><Form.Control placeholder="Filtrar matrícula..." value={query} onChange={e=>setQuery(e.target.value)}/><Form.Select value={state} onChange={e=>setState(e.target.value)}><option value="">Todos los estados</option><option>EN CURSO</option><option>COMPLETADO</option></Form.Select></div>
    <div className="table-responsive"><Table striped hover><thead><tr><th>Folio</th><th>Matrícula</th><th>Destino</th><th>Responsable</th><th>Fecha</th><th>Respuesta</th><th>Estado</th><th></th></tr></thead>
    <tbody>{filtered.map(x=><tr key={x.folio}><td><strong>{x.folio}</strong></td><td>{x.matricula}</td><td>{x.destino}</td><td>{x.responsable}</td><td>{x.fecha}</td><td>{x.respuesta}</td><td><Badge bg={x.estado==='COMPLETADO'?'success':'warning'} text={x.estado==='COMPLETADO'?undefined:'dark'}>{x.estado}</Badge></td><td>{x.estado==='EN CURSO'&&<Button size="sm" variant="success" onClick={()=>resolve(x.folio)}>Resolver AOG</Button>}</td></tr>)}</tbody></Table></div>
  </>;
}
