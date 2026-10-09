import { useMemo, useState } from "react";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { keys, read } from "../services/storage";

export default function FleetPage() {
  const navigate = useNavigate();
  const fleet = read(keys.fleet);
  const [airline, setAirline] = useState(""),
    [airport, setAirport] = useState(""),
    [onlyAog, setOnlyAog] = useState(false);
  const rows = useMemo(
    () =>
      fleet.filter(
        (x) =>
          (!airline || x.aerolinea === airline) &&
          (!airport || x.aeropuerto === airport) &&
          (!onlyAog || x.aog),
      ),
    [fleet, airline, airport, onlyAog],
  );
  function selectAircraft(mat) {
    sessionStorage.setItem("skyops_u2_aeronave", mat);
    navigate("/catalogo");
  }
  return (
    <>
      <div className="page-title">
        <h1>Flota</h1>
        <p className="text-secondary">
          Selecciona una aeronave AOG para iniciar el flujo.
        </p>
      </div>
      <div className="d-flex gap-3 mb-3 responsive-stack">
        <Form.Select
          aria-label="Aerolínea"
          value={airline}
          onChange={(e) => setAirline(e.target.value)}
        >
          <option value="">Todas las aerolíneas</option>
          {[...new Set(fleet.map((x) => x.aerolinea))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Form.Select>
        <Form.Select
          aria-label="Aeropuerto"
          value={airport}
          onChange={(e) => setAirport(e.target.value)}
        >
          <option value="">Todos los aeropuertos</option>
          {[...new Set(fleet.map((x) => x.aeropuerto))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Form.Select>
        <Form.Check
          className="pt-2"
          id="fleet-only-aog"
          label="Solo AOG"
          checked={onlyAog}
          onChange={(e) => setOnlyAog(e.target.checked)}
        />
      </div>
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Modelo</th>
              <th>Aerolínea</th>
              <th>Aeropuerto</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.matricula}>
                <td>
                  <strong>{x.matricula}</strong>
                </td>
                <td>{x.modelo}</td>
                <td>{x.aerolinea}</td>
                <td>{x.aeropuerto}</td>
                <td>{x.ubicacion}</td>
                <td>
                  <Badge className={x.aog ? "status-aog" : "status-ok"}>
                    {x.aog ? "AOG" : "OPERATIVA"}
                  </Badge>
                </td>
                <td>
                  {x.aog && (
                    <Button
                      size="sm"
                      onClick={() => selectAircraft(x.matricula)}
                    >
                      Abrir manifiesto
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
