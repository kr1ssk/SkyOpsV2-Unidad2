import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import FleetPage from "./pages/FleetPage";
import CatalogPage from "./pages/CatalogPage";
import ManifestPage from "./pages/ManifestPage";
import DispatchPage from "./pages/DispatchPage";
import LogbookPage from "./pages/LogbookPage";
import ContactPage from "./pages/ContactPage";

import CategoriesPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminPage from "./pages/AdminPage";
import BlogPage from "./pages/BlogPage";
import { AccountPage, ProfilePage } from "./pages/AccountPages";
import { SuccessPage, ErrorPage, OrdersPage } from "./pages/OrderPages";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/proyecto" element={<ProjectPage />} />
        <Route path="/flota" element={<FleetPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/manifiesto" element={<ManifestPage />} />
        <Route path="/despacho" element={<DispatchPage />} />
        <Route path="/bitacora" element={<LogbookPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/ofertas" element={<CatalogPage offersOnly />} />
        <Route path="/catalogo/:pn" element={<ProductDetailPage />} />
        <Route path="/compra/exitosa/:id" element={<SuccessPage />} />
        <Route path="/compra/error" element={<ErrorPage />} />
        <Route path="/login" element={<AccountPage />} />
        <Route path="/registro" element={<AccountPage register />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/pedidos" element={<OrdersPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route
          path="*"
          element={
            <>
              <h1>Página no encontrada</h1>
              <a href="/">Volver al inicio</a>
            </>
          }
        />
      </Route>
    </Routes>
  );
}
