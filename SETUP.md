# Guía de Configuración del Proyecto

## Prerrequisitos

Para ejecutar este proyecto necesitas instalar Node.js y npm.

### Instalación de Node.js

1. **Opción 1: Descarga directa**
   - Ve a https://nodejs.org/
   - Descarga la versión LTS (recomendada)
   - Ejecuta el instalador y sigue las instrucciones
   - Esto instalará tanto Node.js como npm

2. **Opción 2: Usando Chocolatey (Windows)**
   ```powershell
   # Instalar Chocolatey primero (si no lo tienes)
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   
   # Instalar Node.js
   choco install nodejs
   ```

3. **Verificar instalación**
   ```bash
   node --version
   npm --version
   ```

## Configuración del Proyecto

Una vez que tengas Node.js instalado:

### 1. Instalar dependencias

```bash
# Instalar dependencias del proyecto raíz
npm install

# Instalar dependencias de todos los módulos
npm run install:all
```

### 2. Configurar la base de datos

```bash
# Ir al directorio backend
cd backend

# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Poblar base de datos con datos de ejemplo
npm run db:seed
```

### 3. Iniciar el proyecto

```bash
# Desde el directorio raíz
npm run dev
```

Esto iniciará:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### 4. Verificar que funciona

1. Abre http://localhost:5173 en tu navegador
2. Deberías ver la aplicación del Clasificador de Acentos
3. Haz clic en "Comenzar juego" para probar

## Estructura de Archivos Creados

```
clasificador-acentos/
├── package.json                 # Configuración del workspace
├── README.md                    # Documentación principal
├── SETUP.md                     # Esta guía de configuración
│
├── shared/                      # Módulo de tipos compartidos
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── types/               # Interfaces TypeScript
│       ├── constants/           # Constantes de la app
│       ├── utils/               # Funciones utilitarias
│       └── index.ts
│
├── backend/                     # API Node.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma        # Esquema de base de datos
│   └── src/
│       ├── classification/      # Lógica de clasificación de acentos
│       ├── database/           # Cliente DB y repositorios
│       ├── services/           # Servicios de negocio
│       ├── routes/             # Endpoints de API
│       ├── app.ts              # Configuración Express
│       └── index.ts            # Punto de entrada
│
└── frontend/                    # Aplicación React
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── components/          # Componentes React
        ├── store/              # Estado global (Zustand)
        ├── api/                # Cliente API
        ├── App.tsx
        ├── main.tsx
        └── index.css
```

## Funcionalidades Implementadas

✅ **Backend**:
- Clasificador de acentos con lógica de sílabas
- Base de datos SQLite con Prisma
- API REST con endpoints para palabras
- Arquitectura modular y tipada

✅ **Frontend**:
- Interfaz responsive con Tailwind CSS
- Componentes modulares de React
- Estado global con Zustand
- Cliente API con manejo de errores

✅ **Características del Juego**:
- Obtención de palabras aleatorias
- Clasificación interactiva (aguda/grave/esdrújula)
- Estadísticas en tiempo real
- Feedback detallado con explicaciones
- Diseño responsive para móvil y PC

## Próximos Pasos

Para completar el proyecto según la especificación:

1. **Funcionalidad PWA**: Configurar Service Worker para uso offline
2. **Cache offline**: Implementar IndexedDB para almacenamiento local
3. **API externa**: Integrar con API de palabras en español
4. **Tests**: Agregar tests unitarios y de integración
5. **Deployment**: Configurar para producción

## Solución de Problemas

### Error: "npm no se reconoce"
- Instala Node.js desde https://nodejs.org/

### Error: "Cannot find module"
- Ejecuta `npm run install:all` desde el directorio raíz

### Error de base de datos
- Ejecuta `cd backend && npm run db:migrate && npm run db:seed`

### Puerto ocupado
- Cambia los puertos en `vite.config.ts` (frontend) o `src/index.ts` (backend)