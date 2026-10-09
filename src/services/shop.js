import { keys, read, write } from "./storage";

export const money = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
export function unitPrice(item) {
  return Math.round(item.precio * (1 - (item.descuento || 0) / 100));
}
export function orderTotal(items) {
  return items.reduce(
    (total, item) => total + unitPrice(item) * item.cantidad,
    0,
  );
}

export function saveProduct(product, originalPn = null) {
  const catalog = read(keys.catalog);
  if (!product.nombre.trim() || !product.pn.trim() || !product.categoria)
    throw new Error("Completa nombre, P/N y categoría.");
  if (
    !Number.isInteger(product.stock) ||
    product.stock < 0 ||
    !Number.isFinite(product.precio) ||
    product.precio <= 0
  )
    throw new Error("Stock entero no negativo y precio mayor a cero.");
  if (
    !Number.isFinite(product.descuento) ||
    product.descuento < 0 ||
    product.descuento > 90
  )
    throw new Error("El descuento debe estar entre 0 y 90%.");
  if (catalog.some((item) => item.pn === product.pn && item.pn !== originalPn))
    throw new Error("Ese P/N ya existe.");
  const next = originalPn
    ? catalog.map((item) => (item.pn === originalPn ? product : item))
    : [...catalog, product];
  write(keys.catalog, next);
}
export function deleteProduct(pn) {
  write(
    keys.catalog,
    read(keys.catalog).filter((item) => item.pn !== pn),
  );
  write(
    keys.manifest,
    read(keys.manifest).filter((item) => item.pn !== pn),
  );
}
export function addToCart(pn, quantity = 1) {
  const product = read(keys.catalog).find((item) => item.pn === pn);
  if (!product || product.stock < 1)
    throw new Error("Componente sin stock disponible.");
  if (!Number.isInteger(quantity) || quantity < 1)
    throw new Error("La cantidad debe ser un entero mayor a cero.");
  const cart = read(keys.manifest);
  const existing = cart.find((item) => item.pn === pn);
  const count = (existing?.cantidad || 0) + quantity;
  if (count > product.stock)
    throw new Error("La cantidad supera el stock disponible.");
  write(
    keys.manifest,
    existing
      ? cart.map((item) =>
          item.pn === pn ? { ...product, cantidad: count } : item,
        )
      : [...cart, { ...product, cantidad: quantity }],
  );
}
export function updateCart(pn, quantity) {
  if (!Number.isInteger(quantity) || quantity < 0)
    throw new Error("Cantidad inválida.");
  const product = read(keys.catalog).find((item) => item.pn === pn);
  if (quantity > 0 && (!product || quantity > product.stock))
    throw new Error("La cantidad supera el stock disponible.");
  write(
    keys.manifest,
    read(keys.manifest)
      .map((item) =>
        item.pn === pn ? { ...product, cantidad: quantity } : item,
      )
      .filter((item) => item.cantidad > 0),
  );
}

// Pago académico: solo dos resultados elegibles, sin tarjetas ni pasarela real.
export function confirmOrder(form, payment = "aprobado") {
  const cart = read(keys.manifest);
  const catalog = read(keys.catalog);
  if (!cart.length) throw new Error("El manifiesto está vacío.");
  const items = cart.map((line) => {
    const product = catalog.find((item) => item.pn === line.pn);
    if (
      !product ||
      !Number.isInteger(line.cantidad) ||
      line.cantidad < 1 ||
      line.cantidad > product.stock
    )
      throw new Error("El stock cambió. Revisa el manifiesto.");
    return { ...product, cantidad: line.cantidad };
  });
  if (payment !== "aprobado")
    throw new Error(
      "El pago simulado fue rechazado. Puedes volver a intentarlo.",
    );
  const order = {
    ...form,
    id: crypto.randomUUID(),
    folio: "AOG-" + Date.now(),
    fecha: new Date().toISOString(),
    items,
    total: orderTotal(items),
    estado: "EN CURSO",
    usuarioId: read(keys.session, null)?.id || null,
  };
  const nextCatalog = catalog.map((product) => ({
    ...product,
    stock:
      product.stock -
      (items.find((item) => item.pn === product.pn)?.cantidad || 0),
  }));
  // Preparar todos los valores antes de escribir; ante cuota llena se restaura el estado previo.
  const changes = {
    [keys.catalog]: nextCatalog,
    [keys.orders]: [order, ...read(keys.orders)],
    [keys.logbook]: [
      { ...order, responsable: form.ingeniero, respuesta: "Simulada" },
      ...read(keys.logbook),
    ],
    [keys.manifest]: [],
  };
  const previous = Object.fromEntries(
    Object.keys(changes).map((key) => [key, localStorage.getItem(key)]),
  );
  try {
    Object.entries(changes).forEach(([key, value]) =>
      localStorage.setItem(key, JSON.stringify(value)),
    );
  } catch (error) {
    Object.entries(previous).forEach(([key, value]) =>
      value === null
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, value),
    );
    throw new Error(
      "No se pudo guardar la compra. Libera espacio y vuelve a intentar.",
    );
  }
  window.dispatchEvent(new CustomEvent("skyops:change"));
  sessionStorage.removeItem("skyops_u2_aeronave");
  return order;
}
export function saveCategory(name, original = null) {
  const trimmed = name.trim();
  const categories = read(keys.categories);
  if (!trimmed) throw new Error("Escribe un nombre de categoría.");
  if (
    categories.some(
      (category) =>
        category.toLowerCase() === trimmed.toLowerCase() &&
        category !== original,
    )
  )
    throw new Error("La categoría ya existe.");
  if (original) {
    write(
      keys.catalog,
      read(keys.catalog).map((item) =>
        item.categoria === original ? { ...item, categoria: trimmed } : item,
      ),
    );
  }
  write(
    keys.categories,
    original
      ? categories.map((category) =>
          category === original ? trimmed : category,
        )
      : [...categories, trimmed],
  );
}
export function deleteCategory(name) {
  if (read(keys.catalog).some((item) => item.categoria === name))
    throw new Error(
      "La categoría tiene componentes. Reasígnalos antes de eliminarla.",
    );
  write(
    keys.categories,
    read(keys.categories).filter((category) => category !== name),
  );
}
