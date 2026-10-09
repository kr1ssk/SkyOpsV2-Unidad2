# Guía de defensa: SkyOps, Evaluación Parcial 2

**Duoc UC, segundo año, Desarrollo Fullstack II.** Material de estudio y ensayo para Agustín Boeri y Cristian Rivera. La defensa es individual aunque el desarrollo sea grupal. Ajusten el reparto a sus aportes reales y expliquen el código con sus propias palabras.

## Recorrido de 15 minutos por equipo

| Tiempo | Tema | Evidencia en pantalla |
| --- | --- | --- |
| 0:00-1:00 | Problema y alcance | SkyOps como tienda de repuestos con despacho AOG. Pago, cuentas y datos son simulados |
| 1:00-3:00 | React y navegación | App.js, Layout, rutas por P/N y filtros en URL; navegar sin recargar |
| 3:00-5:00 | Props, state y Bootstrap | ProductCard y ProductForm; editar cantidad y comparar móvil/escritorio |
| 5:00-8:00 | Compra y administración | Catálogo, manifiesto, pago rechazado/aprobado, comprobante, CRUD |
| 8:00-11:00 | Diez pruebas de componentes | Mostrar C01-C10 y ejecutar Jasmine/Karma; escoger ejemplos de spy, evento y estado |
| 11:00-13:00 | Proceso de testing | Configuración, preparación, limpieza, resultados, cobertura HTML y casos pendientes |
| 13:00-15:00 | ERS y decisiones | Requisitos RF, evidencia, límites del frontend y siguientes pasos |

Luego preparen la ronda de preguntas de 5 minutos. Ambos deben dominar la aplicación completa.

## Preparación de la demo

1. Clonar o actualizar la rama final y ejecutar `npm ci` con Node 22.
2. Abrir Chrome y ejecutar `npm run test:karma`. Para Chrome en una ruta distinta, configurar CHROME_BIN.
3. Ejecutar `npm start` y abrir http://localhost:3000.
4. Usar un perfil de navegador nuevo para partir con los datos iniciales. No borrar datos personales del navegador.
5. Cuenta administrativa de demostración: admin@skyops.cl / skyops123. Registrar otra cuenta con datos ficticios para el cliente.
6. Tener a mano `coverage/karma/index.html`, ERS, informe y el repositorio. Instalar dependencias antes de la clase.

## Guion técnico con ejemplos concretos

### Framework y estructura

“Antes teníamos ocho páginas HTML con JavaScript que modificaba el DOM. En esta entrega React renderiza componentes según los datos y usamos React Router para cambiar de vista. App define las rutas y Layout mantiene el menú y el pie de página.”

Mostrar `src/App.js`, la ruta `/catalogo/:pn`, `useParams` en ProductDetailPage y `useSearchParams` en CatalogPage. Explicar que una SPA usa una página HTML y que React muestra componentes distintos sin descargar otro documento completo.

### Props y estado

“ProductCard recibe `product` y `onAdd` mediante props. El padre entrega el producto y la función para agregarlo. La tarjeta conserva en state la cantidad y sus mensajes. Al cambiar la cantidad con setQuantity, React vuelve a renderizar el campo.”

En ProductForm, `initial` permite reutilizar el mismo formulario para crear y editar. `categories` entrega las opciones. `onSave` y `onCancel` permiten que el padre decida qué hacer sin duplicar el formulario.

### Formularios y validación

“Un formulario controlado toma su valor desde el estado de React. onChange actualiza ese estado. Al enviar, preventDefault evita recargar y validamos los campos. Los errores se muestran junto a cada input. onBlur permite avisar al salir del campo.”

Demostrar matrícula inválida y formulario vacío. Mostrar que las etiquetas tienen controlId/htmlFor y que el checkbox se controla mediante checked.

### Persistencia y responsabilidades

“localStorage guarda texto. Convertimos los arreglos a JSON al guardar y los reconstruimos al leer. storage.js centraliza ese acceso. shop.js contiene las reglas de cantidades, precios, CRUD y confirmación de órdenes. Las páginas se encargan de mostrar datos y capturar eventos.”

Explicar `useStoredData`: useState carga datos iniciales, useEffect registra los eventos y su limpieza elimina listeners al desmontar. `skyops:change` actualiza esta pestaña y `storage` actualiza otras. No confundir almacenamiento del navegador con base de datos o backend.

### Compra y stock

Agregar una pieza al manifiesto no la descuenta. Al confirmar, el servicio revalida stock y crea una instantánea para el comprobante. En pago aprobado guarda la orden, descuenta inventario y vacía el manifiesto. En pago rechazado conserva los datos. Demostrar ambos resultados usando el selector explícito de simulación.

