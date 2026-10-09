import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import ProductCard from "../src/components/ProductCard";
import ProductForm from "../src/components/ProductForm";
import { catalogSeed } from "../src/data/seed";
import { initStorage, keys, read } from "../src/services/storage";
import { signIn } from "../src/services/auth";
import { addToCart } from "../src/services/shop";

// Jasmine no ejecuta la limpieza automática de Jest: cada prueba elimina su DOM y sus datos.
function visit(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}
function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}
function checkout() {
  fill("Matrícula de aeronave *", "CC-BFA");
  fill("Ingeniero responsable *", "Cristian Rivera");
  fill("Licencia *", "LE-3401");
  fill("Dirección de entrega *", "Hangar SCL");
  fill("Puerta o hangar *", "Hangar 1");
  fireEvent.click(
    screen.getByLabelText(
      "Declaro que la información es correcta y autorizo el despacho.",
    ),
  );
}
describe("Componentes React: renderizado, props, estado y eventos", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    initStorage();
  });
  afterEach(() => cleanup());
  it("C01 renderiza el nombre recibido mediante props", () => {
    render(
      <MemoryRouter>
        <ProductCard product={catalogSeed[0]} onAdd={() => {}} />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: catalogSeed[0].nombre }),
    ).toBeTruthy();
  });
  it("C02 renderiza todas las fichas del catálogo", () => {
    visit("/catalogo");
    expect(
      screen.getAllByRole("button", { name: "Agregar al manifiesto" }).length,
    ).toBe(3);
  });
  it("C03 actualiza el estado del filtro al escribir y modifica el DOM", () => {
    visit("/catalogo");
    fill("Buscar componente", "Turbina");
    expect(
      screen.getAllByRole("button", { name: "Agregar al manifiesto" }).length,
    ).toBe(1);
    expect(
      screen.queryByRole("heading", { name: catalogSeed[0].nombre }),
    ).toBeNull();
  });
  it("C04 usa un spy para verificar el callback y la cantidad elegida", () => {
    const onAdd = jasmine.createSpy("agregar");
    render(
      <MemoryRouter>
        <ProductCard product={catalogSeed[0]} onAdd={onAdd} />
      </MemoryRouter>,
    );
    fill("Cantidad de " + catalogSeed[0].nombre, "2");
    fireEvent.click(
      screen.getByRole("button", { name: "Agregar al manifiesto" }),
    );
    expect(onAdd).toHaveBeenCalledOnceWith(catalogSeed[0].pn, 2);
    expect(screen.getByText("Componente agregado al manifiesto.")).toBeTruthy();
  });
  it("C05 muestra el error condicional del servicio simulado", () => {
    const onAdd = jasmine
      .createSpy("agregar")
      .and.throwError("Stock insuficiente");
    render(
      <MemoryRouter>
        <ProductCard product={catalogSeed[0]} onAdd={onAdd} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("alert")).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Agregar al manifiesto" }),
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "Stock insuficiente",
    );
  });
  it("C06 modificar cantidad recalcula el total persistido", () => {
    addToCart(catalogSeed[0].pn);
    visit("/manifiesto");
    fill("Cantidad de " + catalogSeed[0].nombre, "2");
    expect(read(keys.manifest)[0].cantidad).toBe(2);
    expect(screen.getByText("Unidades: 2")).toBeTruthy();
  });
  it("C07 envío inválido muestra todos los errores sin crear una orden", () => {
    addToCart(catalogSeed[0].pn);
    visit("/despacho");
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar compra y despacho" }),
    );
    expect(
      screen.getByText("Formato requerido: CC- y tres letras."),
    ).toBeTruthy();
    expect(screen.getByText("Ingresa nombre y apellido.")).toBeTruthy();
    expect(read(keys.orders).length).toBe(0);
  });
  it("C08 compra válida muestra comprobante, descuenta stock y vacía carrito", () => {
    addToCart(catalogSeed[0].pn);
    visit("/despacho");
    checkout();
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar compra y despacho" }),
    );
    expect(
      screen.getByRole("heading", { name: "Compra exitosa" }),
    ).toBeTruthy();
    expect(read(keys.orders).length).toBe(1);
    expect(read(keys.catalog)[0].stock).toBe(3);
    expect(read(keys.manifest).length).toBe(0);
  });
  it("C09 pago rechazado conserva stock y carrito y muestra una ruta de reintento", () => {
    addToCart(catalogSeed[0].pn);
    visit("/despacho");
    checkout();
    fill("Resultado del pago de demostración", "rechazado");
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar compra y despacho" }),
    );
    expect(
      screen.getByRole("heading", { name: "No se pudo completar la compra" }),
    ).toBeTruthy();
    expect(read(keys.catalog)[0].stock).toBe(4);
    expect(read(keys.manifest).length).toBe(1);
    expect(
      screen.getByRole("link", { name: "Volver al despacho" }),
    ).toBeTruthy();
  });
  it("C10 el administrador crea edita y elimina un componente", () => {
    signIn("admin@skyops.cl", "skyops123");
    visit("/admin?vista=componentes");
    fireEvent.click(screen.getByRole("button", { name: "Nuevo componente" }));
    fill("Nombre", "Bomba de prueba");
    fill("P/N", "PN-99");
    fill("Categoría", "Motores");
    fill("Stock", "5");
    fill("Precio CLP", "1000");
    fireEvent.click(screen.getByRole("button", { name: "Guardar componente" }));
    expect(read(keys.catalog).some((item) => item.pn === "PN-99")).toBeTrue();
    expect(screen.getByText("Bomba de prueba")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Editar Bomba de prueba" }));
    fill("Stock", "8");
    fireEvent.click(screen.getByRole("button", { name: "Guardar componente" }));
    expect(read(keys.catalog).find(item => item.pn === "PN-99").stock).toBe(8);
    spyOn(window, "confirm").and.returnValue(true);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar Bomba de prueba" }));
    expect(read(keys.catalog).some(item => item.pn === "PN-99")).toBeFalse();
  });
});
