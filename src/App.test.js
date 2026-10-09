import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renderiza el panel principal", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByText("Panel de Control Central")).toBeInTheDocument();
  expect(screen.getByText(/Flota → Catálogo/)).toBeInTheDocument();
});
