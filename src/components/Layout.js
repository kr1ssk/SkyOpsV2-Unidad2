import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";

export default function Layout() {
  return (
    <>
      <AppNavbar />
      <main>
        <Container fluid="xl" className="py-4">
          <Outlet />
        </Container>
      </main>
      <footer className="text-center py-3">
        SkyOps · DSY1104 Desarrollo Full Stack II · Unidad 2 · Agustín Boeri y
        Cristian Rivera
      </footer>
    </>
  );
}
