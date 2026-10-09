# SkyOps, Unidad 2: tienda de componentes y despacho AOG

Continuación del [SkyOpsV2 original](https://github.com/kr1ssk/SkyOpsV2) para **DSY1104 Desarrollo Fullstack II, Duoc UC**. Integra React, Bootstrap, funcionalidades de tienda y pruebas Jasmine/Karma, manteniendo la temática aeronáutica autorizada para el caso.

## Ejecutar

Requisitos: **Node 22**, npm y Google Chrome para Karma.

```bash
git clone https://github.com/kr1ssk/SkyOpsV2-Unidad2.git
cd SkyOpsV2-Unidad2
# Si los cambios todavía están en revisión:
git switch feat/rubrica-parcial2
npm ci
npm start
```

Abrir http://localhost:3000. No se abre automáticamente una URL de producción.

**Administrador de demostración:** `admin@skyops.cl` / `skyops123`. Registrar usuarios con datos ficticios. Login, contraseñas locales, permisos y pago son simulaciones académicas. No usar contraseñas personales ni datos bancarios. No hay backend ni pasarela real en esta versión.

## Funciones

- Catálogo con imágenes locales, búsqueda, categoría, ATA, stock y filtros en URL.
- Categorías, ofertas con descuentos y detalle por P/N.
- Manifiesto como carrito: cantidades, quitar/vaciar, subtotales y total CLP.
- Checkout con matrícula, responsable, licencia, dirección, destino y entrega.
- Pago simulado aprobado/rechazado, comprobante imprimible, historial y stock actualizado al confirmar.
- Flota y bitácora AOG con filtros y cierre de despachos.
- Registro, perfil, autocompletado en checkout y menú sincronizado con persistencia.
- Administración: CRUD de componentes/categorías, usuarios, dashboard, órdenes, comprobantes, stock crítico y reportes.
- Proyecto, blog y contacto de demostración.
- Estado y datos guardados en localStorage/sessionStorage. No se reemplazan cambios al recargar.

## Pruebas y build

| Comando | Uso |
| --- | --- |
| `npm start` | Desarrollo React |
| `npm run build` | Versión optimizada en build |
| `npm test` | Jest interactivo |
| `npm run test:ci -- --runInBand` | Cinco pruebas complementarias Jest y cobertura separada |
| `npm run test:karma` | Suite principal Jasmine/Karma en Chrome |
| `npm run test:karma:ci` | Suite en ChromeHeadlessCI para contenedores |
| `npm run test:karma:watch` | Desarrollo de pruebas con ejecución continua |
| `npm run check` | Jest, Karma y build en secuencia |

Si Karma no encuentra Chrome:

```powershell
# Windows, ajustar si Chrome está instalado en otra ruta
$env:CHROME_BIN = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:karma
```

```bash
# Linux con Chromium, adaptar a la instalación real
CHROME_BIN=/usr/bin/chromium npm run test:karma
```

La suite principal contiene **86 casos**, incluidos **65 de componentes/vistas**, 18 de servicios y 3 de validadores. La cobertura exigida internamente es **90% por métrica**. Las pruebas Jest son complementarias y su porcentaje no representa la cobertura de Jasmine/Karma.

- `coverage/karma/index.html`: informe principal de cobertura.
- `coverage/karma/coverage-summary.json`: métricas de Jasmine/Karma.
- `test-results/jasmine.xml`: resultados JUnit.
- `docs/evidencias/`: resumen de la ejecución verificada para esta entrega.

## Organización

```text
src/
  components/       ProductCard, ProductForm, navegación y elementos reutilizables
  pages/            Catálogo, checkout, cuentas, administración y vistas AOG
  hooks/            useStoredData: estado React sincronizado con persistencia
  services/         storage, shop y auth: datos y reglas de negocio
  data/             datos iniciales de componentes, flota y bitácora
  utils/            validaciones de formato
  App.js            rutas de la SPA
  index.js          montaje y Bootstrap
public/assets/img/  SVG del proyecto original
test/               Jasmine: componentes, vistas, servicios y validadores
docs/               ERS V2, informe de testing y guía de defensa
```

ProductCard usa props para el producto y callback de agregar, y state para cantidad y mensajes. ProductForm reutiliza la creación/edición. Las páginas muestran datos y los servicios validan y persisten. Bootstrap usa grillas md/lg, navbar colapsable y tablas responsive.

## Documentación de la entrega

- [ERS V2](docs/ERS_V2.md).
- [Informe de testing](docs/INFORME_TESTING.md).
- [Guía de defensa de 15 minutos](docs/GUIA_DEFENSA.md).
- Entregar enlace público, ZIP, ERS actualizado e informe según los dos documentos de evaluación. La defensa individual representa 60%.

## CI

GitHub Actions usa Node 22 y `npm ci`, ejecuta Jest y **Jasmine/Karma con Chrome**, genera build y conserva cobertura/JUnit como artefactos. `package-lock.json` se versiona para instalar las mismas dependencias. Los scripts interactivos start, test y watch son de desarrollo y no deben bloquear el pipeline.

AWS CodeBuild instala con npm ci, ejecuta Jest y genera build. La verificación principal de Jasmine/Karma ocurre en GitHub Actions con Chrome configurado explícitamente. Para servir BrowserRouter en producción, configurar el servidor para devolver index.html en las rutas de la SPA. No se habilita un despliegue automático como parte de esta adaptación.

## Fuentes docentes

- [Ejemplos de persistencia, usuario y SPA](https://github.com/donkiwicl/fs2-react-ejemplos).
- [Ejemplos publicados](https://donkiwicl.github.io/fs2-react-ejemplos/).
- [Guía específica Jasmine/Karma](https://github.com/donkiwicl/donkiwicl.github.io/blob/main/GUIA_INSTALACION_JASMINE_KARMA.md).

Se aplican sus conceptos manteniendo React 18 y la herramienta de build ya instalada. El repositorio poo_tareafonda corresponde a otra asignatura (Java/JavaFX) y no define requisitos de esta evaluación.

## Límites y revisión del equipo

Persistencia y autorización de demostración viven en el navegador y no garantizan concurrencia ni seguridad multiusuario. El pago y los certificados son datos de ejemplo. El anexo menciona backend/frontend aunque exige persistencia simulada; confirmar con el docente si necesita integración REST para esta entrega. Los dos PDF no fijan cantidad mínima de commits ni exigen un repositorio o branch nuevo. Registrar aportes reales de cada integrante y revisar el material antes de entregar.
