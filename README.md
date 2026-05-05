# DietApp

Una aplicación web ligera y completa para llevar un registro de las comidas, buscar recetas ya guardadas y recibir sugerencias de recetas generadas por el aistente de IA Claude, en función de los ingredientes disponibles ya guardados anteriormente y el tiempo de preparación provisto dentro de unos limites.

**Live app**: https://dietapp-production.up.railway.app

Para consultar la **planificación** del proyecto dirigirse a :

 https://trello.com/invite/b/69ea164725301d1af491bcb6/ATTIfbb1e959cc468316314c774de874a482B682AA86/dietapp

## Que puede hacer 

**Registro de comidas** 

Anota tus comidas diarias y lleva un control de lo que comes

**Historial de Comidas**

Permite navegar por los días anteriores con el navegador de fechas

**Registrar como comidas como recetas**

Te convierte cualquier comida registrada en una receta completa con ingredientes e instrucciones

**Buscador de recetas**

Busca y explora una biblioteca de recetas filtradas por etiquetas, tiempo y necesidades dietéticas

**Ayudante para recetas**

Se eligen  los ingredientes que tengas a mano dentro de los ya guardados en la app, indicas cuánto tiempo dispones y obtienes sugerencias de recetas personalizadas gracias a  Claude.

**Guardado de recetas sugeridas por Claude**

Pemrite guardar cualquier receta sugerida por la IA directamente en tu biblioteca de recetas con un solo click.

## Tech Stack previsto 

Front-End: React , Typescript, Tailwind , Vite
Back-End: NodeJS , Express , Typescript
Database: Turso (cloud SQLite via @libsql/client)
Auth: JWT, bcrypt
AI: Claude
Despliegue: Railway( Fullstack , tanto Front-End como Back-End)

## Estructura de directorios 

```js

DietApp/
|
├── client/                  # Vite + React frontend
│   └── src/
│       ├── pages/           # One file per route
│       ├── components/      # Shared components (Nav, PrivateRoute, ErrorBoundary)
│       ├── hooks/           # Custom hooks (useMeals, useRecipes)
│       ├── context/         # AuthContext — global auth state
│       └── lib/             # api.ts — fetch wrapper
|
└── server/                  # Express backend
    └── src/
        ├── routes/          # auth, meals, recipes, suggestions
        ├── middleware/       # JWT auth middleware
        └── db.ts            # Turso connection + table setup + Datos por defecto
```
## Para arrancar la app localmente

### En terminal 1 para Server

```js
cd server
npm install
npm run dev
```

### En terminal 2 para Client

```js
cd client
npm install
npm run dev
```

## Variables de Entorno

Presentes en server/.env 

PORT : Express port( by default 3001)
CLIENT_URL : CORS Origin ( localhost: 5173)
JWT_ SECRET : Firmado de JWT
ANTHROPIC_API_KEY : Key para sugerencias de Claude
TURSO_DATABASE_URL : URL de alojamiento de la base datos
TURSO_AUTH:TOKEN : Token de Autenticacion de la base datos

## Como funciona le despliegue

La aplicación se ejecuta como un único servicio en Railway:

1-El servidor Express que levantamos al principio del desarrollo de la APP aloja tanto las API (/api/*) como la interfaz de usuario de React integrada (se ha optado por emplear archivos estáticos).

2-La base de datos está alojada en Turso, un servicio SQLite en la nube que almacena los datos de forma permanente.

3-Cada actualización del codigo desarrollado  en la rama "main" activa una reimplementación automática en Railway, de no hacerlo los cambios permanecen en local.

