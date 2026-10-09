# ERS V2: SkyOps, tienda de componentes y despacho AOG

**Asignatura:** DSY1104 Desarrollo Fullstack II, Duoc UC.  
**Integrantes del proyecto:** Agustín Boeri y Cristian Rivera.  
**Versión:** 2.0, propuesta para Evaluación Parcial 2.  
**Fecha:** 9 de octubre de 2026.

## 1. Propósito y contexto

SkyOps organiza la selección, compra simulada y despacho de componentes aeronáuticos para una aeronave detenida en tierra (AOG). La temática aeronáutica mantiene el caso autorizado por el docente y demuestra las funcionalidades de una tienda online. Este documento especifica la versión React de la entrega 2 y debe ser revisado por ambos integrantes antes de entregar.

El problema del prototipo anterior es que las vistas HTML usan manipulación manual del DOM, el catálogo ofrece filtros y el manifiesto reúne repuestos, pero faltan funcionalidades comerciales, CRUD completo y pruebas de componentes. La versión 2 conserva el recorrido Flota, Catálogo, Manifiesto, Despacho y Bitácora y agrega categorías, ofertas, detalle, perfil, órdenes y administración.

## 2. Alcance y límites

La aplicación implementa una SPA React con React Router, Bootstrap y React Bootstrap. La persistencia se simula con archivos JavaScript de datos iniciales y localStorage. sessionStorage conserva la aeronave seleccionada durante la visita.

El pago tiene resultados de demostración aprobado/rechazado. No realiza cobros ni solicita números de tarjeta. El comprobante es académico y no es una boleta tributaria. Las imágenes y precios son ejemplos del proyecto, no cotizaciones comerciales ni certificaciones reales.

Registro, sesión y roles funcionan exclusivamente como simulación frontend. Las contraseñas de demostración se guardan localmente siguiendo el ejemplo docente y no deben ser contraseñas personales. No existen autenticación de servidor, permisos seguros, sincronización multiusuario, pasarela de pago ni backend REST. El anexo menciona integración backend/frontend, pero también pide persistencia simulada en JS. El equipo debe confirmar con el docente si exige un backend operativo para esta entrega.

## 3. Actores

| Actor | Objetivo | Funciones |
| --- | --- | --- |
| Visitante | Explorar repuestos y realizar una orden de demostración | Catálogo, búsqueda, detalle, categorías, ofertas, manifiesto, checkout, blog y contacto |
| Usuario registrado | Conservar datos de entrega y consultar pedidos | Registro, login, perfil, autocompletado, historial y logout |
| Administrador de demostración | Mantener la oferta y consultar operaciones | Dashboard, CRUD de componentes y categorías, usuarios, órdenes, comprobantes, reportes y stock crítico |
| Responsable operativo | Dar seguimiento al despacho AOG | Selección de flota, matrícula, destino, licencia y cierre en bitácora |

## 4. Requisitos funcionales

