import { catalogSeed, fleetSeed, logbookSeed } from "../data/seed";

export const keys = {
  catalog: "skyops_u2_catalogo",
  fleet: "skyops_u2_flota",
  manifest: "skyops_u2_manifiesto",
  logbook: "skyops_u2_bitacora",
  categories: "skyops_u2_categorias",
  users: "skyops_u2_usuarios",
  orders: "skyops_u2_pedidos",
  session: "skyops_u2_sesion",
};
const clone = (value) => JSON.parse(JSON.stringify(value));

// Solo inicializamos claves que no existen: no borramos cambios del estudiante.
export function initStorage() {
  const defaults = {
    [keys.catalog]: catalogSeed,
    [keys.fleet]: fleetSeed,
    [keys.logbook]: logbookSeed,
    [keys.manifest]: [],
    [keys.orders]: [],
    [keys.categories]: ["Estructuras", "Tren de aterrizaje", "Motores"],
    [keys.users]: [
      {
        id: "admin",
        nombre: "Administrador SkyOps",
        email: "admin@skyops.cl",
        password: "skyops123",
        rol: "admin",
        direccion: "Hangar 1",
      },
    ],
  };
  Object.entries(defaults).forEach(([key, value]) => {
    if (localStorage.getItem(key) === null)
      localStorage.setItem(key, JSON.stringify(value));
  });
  // Completa campos nuevos de la migración sin reemplazar stock ni registros existentes.
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(keys.catalog) || "[]");
  } catch {
    saved = [];
  }
  if (Array.isArray(saved) && saved.some((item) => item.precio === undefined)) {
    const migrated = saved.map((item) => ({
      ...catalogSeed.find((seed) => seed.pn === item.pn),
      ...item,
    }));
    localStorage.setItem(keys.catalog, JSON.stringify(migrated));
  }
}
export function read(key, fallback = []) {
  try {
    initStorage();
    return JSON.parse(localStorage.getItem(key)) ?? clone(fallback);
  } catch {
    return clone(fallback);
  }
}
export function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("skyops:change", { detail: key }));
}
