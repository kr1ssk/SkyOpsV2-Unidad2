# Informe de testing y cobertura: SkyOps, entrega 2

**Asignatura:** DSY1104 Desarrollo Fullstack II, Duoc UC.  
**Proyecto:** SkyOps, tienda de componentes y despacho AOG.  
**Equipo:** Agustín Boeri y Cristian Rivera.  
**Fecha de ejecución verificada:** 9 de octubre de 2026.

## 1. Objetivo y alcance

Verificar que los componentes React rendericen datos, reciban props, cambien estado, respondan a eventos y muestren estados alternativos correctamente. Validar las reglas de compra, stock, CRUD y persistencia. Las pruebas cubren el caso de tienda online adaptado a la temática aeronáutica autorizada.

La suite principal usa Jasmine con Karma y Chrome. React Testing Library consulta el DOM por rol, etiqueta y texto y simula eventos con fireEvent. Los casos C01-C10 forman una selección de diez pruebas para la defensa. La suite ampliada verifica también checkout, administración, usuarios, vistas AOG y errores.

## 2. Entorno y ejecución

Entorno local: Linux, Node 24.19.0, npm 11.9.0 y Chromium 153.0.8010.0. El proyecto admite Node 22-24 y el workflow usa Node 22. Se verificó una reinstalación limpia mediante npm ci usando package-lock.json.

Comandos ejecutados:

```bash
npm ci --no-audit --no-fund
CI=true npm run test:ci -- --runInBand
CHROME_BIN=<ruta-local-de-Chromium> npm run test:karma:ci
CI=true npm run build
```

La ruta de Chromium depende de cada equipo. En Windows Chrome instalado suele encontrarse automáticamente; CHROME_BIN permite especificar otra instalación.

## 3. Resultados medidos

- **Jasmine/Karma: 86 pruebas correctas, cero fallidas.**
- 31 casos de componentes principales en components.spec.js.
- 34 casos de vistas y navegación en views.spec.js.
- 18 casos de reglas y persistencia en shop.spec.js.
- 3 casos de validadores en validators.spec.js.
- **Jest complementario: 5 pruebas correctas en 2 suites.** Es una comprobación de portada y validadores; su cobertura separada no representa la suite Jasmine/Karma.
- **Build de producción correcto**, también con CI=true.
- Catálogo revisado en navegador a **390, 768 y 1440 píxeles**, sin desbordamiento horizontal. Evidencias PNG en docs/evidencias.

Cobertura principal generada por Babel/Istanbul y karma-coverage:

| Métrica | Cubierto / total | Cobertura |
| --- | --- | --- |
| Sentencias | 487/500 | 97.4% |
| Ramas | 397/421 | 94.29% |
| Funciones | 196/206 | 95.14% |
| Líneas | 456/467 | 97.64% |

El proyecto fija un umbral interno de 90% en sentencias, ramas, funciones y líneas. La rúbrica no impone ese porcentaje. La cobertura mide ejecución, no ausencia de errores.

## 4. Configuración y aislamiento

Karma carga test/**/*.spec.js. Webpack empaqueta imports y Babel transforma JSX. babel-plugin-istanbul instrumenta archivos src antes de empaquetarlos, con correspondencia al código fuente. La cobertura incluye componentes, páginas, hooks, servicios y validadores importados desde la aplicación. Se excluyen datos iniciales, montaje index.js, setupTests y archivos de pruebas.

No se mide solamente validators.js como en la configuración anterior. Las imágenes se sirven mediante un proxy local de Karma para evitar avisos 404 de las tarjetas.

Cada describe configura beforeEach para limpiar localStorage y sessionStorage e inicializar sus propios datos. afterEach(cleanup) desmonta la interfaz. Los casos no dependen del estado que dejó otra prueba. Jasmine usa orden aleatorio con semilla 20261009 para reproducir la ejecución.

## 5. Mocks y casos alternativos

| Ejemplo | Sustitución | Qué se comprueba |
| --- | --- | --- |
| C07 | jasmine.createSpy para onAdd | El evento recibe P/N y cantidad elegida |
| C08 | Callback que lanza Stock insuficiente | El error aparece solo tras la acción |
| C22 | Spy para onCancel | Cancelar ejecuta el callback recibido |
| C28 / V13 / V18 | spyOn(window, confirm) | Cancelar o confirmar controla las eliminaciones |
| V21 | spyOn(window, print) | Se solicita imprimir sin abrir un diálogo real |
| S18 | spyOn(Storage.prototype, setItem) | Fallo de guardado revierte stock, pedido y carrito |

Los spies sustituyen una dependencia concreta. Las pruebas no afirman haber realizado un pago real ni un envío de correo.

