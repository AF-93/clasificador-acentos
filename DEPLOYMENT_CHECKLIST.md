# Lista de Verificación para Despliegue - Configuración de Variables de Entorno

## ✅ Cambios Implementados

### 1. Módulo de Configuración Centralizada
- ✅ Creado `frontend/src/config/environment.ts`
- ✅ Usa `import.meta.env.VITE_API_BASE_URL` correctamente
- ✅ Fallback a `http://localhost:3001` para desarrollo
- ✅ Validación de URL y logging en desarrollo

### 2. Cliente API Actualizado
- ✅ Modificado `frontend/src/api/client.ts`
- ✅ Usa URL completa desde configuración: `${config.apiBaseUrl}/api`
- ✅ Logging mejorado de configuración
- ✅ Manejo de errores específico para problemas de configuración

### 3. Limpieza de Código Legacy
- ✅ Eliminada configuración incorrecta de `APP_CONFIG.API_BASE_URL` en `types/index.ts`
- ✅ No hay referencias huérfanas a la configuración antigua

### 4. Utilidades de Debug
- ✅ Creado `frontend/src/utils/debug.ts`
- ✅ Logging de información de entorno
- ✅ Validación de configuración
- ✅ Mensajes de error mejorados

### 5. Logging de Inicialización
- ✅ Integrado en `frontend/src/main.tsx`
- ✅ Muestra información de configuración al iniciar
- ✅ Solo en modo desarrollo

### 6. Tests Unitarios
- ✅ Tests para configuración de entorno
- ✅ Tests para utilidades de debug
- ✅ Tests para cliente API

### 7. Verificación Manual
- ✅ Archivo de verificación para testing manual

## 🔧 Configuración Requerida en Netlify

### Variable de Entorno
```
VITE_API_BASE_URL=https://bold-rania-af-93-147cdd98.koyeb.app
```

### Verificación
1. La variable debe estar configurada en todos los contextos de despliegue
2. No debe incluir `/api` al final (se agrega automáticamente)
3. Debe ser una URL válida y accesible

## 🚀 Pasos para Desplegar

### 1. Verificar Variable de Entorno
- [ ] Confirmar que `VITE_API_BASE_URL` está configurada en Netlify
- [ ] Verificar que apunta a: `https://bold-rania-af-93-147cdd98.koyeb.app`

### 2. Build y Deploy
- [ ] Hacer commit de todos los cambios
- [ ] Push a repositorio
- [ ] Netlify debería hacer auto-deploy

### 3. Verificación Post-Deploy
- [ ] Abrir la aplicación en producción
- [ ] Abrir Developer Tools > Console
- [ ] Verificar que aparezcan los logs de configuración
- [ ] Confirmar que las peticiones van a la URL correcta
- [ ] Probar funcionalidad de obtener palabras aleatorias

## 🐛 Troubleshooting

### Si sigue apareciendo error 404:

1. **Verificar en Console del navegador:**
   ```
   🔧 Configuración de entorno: { apiBaseUrl: "https://bold-rania-af-93-147cdd98.koyeb.app", ... }
   🌐 Cliente API inicializado: { baseUrl: "https://bold-rania-af-93-147cdd98.koyeb.app/api", ... }
   ```

2. **Verificar peticiones en Network tab:**
   - Las peticiones deben ir a `https://bold-rania-af-93-147cdd98.koyeb.app/api/words/random`
   - NO a `https://clasificador-acentos.netlify.app/api/words/random`

3. **Si usa URL incorrecta:**
   - Verificar que la variable de entorno esté configurada correctamente
   - Hacer "Clear cache and deploy site" en Netlify
   - Verificar que no hay cache del navegador

### Mensajes de Error Esperados:
- ✅ En desarrollo sin variable: "⚠️ VITE_API_BASE_URL no está definida, usando URL por defecto"
- ✅ En producción con variable: Logs de configuración correcta
- ❌ Si aparece error de configuración: Revisar variable de entorno

## 📋 Checklist Final

- [ ] Variable `VITE_API_BASE_URL` configurada en Netlify
- [ ] Build exitoso sin errores
- [ ] Deploy completado
- [ ] Console logs muestran configuración correcta
- [ ] Peticiones API van a la URL correcta
- [ ] Funcionalidad de la aplicación funciona
- [ ] No hay errores 404 en Network tab

## 🎯 Resultado Esperado

Después del despliegue, la aplicación debería:
1. Cargar sin errores
2. Mostrar logs de configuración en console (solo en desarrollo)
3. Hacer peticiones exitosas a `https://bold-rania-af-93-147cdd98.koyeb.app/api/words/random`
4. Funcionar completamente sin errores de conectividad