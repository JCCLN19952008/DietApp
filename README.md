# DietApp

Una aplicación web ligera y completa para llevar un registro de las comidas, buscar recetas ya guardadas y recibir sugerencias de recetas generadas por el aistente de IA Claude, en función de los ingredientes disponibles ya guardados anteriormente y el tiempo de preparación provisto dentro de unos limites.

Para consultar la planificación del proyecto dirigirse a  : https://trello.com/invite/b/69ea164725301d1af491bcb6/ATTIfbb1e959cc468316314c774de874a482B682AA86/dietapp

## Que puede hacer 

**Registro de comidas** 

Anota tus comidas diarias y lleva un control de lo que comes

**Buscador de recetas**

Busca y explora una biblioteca de recetas filtradas por etiquetas, tiempo y necesidades dietéticas

**Ayudante para recetas**

Se eligen  los ingredientes que tengas a mano dentro de los ya guardados en la app, indicas cuánto tiempo dispones y obtienes sugerencias de recetas personalizadas gracias a  Claude

## Tech Stack previsto 

Front-End: React , Typescript, Tailwind
Back-End: NodeJS , Express
Database: SQLite ( via @lib/sqlclient)
Auth: JWT, bcrypt
AI: Claude

## Estructura de directorios 

```js
DietApp/
├── client/          # Vite + React frontend (port 5173)
│   └── src/
│       ├── pages/   # One file per route/screen
│       ├── context/ # AuthContext (global auth state)
│       └── lib/     # api.ts fetch helper
└── server/          # Express backend (port 3001)
    └── src/
        ├── routes/      # API route handlers
        ├── middleware/   # JWT auth middleware
        └── db.ts        # SQLite connection + table setup
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

PORT : Express port( by default 3001)
CLIENT_URL : CORS Origin ( localhost: 5173)
JWT_ SECRET : Firmado de JWT
ANTHROPIC_API_KEY : Key para sugerencias de Claude

