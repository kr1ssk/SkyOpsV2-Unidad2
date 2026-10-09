import { keys, initStorage, read, write } from "../src/services/storage";
import {
  addToCart,
  confirmOrder,
  deleteCategory,
  deleteProduct,
  orderTotal,
  saveCategory,
  saveProduct,
  unitPrice,
  updateCart,
} from "../src/services/shop";
import { signIn, signOut, signUp, updateUser } from "../src/services/auth";
import { catalogSeed } from "../src/data/seed";

describe("Servicios: reglas de negocio y persistencia", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    initStorage();
  });
  it("S01 aplica descuento y suma subtotales", () => {
    expect(unitPrice(catalogSeed[0])).toBe(378000);
    expect(orderTotal([{ ...catalogSeed[0], cantidad: 2 }])).toBe(756000);
  });
  it("S02 no supera stock al agregar varias veces", () => {
    addToCart(catalogSeed[1].pn);
    expect(() => addToCart(catalogSeed[1].pn)).toThrowError(/supera el stock/);
    expect(read(keys.manifest)[0].cantidad).toBe(1);
  });
  it("S03 rechaza cantidades negativas y decimales", () => {
    expect(() => addToCart(catalogSeed[0].pn, -1)).toThrow();
    expect(() => addToCart(catalogSeed[0].pn, 1.5)).toThrow();
    expect(() => updateCart(catalogSeed[0].pn, -1)).toThrow();
  });
  it("S04 rechaza producto inexistente o sin stock", () => {
    expect(() => addToCart("inexistente")).toThrow();
    write(keys.catalog, [{ ...catalogSeed[0], stock: 0 }]);
    expect(() => addToCart(catalogSeed[0].pn)).toThrow();
  });
  it("S05 actualizar cantidad valida stock actual", () => {
    addToCart(catalogSeed[0].pn);
    expect(() => updateCart(catalogSeed[0].pn, 10)).toThrow();
    updateCart(catalogSeed[0].pn, 0);
    expect(read(keys.manifest)).toEqual([]);
  });
  it("S06 pago rechazado no crea orden ni modifica inventario", () => {
    addToCart(catalogSeed[0].pn);
    expect(() => confirmOrder({}, "rechazado")).toThrow();
    expect(read(keys.orders)).toEqual([]);
    expect(read(keys.catalog)[0].stock).toBe(4);
  });
  it("S07 checkout revalida stock antes de confirmar", () => {
    addToCart(catalogSeed[0].pn, 2);
    write(keys.catalog, [{ ...catalogSeed[0], stock: 1 }]);
    expect(() => confirmOrder({})).toThrowError(/stock cambió/);
    expect(read(keys.orders)).toEqual([]);
  });
  it("S08 carrito vacío no permite confirmar", () => {
    expect(() => confirmOrder({})).toThrowError(/vacío/);
  });
  it("S09 guarda instantánea de productos para conservar comprobantes", () => {
    addToCart(catalogSeed[0].pn);
    const order = confirmOrder({ ingeniero: "Cristian Rivera" });
    deleteProduct(catalogSeed[0].pn);
    expect(read(keys.orders)[0].items[0].nombre).toBe(catalogSeed[0].nombre);
    expect(order.total).toBe(378000);
  });
  it("S10 CRUD crea, actualiza, lee y elimina sin restaurar datos borrados", () => {
    const product = { ...catalogSeed[0], pn: "NUEVO", nombre: "Nuevo" };
    saveProduct(product);
    saveProduct({ ...product, stock: 9 }, "NUEVO");
    expect(read(keys.catalog).find((item) => item.pn === "NUEVO").stock).toBe(
      9,
    );
    deleteProduct("NUEVO");
    expect(read(keys.catalog).some((item) => item.pn === "NUEVO")).toBeFalse();
  });
  it("S11 rechaza P/N duplicado y números fuera de rango", () => {
    expect(() => saveProduct(catalogSeed[0])).toThrow();
    expect(() =>
      saveProduct({ ...catalogSeed[0], pn: "NUEVO", precio: 0 }),
    ).toThrow();
    expect(() =>
      saveProduct({ ...catalogSeed[0], pn: "NUEVO", descuento: 100 }),
    ).toThrow();
    expect(() =>
      saveProduct({ ...catalogSeed[0], pn: "NUEVO", nombre: "" }),
    ).toThrow();
  });
  it("S12 categorías propagan renombre y bloquean borrar una categoría usada", () => {
    saveCategory("Aviónica");
    saveCategory("Aviónica nueva", "Aviónica");
    deleteCategory("Aviónica nueva");
    saveCategory("Estructuras nuevas", "Estructuras");
    expect(read(keys.catalog)[0].categoria).toBe("Estructuras nuevas");
    expect(() => deleteCategory("Motores")).toThrow();
    expect(() => saveCategory("Motores")).toThrow();
    expect(() => saveCategory("")).toThrow();
  });
  it("S13 leer datos dañados usa respaldo y permite leer otras claves", () => {
    localStorage.setItem(keys.catalog, "JSON roto");
    expect(read(keys.catalog)).toEqual([]);
    expect(read(keys.fleet).length).toBe(4);
  });
  it("S14 inicializar no vuelve a insertar productos borrados", () => {
    write(keys.catalog, []);
    initStorage();
    expect(read(keys.catalog)).toEqual([]);
  });
  it("S15 datos previos a migración reciben precios sin perder stock", () => {
    write(keys.catalog, [
      { nombre: catalogSeed[0].nombre, pn: catalogSeed[0].pn, stock: 1 },
    ]);
    initStorage();
    expect(read(keys.catalog)[0].precio).toBe(420000);
    expect(read(keys.catalog)[0].stock).toBe(1);
  });
  it("S16 usuario nuevo, login, actualización y logout", () => {
    signUp({
      nombre: "Cristian Rivera",
      email: "cristian@example.cl",
      password: "demo123",
      direccion: "Hangar SCL",
    });
    const user = read(keys.session, null);
    expect(user.password).toBeUndefined();
    updateUser(user.id, { nombre: "Cristian Rivera", direccion: "Hangar ANF" });
    expect(read(keys.session, null).direccion).toBe("Hangar ANF");
    signOut();
    expect(read(keys.session, null)).toBeNull();
    expect(signIn("cristian@example.cl", "demo123").rol).toBe("usuario");
  });
  it("S17 rechaza datos de registro inválidos y correo repetido", () => {
    const good = {
      nombre: "Cristian Rivera",
      email: "cristian@example.cl",
      password: "demo123",
      direccion: "Hangar SCL",
    };
    expect(() => signUp({ ...good, nombre: "C" })).toThrow();
    expect(() => signUp({ ...good, email: "no-correo" })).toThrow();
    expect(() => signUp({ ...good, password: "123" })).toThrow();
    expect(() => signUp({ ...good, direccion: "" })).toThrow();
    signUp(good);
    expect(() => signUp(good)).toThrow();
    expect(() => signIn("no@existe.cl", "demo")).toThrow();
    expect(() => updateUser("no-existe", {})).toThrow();
    expect(() =>
      updateUser(read(keys.session, null).id, { nombre: "", direccion: "" }),
    ).toThrow();
  });
  it("S18 simula cuota de almacenamiento y restaura inventario, órdenes y carrito", () => {
    addToCart(catalogSeed[0].pn);
    const original = Storage.prototype.setItem;
    let failed = false;
    spyOn(Storage.prototype, "setItem").and.callFake(function (key, value) {
      if (key === keys.orders && !failed) {
        failed = true;
        throw new Error("QuotaExceeded");
      }
      return original.call(this, key, value);
    });
    expect(() => confirmOrder({})).toThrowError(/No se pudo guardar/);
    expect(read(keys.catalog)[0].stock).toBe(4);
    expect(read(keys.orders)).toEqual([]);
    expect(read(keys.manifest).length).toBe(1);
  });
});