| ID | Requisito verificable | Criterio de aceptación | Evidencia automatizada |
| --- | --- | --- | --- |
| RF01 | Navegación SPA | Menú común y rutas de React Router; ruta desconocida muestra alternativa de retorno | C11, C25, V04 |
| RF02 | Catálogo | Renderiza los datos de cada componente y su imagen local | C01, C02 |
| RF03 | Búsqueda y filtros | Combina texto, categoría, ATA y stock; limpiar restaura resultados; filtros aparecen en URL | C03-C05, V11-V12 |
| RF04 | Categorías y detalle | Cada categoría navega al catálogo filtrado; detalle por P/N y manejo de identificador inexistente | C11-C12, V02 |
| RF05 | Ofertas | Solo muestra componentes cuyo descuento es mayor a cero y calcula el precio final | C10, S01 |
| RF06 | Agregar al manifiesto | Recibe una cantidad entera positiva y no permite exceder stock al agregar repetidamente | C07-C09, S02-S04 |
| RF07 | Editar manifiesto | Modifica cantidad, elimina una línea con cantidad cero y permite vaciar con confirmación | C13-C14, V13-V14, S05 |
| RF08 | Resumen comercial | Muestra subtotal por línea, unidades y total en CLP con descuentos | C13, S01 |
| RF09 | Selección de aeronave | Flota filtra y guarda matrícula para avisar en catálogo y completar despacho | V06 |
| RF10 | Checkout validado | Requiere matrícula CC-XXX, nombre y apellido, licencia AA-0000, destino, dirección y declaración | C15-C17 |
| RF11 | Compra aprobada | Revalida stock, guarda orden e instantánea de productos, descuenta inventario, vacía carrito y genera comprobante | C18, S07-S09 |
| RF12 | Compra fallida | Rechazo conserva carrito e inventario y muestra reintento; fallo de guardado restaura el estado previo | C19, S06, S18 |
| RF13 | Comprobante e historial | Comprobante incluye folio, fecha, productos, cantidades, entrega y total; usuarios consultan sus pedidos | V21, V26-V29 |
| RF14 | Bitácora | Filtra por matrícula y estado; resolver marca despacho y orden como completados | V07 |
| RF15 | Registro y sesión | Valida datos y correo único; login erróneo informa; logout actualiza el menú | C30-C31, S16-S17, V31, V33 |
| RF16 | Perfil y autocompletado | Edita nombre y dirección persistidos; checkout toma ambos al iniciar la vista | C20, C31, V22, V34 |
| RF17 | CRUD de componentes | Crea, lista, edita y elimina; valida P/N único, precio positivo, stock entero y descuento 0-90% | C21-C23, C26-C28, S10-S11 |
| RF18 | CRUD de categorías | Crea, lista, renombra y elimina; renombrar actualiza componentes; bloquea eliminación si está usada | C29, S12, V17-V18 |
| RF19 | Administración y reportes | Acceso de demostración por rol, dashboard, órdenes, usuarios, stock crítico y total de ventas | C24, V15-V16, V21-V24 |
| RF20 | Contenido y contacto | Páginas de proyecto, blog y contacto con validaciones; contacto genera ticket simulado | V03-V05, V08-V09 |
| RF21 | Persistencia y actualización | Cambios actualizan estado React y menú; no repone elementos borrados al recargar; maneja JSON dañado | C09, S13-S15, V32 |

## 5. Requisitos no funcionales

| ID | Requisito | Comprobación |
| --- | --- | --- |
| RNF01 | Responsividad Bootstrap | Grillas col-md y col-lg, navbar colapsable y tablas con contenedor responsive; revisar a 390, 768 y 1440 píxeles |
| RNF02 | Componentes comprensibles | ProductCard recibe product y onAdd; ProductForm recibe initial, categories y callbacks; páginas coordinan servicios |
| RNF03 | Usabilidad | Etiquetas asociadas a inputs, errores junto a campos, avisos de stock y estados vacíos |
| RNF04 | Pruebas | Jasmine ejecuta lógica y componentes en Chrome mediante Karma; mocks con spies y limpieza entre casos |
| RNF05 | Cobertura | Reportes HTML, JSON, LCOV y JUnit; umbral interno 90% por métrica, elegido por el proyecto y no impuesto por la rúbrica |
| RNF06 | Instalación repetible | package-lock.json versionado y npm ci en GitHub Actions; Node 22 para CI |
| RNF07 | Recursos propios | Imágenes SVG locales recuperadas del repositorio original; no dependen de una URL de imágenes externa |

## 6. Datos y persistencia

- Componente: nombre, pn, sn, ata, bodega, categoria, stock, precio, descuento, certificado e imagen.
- Línea de manifiesto: datos del componente y cantidad. No reserva stock al agregar.
- Orden: id UUID, folio, fecha, usuarioId, matrícula, responsable, licencia, dirección, entrega, destino, declaración, items, total y estado.
- Categoría: nombre único. Se bloquea borrar si existen productos asociados.
- Usuario de demostración: id, nombre, correo, contraseña de ejemplo, rol y dirección. La sesión pública omite la contraseña.
- Bitácora: registro de despacho con folio, responsable, fecha y estado.

