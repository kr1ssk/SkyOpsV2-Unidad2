# SkyOpsV2 · Unidad 2

Migración de **SkyOpsV2** desde HTML/CSS/JavaScript tradicional hacia **React**, manteniendo el flujo funcional del proyecto original y agregando contenidos trabajados en la Unidad 2 de DSY1104.

## Qué incluye

- React con JSX y componentes reutilizables.
- SPA con React Router.
- React Bootstrap y Bootstrap.
- Diseño responsivo.
- Organización inspirada en **Atomic Design**: átomos, moléculas, organismos/páginas.
- Separación por componentes, páginas, servicios, datos y utilidades.
- Formularios controlados y validaciones.
- Persistencia con localStorage y sessionStorage.
- Flujo AOG completo: **Flota → Catálogo → Manifiesto → Despacho → Bitácora**.
- Pruebas con React Testing Library/Jest.
- Configuración adicional de **Jasmine + Karma**.
- Reportes de cobertura con Jest y Karma Coverage.
- buildspec.yml para AWS CodeBuild.
- GitHub Actions para test y build.

## Requisitos

- Node.js 18+
- npm
- Chrome/Chromium instalado para ejecutar Karma en modo ChromeHeadless

## Ejecutar

~~~bash
git clone https://github.com/kr1ssk/SkyOpsV2-Unidad2.git
cd SkyOpsV2-Unidad2
npm install
npm start
~~~

La aplicación queda disponible en http://localhost:3000.

## Pruebas

React Testing Library / Jest:

~~~bash
npm run test:ci
~~~

Jasmine + Karma:

~~~bash
npm run test:karma
~~~

Los reportes de Karma se generan en coverage/karma/.

## Build

~~~bash
npm run build
~~~

El resultado queda en build/.

## Estructura

~~~text
src/
├── components/
│   ├── atoms/
│   │   └── StatusBadge.js
│   ├── molecules/
│   │   └── KpiCard.js
│   ├── AppNavbar.js
│   └── Layout.js
├── data/
│   └── seed.js
├── pages/
│   ├── HomePage.js
│   ├── ProjectPage.js
│   ├── FleetPage.js
│   ├── CatalogPage.js
│   ├── ManifestPage.js
│   ├── DispatchPage.js
│   ├── LogbookPage.js
│   └── ContactPage.js
├── services/
│   └── storage.js
├── utils/
│   ├── validators.js
│   └── validators.test.js
├── App.js
├── App.test.js
├── index.js
└── styles.css
~~~

## Relación con el proyecto original

Esta versión no reemplaza SkyOpsV2. Es una copia evolutiva para trabajar la **Unidad 2** sin perder la entrega anterior.

| Antes | Unidad 2 |
|---|---|
| 8 archivos HTML separados | SPA React |
| JavaScript por página | Componentes + páginas React |
| Navegación con enlaces HTML | React Router |
| CSS propio | React Bootstrap + CSS propio |
| DOM manual | Renderizado declarativo |
| Eventos con addEventListener | Eventos de React |
| Formularios tradicionales | Formularios controlados |
| Sin suite formal de tests | Jest/RTL + Jasmine/Karma |
| Sin cobertura | Cobertura de tests |

## AWS EC2

Para una práctica de desarrollo en EC2 puedes clonar el repo, ejecutar npm install y luego npm start, asegurando que el grupo de seguridad permita el puerto 3000. Para un despliegue real conviene usar npm run build y servir la carpeta build con Nginx u otro servidor web.

## Próximos pasos

Esta migración conserva datos locales porque el backend, autenticación, base de datos y roles quedan fuera de esta etapa. Eso permite concentrar la Unidad 2 en frontend React, diseño responsivo y pruebas.
