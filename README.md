# SkyOps para la Evaluación Parcial 2

Desarrollo Fullstack II, Duoc UC. Agustín Boeri y Cristian Rivera.

Se conservan las páginas y el flujo AOG del primer SkyOps y se migran a React 18 con Bootstrap. Se agregan las vistas de tienda del Anexo 1: categorías, ofertas, detalle, compra y resultados, usuarios, perfil, blog y administración. El diagrama administrativo del anexo incluye productos, categorías, órdenes, usuarios, productos críticos y reportes.

## Ejecutar

Requisitos: Node 22, npm y Chrome para las pruebas Karma.

```powershell
git clone --branch feat/rubrica-parcial2 https://github.com/kr1ssk/SkyOpsV2-Unidad2.git
cd SkyOpsV2-Unidad2
npm ci
npm start
```

Abrir http://localhost:3000. Administrador de demostración: admin@skyops.cl / skyops123. Los datos se guardan en localStorage; las cuentas, permisos y pago son simulados. No hay backend ni pagos reales.

## Pruebas

```powershell
npm run test:karma
npm run test:ci -- --runInBand
npm run build
```

La suite requerida tiene **10 pruebas de componentes con Jasmine/Karma**. Los cinco tests Jest ya presentes en el proyecto se conservan por continuidad y no reemplazan las pruebas exigidas.

Si Karma no encuentra Chrome, ajustar su ruta en PowerShell:

```powershell
$env:CHROME_BIN = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:karma
```

El informe HTML está en coverage/karma/index.html. No se exige un porcentaje interno de cobertura. El CI ya existente conserva instalación reproducible, pruebas y build, sin publicar artefactos ni desplegar.

## Entrega

- Repositorio público y código comprimido.
- docs/ERS_V2.md y su PDF.
- docs/INFORME_TESTING.md y su PDF.
- docs/evidencias: resumen de cobertura y capturas responsivas.

La presentación dura 15 minutos por equipo más 5 minutos de preguntas. La pauta distribuye 40 % para encargo y 60 % para presentación individual. El anexo menciona backend/frontend y datos simulados en JS: confirmar el alcance de integración con el docente.

## Estructura

src/components contiene componentes reutilizables; src/pages las vistas; src/data los datos iniciales; src/services las operaciones; src/hooks la sincronización; test/components.spec.js las diez pruebas Jasmine/Karma.

## Referencias

- Primer SkyOps: https://github.com/kr1ssk/SkyOpsV2
- Ejemplos React del profesor: https://github.com/donkiwicl/fs2-react-ejemplos
- Guía Jasmine/Karma: https://github.com/donkiwicl/donkiwicl.github.io/blob/main/GUIA_INSTALACION_JASMINE_KARMA.md
