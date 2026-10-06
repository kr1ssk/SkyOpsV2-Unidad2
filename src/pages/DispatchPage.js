import { useMemo, useState } from 'react';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { keys, read, write } from '../services/storage';
import { validarLicencia, validarMatricula, validarNombreCompleto } from '../utils/validators';

export default function DispatchPage(){
  const navigate=useNavigate();
  const manifest=read(keys.manifest);
  const fleet=read(keys.fleet);
  const selected=sessionStorage.getItem('skyops_u2_aeronave') || '';
  const [form,setForm]=useState({matricula:selected,destino:'',ingeniero:'',licencia:'',autorizacion:false});
  const [errors,setErrors]=useState({});
  const destinos=useMemo(()=>['Puerta 9','Puerta 14','Hangar 1','Hangar 2','Plataforma Remota 1'],[]);
  function change(e){
    const {name,value,type,checked}=e.target;
    setForm(f=>({...f,[name]:type==='checkbox'?checked:value}));
  }
  function validate(){
    const next={};
    if(!validarMatricula(form.matricula)) next.matricula='Formato requerido: CC- y tres letras.';
    if(!form.destino) next.destino='Selecciona una puerta o hangar.';
    if(!validarNombreCompleto(form.ingeniero)) next.ingeniero='Ingresa nombre y apellido.';
    if(!validarLicencia(form.licencia)) next.licencia='Formato requerido: dos letras, guion y cuatro números.';
    if(!form.autorizacion) next.autorizacion='Debes confirmar la declaración.';
    setErrors(next); return Object.keys(next).length===0;
  }
  function submit(e){
    e.preventDefault();
    if(!manifest.length){ setErrors({general:'No puedes despachar sin componentes.'}); return; }
    if(!validate()) return;
    const bitacora=read(keys.logbook);
    const now=new Date();
    bitacora.unshift({
      folio:'AOG-'+Math.floor(1000+Math.random()*9000),
      matricula:form.matricula.trim().toUpperCase(),
      destino:form.destino,
      responsable:form.ingeniero.trim(),
      fecha:now.toISOString().slice(0,16).replace('T',' '),
      respuesta:(60+Math.floor(Math.random()*30))+' s',
      estado:'EN CURSO'
    });
    write(keys.logbook,bitacora); write(keys.manifest,[]);
    sessionStorage.removeItem('skyops_u2_aeronave');
    navigate('/bitacora');
  }
  return <>
    <div className="page-title"><h1>Despacho de Urgencia AOG</h1><p className="text-secondary">Valida la orden antes de autorizar su salida.</p></div>
    {!manifest.length&&<Alert variant="warning">El manifiesto está vacío. Vuelve al catálogo antes de autorizar.</Alert>}
    {errors.general&&<Alert variant="danger">{errors.general}</Alert>}
    <div className="table-responsive mb-4"><Table striped><thead><tr><th>P/N</th><th>Componente</th><th>Bodega</th><th>Cantidad</th></tr></thead>
      <tbody>{manifest.map(x=><tr key={x.pn}><td>{x.pn}</td><td>{x.nombre}</td><td>{x.bodega}</td><td>{x.cantidad}</td></tr>)}</tbody></Table></div>
    <Form onSubmit={submit} noValidate className="panel-dark">
      <div className="row g-3">
        <Form.Group className="col-md-6"><Form.Label>Matrícula *</Form.Label><Form.Control name="matricula" list="fleet-list" value={form.matricula} onChange={change} isInvalid={!!errors.matricula}/><Form.Control.Feedback type="invalid">{errors.matricula}</Form.Control.Feedback></Form.Group>
        <datalist id="fleet-list">{fleet.map(x=><option value={x.matricula} key={x.matricula}/>)}</datalist>
        <Form.Group className="col-md-6"><Form.Label>Destino *</Form.Label><Form.Select name="destino" value={form.destino} onChange={change} isInvalid={!!errors.destino}><option value="">Selecciona...</option>{destinos.map(x=><option key={x}>{x}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.destino}</Form.Control.Feedback></Form.Group>
        <Form.Group className="col-md-6"><Form.Label>Ingeniero responsable *</Form.Label><Form.Control name="ingeniero" value={form.ingeniero} onChange={change} isInvalid={!!errors.ingeniero}/><Form.Control.Feedback type="invalid">{errors.ingeniero}</Form.Control.Feedback></Form.Group>
        <Form.Group className="col-md-6"><Form.Label>Licencia *</Form.Label><Form.Control name="licencia" placeholder="LE-3401" value={form.licencia} onChange={change} isInvalid={!!errors.licencia}/><Form.Control.Feedback type="invalid">{errors.licencia}</Form.Control.Feedback></Form.Group>
      </div>
      <Form.Check className="my-3" name="autorizacion" checked={form.autorizacion} onChange={change} label="Declaro que la información es correcta." isInvalid={!!errors.autorizacion} feedback={errors.autorizacion}/>
      <Button type="submit" disabled={!manifest.length}>Autorizar despacho</Button>
    </Form>
  </>;
}
