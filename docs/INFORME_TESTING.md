# Informe de testing de SkyOps para la Evaluación Parcial 2

**Asignatura:** DSY1104 Desarrollo Fullstack II, Duoc UC.  
**Integrantes:** Agustín Boeri y Cristian Rivera.  
**Fecha:** 9 de octubre de 2026.

## 1. Objetivo y alcance

Se comprueban diez casos de componentes React con Jasmine y Karma, según la pauta de evaluación. Los casos verifican renderizado, props, estado, eventos, manipulación del DOM y comportamientos principales de la tienda. Se conserva el frontend del primer SkyOps y las vistas nuevas del anexo.

La suite ampliada anterior se retiró para limitar el proyecto al alcance solicitado. Los cinco tests Jest que ya tenía el repositorio React permanecen como comprobación heredada. No se suman a las diez pruebas principales ni se mezclan sus porcentajes de cobertura.

## 2. Entorno y configuración

React 18, React Bootstrap, Jasmine, Karma, webpack y Babel. La ejecución local utilizó Node 24.19.0 y Chromium 153.0.8010.0; el entorno recomendado y el CI usan Node 22. Las fuentes se instrumentan con Babel/Istanbul antes de empaquetarlas. Se excluyen archivos de tests, arranque, setup y datos iniciales; no se instrumentan dependencias externas.

Karma ejecuta test/components.spec.js en Chrome. MemoryRouter permite montar rutas y enlaces en las pruebas. beforeEach limpia almacenamiento e inicializa datos; afterEach desmonta los componentes. Así cada caso parte de datos propios.

## 3. Casos de prueba

| Caso | Preparación y acción | Resultado esperado | Concepto |
| --- | --- | --- | --- |
| C01 | Montar ProductCard con un producto | Aparece el encabezado con su nombre | Renderizado y props |
| C02 | Abrir el catálogo con tres productos | Se muestran tres fichas | Listas y DOM |
| C03 | Escribir Turbina en el buscador | Queda una ficha y desaparece otro producto | Evento, URL y actualización |
| C04 | Elegir dos unidades y presionar agregar | Callback recibe P/N y 2; aparece mensaje | Estado, eventos y spy |
| C05 | Simular un callback que lanza error | Antes no hay alerta; después aparece el error | Mock y condición |
| C06 | Cambiar la cantidad del manifiesto | Se guardan dos unidades y se actualiza la vista | Estado y persistencia |
| C07 | Enviar un checkout con datos incompletos | Se muestran errores y no se crea una orden | Validación del formulario |
| C08 | Confirmar una compra válida | Comprobante, orden, stock descontado y carrito vacío | Flujo aprobado |
| C09 | Confirmar con pago simulado rechazado | Mensaje de fallo, mismo stock y carrito conservado | Flujo rechazado |
| C10 | Administrador crea, edita y elimina un componente | Se guarda, cambia stock y desaparece al confirmar | CRUD desde la interfaz |

Cada fila corresponde a un it de Jasmine. C10 verifica un único recorrido administrativo completo, con varias comprobaciones sobre los datos y el DOM.

## 4. Mocks y aislamiento

C04 usa jasmine.createSpy para observar argumentos y número de llamadas. C05 usa and.throwError para provocar un fallo controlado y verificar su presentación. C10 reemplaza window.confirm con un spy que devuelve true para poder comprobar la eliminación sin interacción manual.

No se realiza ningún pago real ni se usa una API externa. Las compras y los datos son locales. Las pruebas no utilizan los datos del navegador habitual del estudiante.

## 5. Resultados medidos

**Jasmine/Karma: 10 de 10 pruebas correctas, cero fallidas.**

| Métrica de cobertura principal | Resultado | Elementos ejecutados |
| --- | --- | --- |
| Sentencias | 47,27 % | 234 de 495 |
| Ramas | 45,98 % | 189 de 411 |
| Funciones | 43,34 % | 88 de 203 |
| Líneas | 48,26 % | 223 de 462 |

Estos porcentajes corresponden a la suite reducida. No se mantiene el 97,64 % de la suite anterior. No hay un umbral del 90 % ni otro porcentaje añadido por el proyecto. La pauta solicita cobertura y análisis; no fija un porcentaje obligatorio.

La configuración instrumenta los módulos importados por los casos. El reporte no es prueba de cobertura exhaustiva de todos los archivos del repositorio: algunos componentes solo aparecen al ser importados y hay rutas sin comportamiento ejecutado en esta suite.

## 6. Análisis y límites

Se comprobaron los recorridos de compra principales y el mantenimiento de productos. Quedan fuera de comprobación automatizada detallada las operaciones de categorías, edición de usuarios, perfil, todas las opciones de reportes, flota, contacto y algunos estados límite. La búsqueda de cobertura alta no debe sustituir la explicación de qué hace cada expectativa.

La selección de diez pruebas reduce el mantenimiento y facilita la defensa, pero ofrece menos protección que la suite ampliada anterior. Diez casos correctos no garantizan ausencia de errores ni que la evaluación de cobertura alcance el nivel máximo de la pauta. La respuesta correcta frente a estos límites es reconocerlos y demostrar los casos existentes.

Se conservan capturas de escritorio, tablet y móvil tomadas durante la comprobación del diseño responsivo. No sustituyen las pruebas de componentes ni prueban por sí solas cada función.

## 7. Reproducir

```powershell
npm ci
npm run test:karma
npm run test:ci -- --runInBand
npm run build
```

Si Chrome está en una ruta diferente, configurar CHROME_BIN.

El informe HTML se genera en coverage/karma/index.html. El resumen se conserva en docs/evidencias/cobertura-karma.json. La configuración produce HTML, resumen de terminal y JSON, sin LCOV ni JUnit.

## 8. Entrega y defensa

Entregar el repositorio público, el proyecto comprimido, la ERS V2 y este informe. Durante la exposición se deben mostrar los diez casos, explicar preparación, acción y expectativas y profundizar en props, estado, callback y errores. El CI ya existente se conserva para instalar, probar y compilar; no agrega despliegue ni publicación de artefactos.