## 6. Análisis de resultados

Las pruebas verifican que el botón agotado no permita agregar, que los filtros modifiquen el DOM y que los callbacks reciban datos correctos. El proceso de compra se verifica con datos válidos, inválidos, pago rechazado y stock cambiado entre selección y confirmación. El CRUD se comprueba desde servicios y desde la interfaz, incluyendo P/N repetido y categoría en uso.

La orden conserva una instantánea para mantener el comprobante si posteriormente se elimina el producto. El caso de fallo de almacenamiento comprueba la restauración de inventario y carrito. Las pruebas de registro verifican formato, correo repetido y que la sesión omita la contraseña. Las pruebas de perfil y eventos storage verifican la actualización visible de los datos.

## 7. Cobertura pendiente y límites

El porcentaje no alcanza 100%. AdminPage conserva líneas y callbacks alternativos sin ejecutar; validadores y detalle conservan algunas ramas de valores límite. Consultar el informe HTML por archivo para localizar las líneas pendientes. La suite incluye recorridos principales y de error, pero no cubre toda combinación de campos.

La revisión responsive se realizó sobre el catálogo. No equivale a certificar todos los navegadores ni todas las páginas en todas las resoluciones. Las tablas usan su propio desplazamiento horizontal. La ejecución local se hizo en Chromium; no se verificaron Safari, Firefox, lectores de pantalla ni hardware móvil real.

La persistencia es del navegador y no garantiza compras concurrentes entre usuarios o pestañas. El login y los roles son simulados y no son una barrera de seguridad del servidor. No hay pruebas de backend, pasarela bancaria, correos reales ni certificación aeronáutica. Karma prueba unidades e integración en navegador, no sustituye por sí solo una suite end-to-end de producción.

react-scripts conserva dependencias heredadas que producen avisos de deprecación. Se mantuvo la herramienta del proyecto para concentrar esta adaptación en la evaluación; una migración futura a Vite requiere revisión independiente.

## 8. Automatización CI y evidencias

El workflow de GitHub Actions ejecuta instalación bloqueada, Jest complementario, configuración explícita de Chrome, Jasmine/Karma y build. Guarda coverage y test-results como artefactos incluso si una prueba falla. Los comandos interactivos start, test y watch no se ejecutan en CI porque no terminan por sí solos.

CodeBuild usa npm ci, Jest y build. GitHub Actions mantiene la suite principal de Jasmine/Karma con Chrome. El estado de la ejecución remota debe consultarse en Actions; las cifras anteriores corresponden a la ejecución local documentada.

Evidencias:

- docs/evidencias/cobertura-karma.json: métricas totales y por archivo.
- docs/evidencias/jasmine.xml: resultados JUnit de los 86 casos.
- docs/evidencias/ejecucion.json: entorno y comandos verificados.
- docs/evidencias/catalogo-mobile.png, catalogo-tablet.png y catalogo-desktop.png.
- coverage/karma/index.html después de ejecutar npm run test:karma.

## 9. Inventario de casos ejecutados

