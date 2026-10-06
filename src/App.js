import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import FleetPage from './pages/FleetPage';
import CatalogPage from './pages/CatalogPage';
import ManifestPage from './pages/ManifestPage';
import DispatchPage from './pages/DispatchPage';
import LogbookPage from './pages/LogbookPage';
import ContactPage from './pages/ContactPage';

export default function App(){
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />}/>
        <Route path="/proyecto" element={<ProjectPage />}/>
        <Route path="/flota" element={<FleetPage />}/>
        <Route path="/catalogo" element={<CatalogPage />}/>
        <Route path="/manifiesto" element={<ManifestPage />}/>
        <Route path="/despacho" element={<DispatchPage />}/>
        <Route path="/bitacora" element={<LogbookPage />}/>
        <Route path="/contacto" element={<ContactPage />}/>
      </Route>
    </Routes>
  );
}
