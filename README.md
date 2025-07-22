# 🎯 Clasificador de Acentos

Una aplicación web educativa para que niños de 10 años practiquen la clasificación de palabras según su acentuación (agudas, graves/llanas, esdrújulas).

## 🌟 Características

- 🎯 Juego interactivo de clasificación de acentos
- 📱 Diseño responsive para móviles y PC
- 📊 Estadísticas de progreso en tiempo real
- 🎨 Interfaz colorida y atractiva para niños
- 🚀 91 palabras apropiadas para edad escolar
- 🔄 Sistema anti-repetición de palabras
- ✨ Animaciones divertidas y feedback motivador

## 🚀 Demo en Vivo

- **Frontend**: [https://tu-app.netlify.app](https://tu-app.netlify.app)
- **API**: [https://tu-app.koyeb.app](https://tu-app.koyeb.app)

## 🛠️ Tecnologías

### Frontend
- React 18 + TypeScript
- Vite para build optimizado
- Tailwind CSS para estilos
- Zustand para estado global
- Axios para API calls

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM + PostgreSQL
- Arquitectura modular

## 📊 Base de Datos

- **91 palabras** apropiadas para niños de 10 años
- **32 palabras agudas** (canción, café, celular...)
- **29 palabras graves** (casa, árbol, fácil...)
- **30 palabras esdrújulas** (teléfono, médico, música...)

## 🚀 Deployment

### Servicios Utilizados (100% Gratuitos)
- **Frontend**: Netlify
- **Backend**: Koyeb
- **Base de Datos**: Supabase (PostgreSQL)

### Variables de Entorno

#### Backend
```bash
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://tu-app.netlify.app
```

#### Frontend
```bash
VITE_API_BASE_URL=https://tu-app.koyeb.app
```

## 🏃‍♂️ Desarrollo Local

### Prerrequisitos
- Node.js 18+
- npm

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/clasificador-acentos
cd clasificador-acentos

# Instalar dependencias
npm install
cd frontend && npm install
cd ../backend && npm install

# Configurar base de datos local
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed

# Iniciar desarrollo
cd ..
npm run dev
```

## 📚 API Endpoints

- `GET /api/words/random` - Palabra aleatoria
- `GET /api/words/batch?count=10` - Múltiples palabras
- `GET /api/words/stats` - Estadísticas de la DB
- `GET /health` - Health check

## 🎓 Uso Educativo

Perfecto para:
- **Escuelas primarias** (4to-6to grado)
- **Clases de español** como lengua nativa
- **Práctica individual** en casa
- **Refuerzo educativo** de gramática

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -m 'Agrega mejora'`)
4. Push (`git push origin feature/mejora`)
5. Abre Pull Request

## 📄 Licencia

MIT - Libre para uso educativo

---

**Hecho con ❤️ para la educación de niños**