| Archivo | Caso | Resultado |
| --- | --- | --- |
| components.spec.js | C01 renderiza el nombre recibido mediante props | Correcto |
| components.spec.js | C02 renderiza todas las fichas del catálogo | Correcto |
| components.spec.js | /catalogo | Correcto |
| components.spec.js | C03 actualiza el estado del filtro al escribir y modifica el DOM | Correcto |
| components.spec.js | /catalogo | Correcto |
| components.spec.js | C04 filtra por categoría recibida desde la URL | Correcto |
| components.spec.js | /catalogo?categoria=Motores | Correcto |
| components.spec.js | C05 muestra el estado vacío cuando no hay resultados | Correcto |
| components.spec.js | /catalogo | Correcto |
| components.spec.js | C06 deshabilita el botón de un repuesto agotado | Correcto |
| components.spec.js | C07 usa un spy para verificar el callback y la cantidad elegida | Correcto |
| components.spec.js | C08 muestra el error condicional del servicio simulado | Correcto |
| components.spec.js | C09 un clic agrega una pieza y actualiza el contador del menú | Correcto |
| components.spec.js | /catalogo | Correcto |
| components.spec.js | C10 muestra ofertas sin productos de precio normal | Correcto |
| components.spec.js | /ofertas | Correcto |
| components.spec.js | C11 navega al detalle del componente | Correcto |
| components.spec.js | /catalogo | Correcto |
| components.spec.js | C12 un detalle inexistente tiene una alternativa de navegación | Correcto |
| components.spec.js | /catalogo/PN-INEXISTENTE | Correcto |
| components.spec.js | C13 modificar cantidad recalcula el total persistido | Correcto |
| components.spec.js | /manifiesto | Correcto |
| components.spec.js | C14 quitar una línea renderiza el manifiesto vacío | Correcto |
| components.spec.js | /manifiesto | Correcto |
| components.spec.js | C15 bloquea el checkout vacío | Correcto |
| components.spec.js | /despacho | Correcto |
| components.spec.js | C16 envío inválido muestra todos los errores sin crear una orden | Correcto |
| components.spec.js | /despacho | Correcto |
| components.spec.js | C17 validación blur muestra el error debajo de la matrícula | Correcto |
| components.spec.js | /despacho | Correcto |
| components.spec.js | C18 compra válida muestra comprobante, descuenta stock y vacía carrito | Correcto |
| components.spec.js | /despacho | Correcto |
| components.spec.js | C19 pago rechazado conserva stock y carrito y muestra una ruta de reintento | Correcto |
| components.spec.js | /despacho | Correcto |
| components.spec.js | C20 autocompleta nombre y dirección de un usuario autenticado | Correcto |
| components.spec.js | /despacho | Correcto |
| components.spec.js | C21 formulario de producto envía datos con props y callback mock | Correcto |
| components.spec.js | C22 cancelar el formulario ejecuta la función recibida | Correcto |
| components.spec.js | C23 formulario muestra rechazo de un servicio mock sin ocultar los datos | Correcto |
| components.spec.js | C24 administración exige iniciar sesión | Correcto |
| components.spec.js | /admin | Correcto |
| components.spec.js | C25 una ruta desconocida conserva el menú y muestra 404 | Correcto |
| components.spec.js | /ruta-desconocida | Correcto |
| components.spec.js | C26 el administrador crea un componente desde la interfaz | Correcto |
| components.spec.js | /admin?vista=componentes | Correcto |
| components.spec.js | C27 el administrador edita el stock de un componente | Correcto |
| components.spec.js | /admin?vista=componentes | Correcto |
| components.spec.js | C28 confirmar eliminación borra el componente y su línea de carrito | Correcto |
| components.spec.js | /admin?vista=componentes | Correcto |
| components.spec.js | C29 el administrador crea una categoría desde el formulario | Correcto |
| components.spec.js | /admin?vista=categorias | Correcto |
| components.spec.js | C30 rechaza un login incorrecto y permite corregirlo | Correcto |
| components.spec.js | /login | Correcto |
| components.spec.js | C31 registro crea sesión y permite editar el perfil | Correcto |
| components.spec.js | /registro | Correcto |
| views.spec.js | V01 portada muestra indicadores y explicación del flujo | Correcto |
| views.spec.js | / | Correcto |
| views.spec.js | V02 categorías permiten navegar al catálogo filtrado | Correcto |
| views.spec.js | /categorias | Correcto |
| views.spec.js | V03 la vista proyecto documenta React y persistencia | Correcto |
| views.spec.js | /proyecto | Correcto |
| views.spec.js | V04 blog muestra artículos y navega al detalle | Correcto |
| views.spec.js | /blog | Correcto |
| views.spec.js | V05 blog detecta artículo inexistente | Correcto |
| views.spec.js | /blog/no-existe | Correcto |
| views.spec.js | V06 flota filtra AOG y transmite matrícula al catálogo | Correcto |
| views.spec.js | /flota | Correcto |
| views.spec.js | V07 bitácora combina filtros y permite resolver un despacho | Correcto |
| views.spec.js | /bitacora | Correcto |
| views.spec.js | V08 contacto inválido muestra errores de todas las reglas | Correcto |
| views.spec.js | /contacto | Correcto |
| views.spec.js | V09 contacto válido genera ticket de demostración y limpia formulario | Correcto |
| views.spec.js | /contacto | Correcto |
| views.spec.js | V10 insignia diferencia AOG, operativo y en curso por props | Correcto |
| views.spec.js | V11 catálogo filtra por ATA y limpiar restablece las tres fichas | Correcto |
| views.spec.js | /catalogo | Correcto |
| views.spec.js | V12 filtro solo stock excluye agotados | Correcto |
| views.spec.js | /catalogo | Correcto |
| views.spec.js | V13 cancelar vaciado conserva carrito y confirmar lo elimina | Correcto |
| views.spec.js | /manifiesto | Correcto |
| views.spec.js | V14 cantidad por sobre stock informa error en manifiesto | Correcto |
| views.spec.js | /manifiesto | Correcto |
| views.spec.js | V15 usuario común no accede a administración | Correcto |
| views.spec.js | /admin | Correcto |
| views.spec.js | V16 dashboard presenta cifras y navega a reportes | Correcto |
| views.spec.js | V17 categorías permiten renombrar y luego cancelar edición | Correcto |
| views.spec.js | V18 categoría usada muestra error y una vacía se elimina | Correcto |
| views.spec.js | V19 cancelar edición de producto conserva el original | Correcto |
| views.spec.js | V20 editar producto inválido informa errores sin cerrar el formulario | Correcto |
| views.spec.js | V21 órdenes permiten ver comprobante e imprimir mediante spy | Correcto |
| views.spec.js | V22 administración de usuarios edita nombre y dirección | Correcto |
| views.spec.js | V23 historial de usuario sin compras informa estado vacío | Correcto |
| views.spec.js | V24 eliminar usuario común mantiene al administrador | Correcto |
| views.spec.js | V25 perfil sin sesión navega al login | Correcto |
| views.spec.js | /perfil | Correcto |
| views.spec.js | V26 usuario consulta solo su historial | Correcto |
| views.spec.js | /pedidos | Correcto |
| views.spec.js | V27 mis pedidos sin sesión invita a ingresar | Correcto |
| views.spec.js | /pedidos | Correcto |
| views.spec.js | V28 usuario sin compras muestra historial vacío | Correcto |
| views.spec.js | /pedidos | Correcto |
| views.spec.js | V29 enlace de comprobante inexistente no provoca excepción | Correcto |
| views.spec.js | /compra/exitosa/no-existe | Correcto |
| views.spec.js | V30 error sin datos de navegación conserva reintento | Correcto |
| views.spec.js | /compra/error | Correcto |
| views.spec.js | V31 cerrar sesión actualiza el menú React | Correcto |
| views.spec.js | V32 sesión sincronizada por evento storage actualiza menú | Correcto |
| views.spec.js | /catalogo | Correcto |
| views.spec.js | V33 registro inválido muestra error sin crear usuario | Correcto |
| views.spec.js | /registro | Correcto |
| views.spec.js | V34 actualizar perfil vacío mantiene datos persistidos | Correcto |
| views.spec.js | /perfil | Correcto |
| shop.spec.js | S01 aplica descuento y suma subtotales | Correcto |
| shop.spec.js | S02 no supera stock al agregar varias veces | Correcto |
| shop.spec.js | S03 rechaza cantidades negativas y decimales | Correcto |
| shop.spec.js | S04 rechaza producto inexistente o sin stock | Correcto |
| shop.spec.js | S05 actualizar cantidad valida stock actual | Correcto |
| shop.spec.js | S06 pago rechazado no crea orden ni modifica inventario | Correcto |
| shop.spec.js | S07 checkout revalida stock antes de confirmar | Correcto |
| shop.spec.js | S08 carrito vacío no permite confirmar | Correcto |
| shop.spec.js | S09 guarda instantánea de productos para conservar comprobantes | Correcto |
| shop.spec.js | S10 CRUD crea, actualiza, lee y elimina sin restaurar datos borrados | Correcto |
| shop.spec.js | S11 rechaza P/N duplicado y números fuera de rango | Correcto |
| shop.spec.js | S12 categorías propagan renombre y bloquean borrar una categoría usada | Correcto |
| shop.spec.js | S13 leer datos dañados usa respaldo y permite leer otras claves | Correcto |
| shop.spec.js | S14 inicializar no vuelve a insertar productos borrados | Correcto |
| shop.spec.js | S15 datos previos a migración reciben precios sin perder stock | Correcto |
| shop.spec.js | S16 usuario nuevo, login, actualización y logout | Correcto |
| shop.spec.js | S17 rechaza datos de registro inválidos y correo repetido | Correcto |
| shop.spec.js | S18 simula cuota de almacenamiento y restaura inventario, órdenes y carrito | Correcto |
| validators.spec.js | acepta matrícula CC-BFA | Correcto |
| validators.spec.js | rechaza licencia inválida | Correcto |
| validators.spec.js | no permite superar el stock | Correcto |

## 10. Trazabilidad y fuentes

El ERS V2 relaciona RF01-RF21 con los identificadores de prueba. C01-C10 permiten demostrar el mínimo de diez casos indicado por la pauta para el desempeño máximo. IE2.3.1 e IE2.3.2 se apoyan en la configuración, los spies, el aislamiento, los resultados y el análisis de cobertura de este informe.

Referencias: rúbrica y Anexo 1 DSY1104 proporcionados por el estudiante; ejemplos en https://github.com/donkiwicl/fs2-react-ejemplos y guía Jasmine/Karma en https://github.com/donkiwicl/donkiwicl.github.io/blob/main/GUIA_INSTALACION_JASMINE_KARMA.md.