`src/data/seed.js` contiene datos iniciales. `src/services/storage.js` inicializa claves ausentes, lee y guarda JSON, y emite `skyops:change`. `src/hooks/useStoredData.js` sincroniza estado React con cambios propios y eventos storage de otras pestañas. La migración completa precios de registros previos conocidos sin reemplazar su stock.

## 7. Reglas de negocio

1. Una cantidad debe ser un entero mayor a cero para agregar. En el manifiesto, cero elimina la línea.
2. Stock cero deshabilita agregar. No se puede superar el stock acumulando varios clics.
3. El stock se descuenta al confirmar una compra aprobada, no al explorar o armar el manifiesto.
4. Antes de comprar se consulta el catálogo actual para detectar cambios de disponibilidad.
5. El rechazo de pago no registra pedidos ni modifica stock. La orden conserva una instantánea de los productos para no perder el comprobante cuando se edita el catálogo.
6. P/N único, precio mayor a cero, stock entero no negativo y descuento entre 0 y 90%.
7. Stock crítico: dos unidades o menos. Es un umbral definido para la propuesta académica.
8. Las piezas sin certificado muestran una advertencia. La aplicación no simula una certificación ni una autorización técnica real.
9. La matrícula usa CC- y tres letras; la licencia usa dos letras, guion y cuatro dígitos. Son validaciones de formato para la demostración.

## 8. Casos de uso principales

**CU01 Compra de repuesto.** Visitante o usuario selecciona aeronave opcionalmente, filtra catálogo, consulta detalle, agrega cantidades y revisa manifiesto. Completa checkout y selecciona resultado de pago de demostración. Si se aprueba, obtiene comprobante y registro en bitácora. Si se rechaza, conserva su selección y puede reintentar.

**CU02 Mantención de catálogo.** Administrador inicia sesión, abre Componentes y crea o edita un producto con su categoría, precio y stock. El servicio valida antes de persistir. Si elimina, la interfaz pide confirmación y retira también las líneas activas de ese componente. Los pedidos históricos mantienen su detalle.

**CU03 Seguimiento AOG.** Responsable consulta bitácora, filtra por matrícula y estado y resuelve una orden en curso. El registro y el pedido asociado cambian a COMPLETADO.

## 9. Correspondencia con la pauta

| Indicadores | Evidencia en esta versión |
| --- | --- |
| IE2.1.1 / IE2.1.3 | Estructura src, rutas SPA, servicios y demostración del flujo |
| IE2.1.2 / IE2.1.4 | Props de ProductCard/ProductForm, estados de formularios, hook persistente, Bootstrap responsive |
| IE2.2.1 / IE2.2.2 | Diez casos C01-C10 como selección mínima y suite ampliada de componentes, servicios y validadores |
| IE2.3.1 / IE2.3.2 | Karma, webpack/Babel, spies, limpieza de pruebas, cobertura, JUnit y CI |

La pauta asigna 40% al encargo y 60% a la presentación individual. El equipo debe comprobar los documentos, ensayar la demostración y poder explicar sus decisiones. Esta propuesta no sustituye la revisión del docente ni asegura una calificación.

## 10. Fuentes y decisiones

- Rúbrica DSY1104 Evaluación Parcial 2 y Anexo 1 entregados por el estudiante.
- Original: https://github.com/kr1ssk/SkyOpsV2
- Continuación React: https://github.com/kr1ssk/SkyOpsV2-Unidad2
- Persistencia, usuario y SPA: https://github.com/donkiwicl/fs2-react-ejemplos
- Guía docente Jasmine/Karma: https://github.com/donkiwicl/donkiwicl.github.io/blob/main/GUIA_INSTALACION_JASMINE_KARMA.md

Los conceptos de los ejemplos docentes orientan esta implementación; no se traslada la versión de React/Vite de los ejemplos al proyecto existente. Se mantiene React 18 y react-scripts para reducir el alcance de la migración. `poo_tareafonda` corresponde a DSY1102 y Java/JavaFX, y no se usa como especificación de Fullstack II.
