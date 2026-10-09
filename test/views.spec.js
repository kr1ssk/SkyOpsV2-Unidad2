import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import StatusBadge from "../src/components/atoms/StatusBadge";
import { keys, initStorage, read, write } from "../src/services/storage";
import { signIn, signUp } from "../src/services/auth";
import { addToCart, confirmOrder } from "../src/services/shop";
import { catalogSeed } from "../src/data/seed";

const visit = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
const fill = (label, value) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const click = (name) => fireEvent.click(screen.getByRole("button", { name }));
const admin = (path) => {
  signIn("admin@skyops.cl", "skyops123");
  return visit(path);
};

describe("Vistas complementarias y navegación de la tienda AOG", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    initStorage();
  });
  afterEach(cleanup);
  it("V01 portada muestra indicadores y explicación del flujo", () => {
    visit("/");
    expect(
      screen.getByRole("heading", { name: "Panel de Control Central" }),
    ).toBeTruthy();
  });
  it("V02 categorías permiten navegar al catálogo filtrado", () => {
    visit("/categorias");
    fireEvent.click(
      screen.getAllByRole("link", { name: "Explorar categoría" })[0],
    );
    expect(screen.getByLabelText("Categoría").value).toBe("Estructuras");
  });
  it("V03 la vista proyecto documenta React y persistencia", () => {
    visit("/proyecto");
    expect(screen.getByText("React + JSX")).toBeTruthy();
  });
  it("V04 blog muestra artículos y navega al detalle", () => {
    visit("/blog");
    fireEvent.click(screen.getAllByRole("link", { name: "Leer artículo" })[0]);
    expect(
      screen.getByRole("heading", { name: "¿Qué significa AOG?" }),
    ).toBeTruthy();
  });
  it("V05 blog detecta artículo inexistente", () => {
    visit("/blog/no-existe");
    expect(
      screen.getByRole("heading", { name: "Artículo no encontrado" }),
    ).toBeTruthy();
  });
  it("V06 flota filtra AOG y transmite matrícula al catálogo", () => {
    visit("/flota");
    fireEvent.click(screen.getByLabelText("Solo AOG"));
    fill("Aerolínea", "LATAM Airlines");
    fill("Aeropuerto", "SCL");
    click("Abrir manifiesto");
    expect(sessionStorage.getItem("skyops_u2_aeronave")).toBe("CC-BFA");
    expect(screen.getByText("CC-BFA")).toBeTruthy();
  });
  it("V07 bitácora combina filtros y permite resolver un despacho", () => {
    addToCart(catalogSeed[0].pn);
    const order = confirmOrder({
      matricula: "CC-BFA",
      ingeniero: "Cristian Rivera",
      destino: "Hangar 1",
    });
    visit("/bitacora");
    fill("Filtrar matrícula", "CC-BFA");
    fill("Estado del despacho", "EN CURSO");
    click("Resolver AOG");
    expect(read(keys.orders).find((item) => item.id === order.id).estado).toBe(
      "COMPLETADO",
    );
    expect(
      read(keys.logbook).find((item) => item.folio === order.folio).estado,
    ).toBe("COMPLETADO");
  });
  it("V08 contacto inválido muestra errores de todas las reglas", () => {
    visit("/contacto");
    click("Enviar solicitud");
    expect(screen.getByText("Ingresa un correo válido.")).toBeTruthy();
    expect(screen.getByText("Debes autorizar el contacto.")).toBeTruthy();
  });
  it("V09 contacto válido genera ticket de demostración y limpia formulario", () => {
    visit("/contacto");
    fill("Nombre completo", "Cristian Rivera");
    fill("Correo", "cristian@example.cl");
    fill("Aeropuerto base", "SCL");
    fill("Tipo de solicitud", "Consulta general");
    fill("Mensaje", "Necesito consultar el estado de mi orden de repuestos.");
    fireEvent.click(screen.getByLabelText("Autorizo el contacto por correo."));
    click("Enviar solicitud");
    expect(
      screen.getByText(/Solicitud de demostración registrada/),
    ).toBeTruthy();
    expect(screen.getByLabelText("Nombre completo").value).toBe("");
  });
  it("V10 insignia diferencia AOG, operativo y en curso por props", () => {
    const view = render(<StatusBadge estado="AOG" />);
    expect(screen.getByText("AOG").className).toContain("bg-danger");
    view.rerender(<StatusBadge estado="OPERATIVA" />);
    expect(screen.getByText("OPERATIVA").className).toContain("bg-success");
    view.rerender(<StatusBadge estado="EN CURSO" />);
    expect(screen.getByText("EN CURSO").className).toContain("bg-warning");
  });
  it("V11 catálogo filtra por ATA y limpiar restablece las tres fichas", () => {
    visit("/catalogo");
    fill("Capítulo ATA", catalogSeed[0].ata);
    expect(
      screen.getAllByRole("button", { name: "Agregar al manifiesto" }).length,
    ).toBe(1);
    click("Limpiar filtros");
    expect(
      screen.getAllByRole("button", { name: "Agregar al manifiesto" }).length,
    ).toBe(3);
  });
  it("V12 filtro solo stock excluye agotados", () => {
    write(keys.catalog, [{ ...catalogSeed[0], stock: 0 }, catalogSeed[1]]);
    visit("/catalogo");
    fireEvent.click(screen.getByLabelText("Solo con stock"));
    expect(
      screen.queryByRole("heading", { name: catalogSeed[0].nombre }),
    ).toBeNull();
  });
  it("V13 cancelar vaciado conserva carrito y confirmar lo elimina", () => {
    const confirm = spyOn(window, "confirm").and.returnValue(false);
    addToCart(catalogSeed[0].pn);
    visit("/manifiesto");
    click("Vaciar");
    expect(read(keys.manifest).length).toBe(1);
    confirm.and.returnValue(true);
    click("Vaciar");
    expect(read(keys.manifest).length).toBe(0);
  });
  it("V14 cantidad por sobre stock informa error en manifiesto", () => {
    addToCart(catalogSeed[0].pn);
    visit("/manifiesto");
    fill("Cantidad de " + catalogSeed[0].nombre, "999");
    expect(
      screen.getByText("La cantidad supera el stock disponible."),
    ).toBeTruthy();
    expect(read(keys.manifest)[0].cantidad).toBe(1);
  });
  it("V15 usuario común no accede a administración", () => {
    signUp({
      nombre: "Cristian Rivera",
      email: "c@example.cl",
      password: "demo123",
      direccion: "SCL",
    });
    visit("/admin");
    expect(
      screen.getByRole("heading", { name: "Acceso restringido" }),
    ).toBeTruthy();
  });
  it("V16 dashboard presenta cifras y navega a reportes", () => {
    admin("/admin");
    expect(screen.getByRole("heading", { name: "Stock total" })).toBeTruthy();
    click("Reportes");
    expect(
      screen.getByRole("heading", { name: "Componentes con stock crítico" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Imprimir reporte" }),
    ).toBeTruthy();
  });
  it("V17 categorías permiten renombrar y luego cancelar edición", () => {
    admin("/admin?vista=categorias");
    click("Editar Estructuras");
    fill("Nombre de categoría", "Estructuras nuevas");
    click("Guardar categoría");
    expect(read(keys.catalog)[0].categoria).toBe("Estructuras nuevas");
    click("Editar Motores");
    click("Cancelar");
    expect(screen.getByLabelText("Nombre de categoría").value).toBe("");
  });
  it("V18 categoría usada muestra error y una vacía se elimina", () => {
    spyOn(window, "confirm").and.returnValue(true);
    write(keys.categories, [...read(keys.categories), "Aviónica"]);
    admin("/admin?vista=categorias");
    click("Eliminar Motores");
    expect(
      screen.getByText(
        "La categoría tiene componentes. Reasígnalos antes de eliminarla.",
      ),
    ).toBeTruthy();
    click("Eliminar Aviónica");
    expect(read(keys.categories)).not.toContain("Aviónica");
  });
  it("V19 cancelar edición de producto conserva el original", () => {
    admin("/admin?vista=componentes");
    click("Editar " + catalogSeed[0].nombre);
    fill("Nombre", "No guardar");
    click("Cancelar");
    expect(read(keys.catalog)[0].nombre).toBe(catalogSeed[0].nombre);
  });
  it("V20 editar producto inválido informa errores sin cerrar el formulario", () => {
    admin("/admin?vista=componentes");
    click("Editar " + catalogSeed[0].nombre);
    fill("Precio CLP", "0");
    click("Guardar componente");
    expect(screen.getByRole("alert").textContent).toContain(
      "precio mayor a cero",
    );
  });
  it("V21 órdenes permiten ver comprobante e imprimir mediante spy", () => {
    addToCart(catalogSeed[0].pn);
    confirmOrder({ ingeniero: "Cristian Rivera" });
    admin("/admin?vista=ordenes");
    click("Mostrar comprobante");
    const print = spyOn(window, "print");
    click("Imprimir comprobante");
    expect(print).toHaveBeenCalledTimes(1);
  });
  it("V22 administración de usuarios edita nombre y dirección", () => {
    admin("/admin?vista=usuarios");
    click("Editar usuario");
    fill("Nombre completo", "Admin Demostración");
    fill("Dirección de entrega", "Hangar ANF");
    click("Guardar usuario");
    expect(read(keys.users)[0].nombre).toBe("Admin Demostración");
    expect(read(keys.session, null).direccion).toBe("Hangar ANF");
  });
  it("V23 historial de usuario sin compras informa estado vacío", () => {
    admin("/admin?vista=usuarios");
    click("Historial de compras");
    expect(screen.getByText("Sin compras registradas.")).toBeTruthy();
  });
  it("V24 eliminar usuario común mantiene al administrador", () => {
    signUp({
      nombre: "Cristian Rivera",
      email: "c@example.cl",
      password: "demo123",
      direccion: "SCL",
    });
    spyOn(window, "confirm").and.returnValue(true);
    admin("/admin?vista=usuarios");
    click("Eliminar usuario");
    expect(read(keys.users).length).toBe(1);
    expect(read(keys.users)[0].rol).toBe("admin");
  });
  it("V25 perfil sin sesión navega al login", () => {
    visit("/perfil");
    expect(
      screen.getByRole("heading", { name: "Iniciar sesión" }),
    ).toBeTruthy();
  });
  it("V26 usuario consulta solo su historial", () => {
    signIn("admin@skyops.cl", "skyops123");
    addToCart(catalogSeed[0].pn);
    const order = confirmOrder({ ingeniero: "Administrador SkyOps" });
    visit("/pedidos");
    expect(screen.getByRole("link", { name: order.folio })).toBeTruthy();
  });
  it("V27 mis pedidos sin sesión invita a ingresar", () => {
    visit("/pedidos");
    expect(
      screen.getByText("Inicia sesión para consultar tus pedidos."),
    ).toBeTruthy();
  });
  it("V28 usuario sin compras muestra historial vacío", () => {
    signIn("admin@skyops.cl", "skyops123");
    visit("/pedidos");
    expect(screen.getByText("Todavía no tienes pedidos.")).toBeTruthy();
  });
  it("V29 enlace de comprobante inexistente no provoca excepción", () => {
    visit("/compra/exitosa/no-existe");
    expect(
      screen.getByRole("heading", { name: "Orden no encontrada" }),
    ).toBeTruthy();
  });
  it("V30 error sin datos de navegación conserva reintento", () => {
    visit("/compra/error");
    expect(
      screen.getByText("Revisa tu orden y vuelve a intentar."),
    ).toBeTruthy();
  });
  it("V31 cerrar sesión actualiza el menú React", () => {
    admin("/catalogo");
    click("Cerrar sesión");
    expect(read(keys.session, null)).toBeNull();
    expect(screen.getByRole("link", { name: "Ingresar" })).toBeTruthy();
  });
  it("V32 sesión sincronizada por evento storage actualiza menú", () => {
    visit("/catalogo");
    act(() => {
      localStorage.setItem(
        keys.session,
        JSON.stringify({ id: "demo", nombre: "Demo", rol: "usuario" }),
      );
      window.dispatchEvent(new StorageEvent("storage", { key: keys.session }));
    });
    expect(screen.getByRole("link", { name: "Mi perfil" })).toBeTruthy();
  });
  it("V33 registro inválido muestra error sin crear usuario", () => {
    visit("/registro");
    click("Crear cuenta");
    expect(screen.getByText("Escribe nombre y apellido.")).toBeTruthy();
    expect(read(keys.users).length).toBe(1);
  });
  it("V34 actualizar perfil vacío mantiene datos persistidos", () => {
    signIn("admin@skyops.cl", "skyops123");
    visit("/perfil");
    fill("Nombre completo", "");
    click("Guardar perfil");
    expect(screen.getByText("Completa nombre y dirección.")).toBeTruthy();
    expect(read(keys.session, null).nombre).toBe("Administrador SkyOps");
  });
});
