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
- 🔧 Configuración robusta de variables de entorno
- 🧪 Tests unitarios y herramientas de debug
- 🛡️ **Row Level Security (RLS)** implementado para máxima seguridad de datos

## 🚀 Demo en Vivo

- **Frontend**: [https://clasificador-acentos.netlify.app](https://clasificador-acentos.netlify.app)
- **API**: [https://bold-rania-af-93-147cdd98.koyeb.app](https://bold-rania-af-93-147cdd98.koyeb.app)

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

#### Backend (.env)
```bash
# Usuario de API con permisos limitados (solo lectura)
DATABASE_URL="postgresql://clasificador_api_user:ClasificadorAPI2024!SecurePass@host:port/database"

# Usuario administrador para migraciones y operaciones de escritura
ADMIN_DATABASE_URL="postgresql://clasificador_admin_user:ClasificadorAdmin2024!SuperSecure@host:port/database"

PORT=3001
NODE_ENV=production
FRONTEND_URL=https://clasificador-acentos.netlify.app
```

#### Frontend (Netlify Environment Variables)
```bash
VITE_API_BASE_URL=https://bold-rania-af-93-147cdd98.koyeb.app
```

> **Importante**: La variable `VITE_API_BASE_URL` debe configurarse en Netlify sin incluir `/api` al final. El sistema agrega automáticamente esta ruta.

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

## 🧪 Testing

### Ejecutar Tests
```bash
# Frontend tests
cd frontend
npm test

# Tests específicos
npm test -- --testPathPattern=config
npm test -- --testPathPattern=api
```

### Verificación Manual
```bash
# Verificar configuración de entorno
cd frontend/src/verification
# Importar config-test.ts en tu aplicación para debug
```

## 📚 API Endpoints

- `GET /api/words/random` - Palabra aleatoria
- `GET /api/words/batch?count=10` - Múltiples palabras
- `GET /api/words/stats` - Estadísticas de la DB
- `GET /health` - Health check

## 🔧 Configuración y Troubleshooting

### Verificar Configuración
1. **En desarrollo**: Los logs aparecen automáticamente en consola
2. **En producción**: Abrir Developer Tools > Console para ver configuración

### Logs Esperados
```javascript
🔧 Configuración de entorno: { 
  apiBaseUrl: "https://bold-rania-af-93-147cdd98.koyeb.app", 
  environment: "production" 
}
🌐 Cliente API inicializado: { 
  baseUrl: "https://bold-rania-af-93-147cdd98.koyeb.app/api" 
}
```

### Problemas Comunes

#### Error 404 en peticiones API
- **Causa**: Variable `VITE_API_BASE_URL` no configurada correctamente
- **Solución**: Verificar en Netlify que la variable apunte a la URL correcta del backend
- **Debug**: Revisar Network tab para ver a qué URL van las peticiones

#### Build falla en Netlify
- **Causa**: Errores de TypeScript o dependencias faltantes
- **Solución**: Revisar logs de build y corregir errores de tipos
- **Debug**: Ejecutar `npm run build` localmente para reproducir

#### Variables de entorno no se aplican
- **Causa**: Cache de Netlify o configuración incorrecta
- **Solución**: "Clear cache and deploy site" en Netlify
- **Debug**: Verificar que las variables estén en todos los contextos de deploy

### Archivos de Referencia
- `DEPLOYMENT_CHECKLIST.md` - Lista completa de verificación para deploy
- `DEPLOYMENT_STATUS.md` - Estado actual del despliegue
- `.kiro/specs/configuracion-variables-entorno/` - Documentación técnica completa

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