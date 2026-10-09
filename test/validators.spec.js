import {
  limitarCantidad,
  validarLicencia,
  validarMatricula,
} from "../src/utils/validators";

describe("SkyOps - Jasmine + Karma", function () {
  it("acepta matrícula CC-BFA", function () {
    expect(validarMatricula("CC-BFA")).toBeTrue();
  });
  it("rechaza licencia inválida", function () {
    expect(validarLicencia("LE3401")).toBeFalse();
  });
  it("no permite superar el stock", function () {
    expect(limitarCantidad(8, 3)).toBe(3);
  });
});
