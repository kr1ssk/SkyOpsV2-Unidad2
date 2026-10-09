import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
import ProductCard from "../src/components/ProductCard";
import ProductForm from "../src/components/ProductForm";
import { catalogSeed } from "../src/data/seed";
import { initStorage, keys, read, write } from "../src/services/storage";
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
  it("C04 filtra por categoría recibida desde la URL", () => {
    visit("/catalogo?categoria=Motores");
    expect(
      screen.getByRole("heading", { name: catalogSeed[2].nombre }),
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: catalogSeed[0].nombre }),
    ).toBeNull();
  });
  it("C05 muestra el estado vacío cuando no hay resultados", () => {
    visit("/catalogo");
    fill("Buscar componente", "inexistente");
    expect(screen.getByText("No se encontraron componentes.")).toBeTruthy();
  });
  it("C06 deshabilita el botón de un repuesto agotado", () => {
    render(
      <MemoryRouter>
        <ProductCard
          product={{ ...catalogSeed[0], stock: 0 }}
          onAdd={() => {}}
        />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("button", { name: "Agregar al manifiesto" }).disabled,
    ).toBeTrue();
  });
  it("C07 usa un spy para verificar el callback y la cantidad elegida", () => {
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
  it("C08 muestra el error condicional del servicio simulado", () => {
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
  it("C09 un clic agrega una pieza y actualiza el contador del menú", () => {
    visit("/catalogo");
    fireEvent.click(
      screen.getAllByRole("button", { name: "Agregar al manifiesto" })[0],
    );
    expect(read(keys.manifest)[0].cantidad).toBe(1);
    expect(
      screen.getByRole("link", { name: /Manifiesto/ }).textContent,
    ).toContain("1");
  });
  it("C10 muestra ofertas sin productos de precio normal", () => {
    visit("/ofertas");
    expect(
      screen.getAllByRole("button", { name: "Agregar al manifiesto" }).length,
    ).toBe(2);
    expect(
      screen.queryByRole("heading", { name: catalogSeed[1].nombre }),
    ).toBeNull();
  });
  it("C11 navega al detalle del componente", () => {
    visit("/catalogo");
    fireEvent.click(screen.getAllByRole("link", { name: "Ver detalle" })[0]);
    expect(
      screen.getByRole("heading", { name: "Detalle del componente" }),
    ).toBeTruthy();
  });
  it("C12 un detalle inexistente tiene una alternativa de navegación", () => {
    visit("/catalogo/PN-INEXISTENTE");
    expect(
      screen.getByRole("heading", { name: "Componente no encontrado" }),
    ).toBeTruthy();
  });
  it("C13 modificar cantidad recalcula el total persistido", () => {
    addToCart(catalogSeed[0].pn);
    visit("/manifiesto");
    fill("Cantidad de " + catalogSeed[0].nombre, "2");
    expect(read(keys.manifest)[0].cantidad).toBe(2);
    expect(screen.getByText("Unidades: 2")).toBeTruthy();
  });
  it("C14 quitar una línea renderiza el manifiesto vacío", () => {
    addToCart(catalogSeed[0].pn);
    visit("/manifiesto");
    fireEvent.click(
      screen.getByRole("button", { name: "Quitar " + catalogSeed[0].nombre }),
    );
    expect(read(keys.manifest).length).toBe(0);
    expect(screen.getByText(/El manifiesto está vacío/)).toBeTruthy();
  });
  it("C15 bloquea el checkout vacío", () => {
    visit("/despacho");
    expect(
      screen.getByRole("button", { name: "Confirmar compra y despacho" })
        .disabled,
    ).toBeTrue();
  });
  it("C16 envío inválido muestra todos los errores sin crear una orden", () => {
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
  it("C17 validación blur muestra el error debajo de la matrícula", () => {
    visit("/despacho");
    fireEvent.blur(screen.getByLabelText("Matrícula de aeronave *"));
    expect(
      screen.getByText("Formato requerido: CC- y tres letras."),
    ).toBeTruthy();
  });
  it("C18 compra válida muestra comprobante, descuenta stock y vacía carrito", () => {
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
  it("C19 pago rechazado conserva stock y carrito y muestra una ruta de reintento", () => {
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
  it("C20 autocompleta nombre y dirección de un usuario autenticado", () => {
    signIn("admin@skyops.cl", "skyops123");
    visit("/despacho");
    expect(screen.getByLabelText("Ingeniero responsable *").value).toBe(
      "Administrador SkyOps",
    );
    expect(screen.getByLabelText("Dirección de entrega *").value).toBe(
      "Hangar 1",
    );
  });
  it("C21 formulario de producto envía datos con props y callback mock", () => {
    const save = jasmine.createSpy("guardar");
    render(
      <ProductForm
        categories={["Motores"]}
        onSave={save}
        onCancel={() => {}}
      />,
    );
    fill("Nombre", "Repuesto nuevo");
    fill("P/N", "pn-99");
    fill("Categoría", "Motores");
    fill("Precio CLP", "100");
    fireEvent.click(screen.getByRole("button", { name: "Guardar componente" }));
    expect(save).toHaveBeenCalled();
    expect(save.calls.mostRecent().args[0].pn).toBe("PN-99");
  });
  it("C22 cancelar el formulario ejecuta la función recibida", () => {
    const cancel = jasmine.createSpy("cancelar");
    render(<ProductForm categories={[]} onSave={() => {}} onCancel={cancel} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(cancel).toHaveBeenCalledTimes(1);
  });
  it("C23 formulario muestra rechazo de un servicio mock sin ocultar los datos", () => {
    render(
      <ProductForm
        categories={[]}
        onSave={() => {
          throw new Error("P/N repetido");
        }}
        onCancel={() => {}}
      />,
    );
    fill("Nombre", "Actuador");
    fireEvent.click(screen.getByRole("button", { name: "Guardar componente" }));
    expect(screen.getByRole("alert").textContent).toContain("P/N repetido");
    expect(screen.getByLabelText("Nombre").value).toBe("Actuador");
  });
  it("C24 administración exige iniciar sesión", () => {
    visit("/admin");
    expect(
      screen.getByRole("heading", { name: "Iniciar sesión" }),
    ).toBeTruthy();
  });
  it("C25 una ruta desconocida conserva el menú y muestra 404", () => {
    visit("/ruta-desconocida");
    expect(
      screen.getByRole("heading", { name: "Página no encontrada" }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "Catálogo" })).toBeTruthy();
  });
  it("C26 el administrador crea un componente desde la interfaz", () => {
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
  });
  it("C27 el administrador edita el stock de un componente", () => {
    signIn("admin@skyops.cl", "skyops123");
    visit("/admin?vista=componentes");
    fireEvent.click(
      screen.getByRole("button", { name: "Editar " + catalogSeed[0].nombre }),
    );
    fill("Stock", "8");
    fireEvent.click(screen.getByRole("button", { name: "Guardar componente" }));
    expect(read(keys.catalog)[0].stock).toBe(8);
  });
  it("C28 confirmar eliminación borra el componente y su línea de carrito", () => {
    spyOn(window, "confirm").and.returnValue(true);
    addToCart(catalogSeed[0].pn);
    signIn("admin@skyops.cl", "skyops123");
    visit("/admin?vista=componentes");
    fireEvent.click(
      screen.getByRole("button", { name: "Eliminar " + catalogSeed[0].nombre }),
    );
    expect(read(keys.catalog).length).toBe(2);
    expect(read(keys.manifest).length).toBe(0);
  });
  it("C29 el administrador crea una categoría desde el formulario", () => {
    signIn("admin@skyops.cl", "skyops123");
    visit("/admin?vista=categorias");
    fill("Nombre de categoría", "Aviónica");
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }));
    expect(read(keys.categories)).toContain("Aviónica");
  });
  it("C30 rechaza un login incorrecto y permite corregirlo", () => {
    visit("/login");
    fill("Correo electrónico", "admin@skyops.cl");
    fill("Contraseña", "incorrecta");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(screen.getByRole("alert").textContent).toContain(
      "Correo o contraseña incorrectos.",
    );
    fill("Contraseña", "skyops123");
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(screen.getByRole("heading", { name: "Mi perfil" })).toBeTruthy();
  });
  it("C31 registro crea sesión y permite editar el perfil", () => {
    visit("/registro");
    fill("Nombre completo", "Cristian Rivera");
    fill("Correo electrónico", "cristian@example.cl");
    fill("Contraseña", "demo123");
    fill("Dirección de entrega", "Hangar SCL");
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(screen.getByRole("heading", { name: "Mi perfil" })).toBeTruthy();
    fill("Dirección de entrega", "Hangar ANF");
    fireEvent.click(screen.getByRole("button", { name: "Guardar perfil" }));
    expect(read(keys.session, null).direccion).toBe("Hangar ANF");
  });
});
