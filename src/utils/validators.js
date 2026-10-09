export function validarMatricula(valor = "") {
  const v = valor.trim().toUpperCase();
  return v.length === 6 && v.startsWith("CC-") && /^[A-Z]{3}$/.test(v.slice(3));
}
export function validarLicencia(valor = "") {
  return /^[A-Za-z]{2}-\d{4}$/.test(valor.trim());
}
export function validarNombreCompleto(valor = "") {
  const v = valor.trim();
  return v.length >= 5 && v.includes(" ");
}
export function validarCorreo(valor = "") {
  const v = valor.trim();
  return v.includes("@") && v.includes(".") && v.indexOf("@") > 0;
}
export function limitarCantidad(cantidad, stock) {
  const n = Number(cantidad);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(Math.floor(n), stock);
}
