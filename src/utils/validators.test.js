import {
  limitarCantidad,
  validarCorreo,
  validarLicencia,
  validarMatricula,
  validarNombreCompleto,
} from "./validators";

describe("reglas de validación SkyOps", () => {
  test("valida matrícula chilena", () => {
    expect(validarMatricula("CC-BFA")).toBe(true);
    expect(validarMatricula("BFA")).toBe(false);
  });
  test("valida licencia", () => {
    expect(validarLicencia("LE-3401")).toBe(true);
    expect(validarLicencia("LE3401")).toBe(false);
  });
  test("valida nombre y correo", () => {
    expect(validarNombreCompleto("Cristian Rivera")).toBe(true);
    expect(validarCorreo("c.rivera@skyops.aero")).toBe(true);
  });
  test("limita cantidad al stock", () => {
    expect(limitarCantidad(10, 4)).toBe(4);
    expect(limitarCantidad(0, 4)).toBe(0);
  });
});