### Responsividad

Mostrar la vista a 390, 768 y 1440 píxeles. Explicar `Col md={6} lg={4}`: una tarjeta por fila en móvil, dos desde md y tres desde lg. Navbar colapsa y las tablas se desplazan dentro de table-responsive.

## Diez pruebas para mostrar durante la exposición

| Caso | Qué valida | Concepto |
| --- | --- | --- |
| C01 | Nombre del producto recibido | Props y renderizado |
| C02 | Tres componentes del catálogo | Renderizado de listas |
| C03 | Escribir filtra fichas | Estado y DOM |
| C04 | Categoría de la URL filtra productos | Navegación y entrada |
| C05 | Texto inexistente muestra mensaje vacío | Renderizado condicional |
| C06 | Stock cero deshabilita agregar | Regla de negocio y DOM |
| C07 | Callback recibe P/N y cantidad | Evento y spy |
| C08 | Servicio rechazado muestra error | Mock y caso alternativo |
| C09 | Agregar persiste y actualiza contador | Integración de componentes |
| C10 | Ofertas excluye precio normal | Filtro y regla comercial |

No leer las diez pruebas completas. Mostrar el archivo, explicar la intención y profundizar en C03, C07 y C08. La suite también cubre checkout, administración y servicios.

## Proceso de testing

Preparar datos y DOM propios para cada caso. Ejecutar la acción con fireEvent. Comprobar el resultado visible o persistido con expect. Los spies sustituyen callbacks y comportamientos del navegador para observar o simular efectos. afterEach(cleanup) desmonta componentes y beforeEach limpia los datos de demostración. Jasmine organiza y valida los casos; Karma los ejecuta en Chrome. Webpack/Babel transforma imports y JSX y Babel/Istanbul instrumenta el código antes de empaquetar.

Cobertura de líneas indica qué líneas se ejecutaron. Ramas indica alternativas como stock disponible/agotado, pago aprobado/rechazado y formulario válido/inválido. Un porcentaje alto ayuda a ubicar huecos, pero no demuestra que el sistema no tenga errores. Ver informe de testing para los resultados medidos y límites.

GitHub Actions instala con npm ci, ejecuta Jest y Karma, compila y guarda evidencias. package-lock fija las versiones de paquetes. El umbral interno de cobertura es 90%; la rúbrica no fija ese porcentaje.

## Preguntas que ambos deben poder responder

| Pregunta | Respuesta orientadora |
| --- | --- |
| ¿Cuál es la diferencia entre props y state? | Props llegan del padre; state representa datos que el componente actualiza mediante su setter |
| ¿Por qué no modifican el DOM a mano? | React mantiene la interfaz coherente con el estado y evita sincronizar manualmente campos y listas |
| ¿Por qué usan key? | React identifica cada elemento de una lista al actualizarla; aquí el P/N identifica componentes |
| ¿Qué hace preventDefault? | Evita el envío nativo y la recarga para manejar el formulario desde React |
| ¿Qué es un mock? | Un sustituto controlado de una dependencia para probar resultados sin ejecutar el efecto real |
| ¿Jasmine y Karma son lo mismo? | Jasmine define y verifica pruebas; Karma abre el navegador y coordina su ejecución |
| ¿Por qué falló el CI anterior? | Caché sin lockfile y ausencia de pruebas Karma en el pipeline; no había ejecución de componentes con Jasmine |
| ¿Qué pasa si cambió el stock? | confirmOrder consulta el catálogo actual y rechaza si la cantidad ya no está disponible |
| ¿Qué pasa si se elimina un producto comprado? | La orden conserva una instantánea de sus datos y precios |
| ¿El login protege datos reales? | Es una simulación frontend. La seguridad real requiere validación y autorización en servidor |
| ¿Hay un mínimo de commits? | Los dos PDF no fijan un número. Mostrar avances reales de ambos integrantes y confirmar indicaciones adicionales del docente |
| ¿Dónde está la evidencia? | Casos en test, informes en coverage/karma y test-results, y resumen en docs/evidencias |

## Trabajo de los integrantes

Dividan tareas reales, revisen los cambios preparados y documenten qué hizo cada uno. Usen commits con mensajes concretos y PR para revisar. No atribuyan los cambios del asistente a un integrante ni creen commits vacíos para inflar el historial. El equipo debe ensayar la aplicación y corregir cualquier requisito específico que el docente agregue.
