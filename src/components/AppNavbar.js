import { Container, Nav, Navbar, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { keys, read } from '../services/storage';

export default function AppNavbar(){
  const count = read(keys.manifest).reduce((n,x)=>n+x.cantidad,0);
  const items=[
    ['/', 'Inicio'], ['/proyecto','Proyecto'], ['/catalogo','Catálogo'],
    ['/manifiesto','Manifiesto'], ['/despacho','Despacho AOG'],
    ['/bitacora','Bitácora'], ['/flota','Flota'], ['/contacto','Contacto']
  ];
  return <Navbar expand="lg" variant="dark" className="sky-navbar" sticky="top">
    <Container fluid="xl">
      <Navbar.Brand as={NavLink} to="/" className="sky-brand">
        <strong>SkyOps</strong><small>Logística y Recuperación AOG</small>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="skyops-nav"/>
      <Navbar.Collapse id="skyops-nav">
        <Nav className="ms-auto">
          {items.map(([to,label])=><Nav.Link key={to} as={NavLink} to={to} end={to==='/'}>
            {label}{to==='/manifiesto' && count>0 ? <Badge bg="warning" text="dark" className="ms-1">{count}</Badge>:null}
          </Nav.Link>)}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>;
}
