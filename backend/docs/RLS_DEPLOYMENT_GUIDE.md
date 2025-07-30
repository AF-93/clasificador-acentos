# Guía de Despliegue - Row Level Security (RLS)

## Resumen

Esta guía proporciona instrucciones paso a paso para desplegar Row Level Security en el proyecto Clasificador de Acentos, tanto en entornos de desarrollo como de producción.

## Pre-requisitos

### Software Requerido
- PostgreSQL 12+ (RLS requiere PostgreSQL)
- Node.js 18+
- npm o yarn
- Acceso de administrador a la base de datos

### Acceso Requerido
- Conexión a la base de datos con permisos de superusuario (para crear usuarios y políticas)
- Variables de entorno configuradas
- Backup de la base de datos (recomendado)

## Proceso de Despliegue

### Fase 1: Preparación

#### 1.1 Backup de Base de Datos
```bash
# Crear backup completo antes de aplicar RLS
pg_dump $DATABASE_URL > backup_before_rls_$(date +%Y%m%d_%H%M%S).sql

# Verificar que el backup se creó correctamente
ls -la backup_before_rls_*.sql
```

#### 1.2 Verificar Estado Actual
```bash
# Verificar que la tabla words existe
psql $DATABASE_URL -c "SELECT COUNT(*) FROM words;"

# Verificar que RLS no está habilitado aún
psql $DATABASE_URL -c "SELECT relrowsecurity FROM pg_class WHERE relname = 'words';"
```

#### 1.3 Configurar Variables de Entorno

**Para Desarrollo:**
```bash
export DATABASE_URL="postgresql://postgres:password@localhost:5432/clasificador_dev"
export ADMIN_DATABASE_URL="postgresql://postgres:password@localhost:5432/clasificador_dev"
```

**Para Producción (ejemplo con Supabase):**
```bash
export DATABASE_URL="postgresql://clasificador_api_user:secure_password@db.xxx.supabase.co:5432/postgres"
export ADMIN_DATABASE_URL="postgresql://postgres:admin_password@db.xxx.supabase.co:5432/postgres"
```

### Fase 2: Ejecución de Migraciones

#### 2.1 Método Automático (Recomendado)

**Linux/Mac:**
```bash
cd backend
npm run db:rls:migrate
```

**Windows:**
```bash
cd backend
npm run db:rls:migrate:win
```

#### 2.2 Método Manual

```bash
# Ejecutar migraciones una por una
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/001_enable_rls.sql
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/002_create_read_policies.sql
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/003_create_api_user.sql
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/004_create_admin_policies.sql
```

#### 2.3 Verificar Migraciones
```bash
# Verificar que RLS está habilitado
npm run db:rls:verify

# O manualmente:
psql $DATABASE_URL -c "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'words';"
```

### Fase 3: Configuración de Aplicación

#### 3.1 Actualizar Variables de Entorno de Producción

**Netlify (Frontend):**
- No requiere cambios, ya está configurado

**Koyeb/Railway/Heroku (Backend):**
```bash
# Configurar variable de entorno para usuario de API
DATABASE_URL=postgresql://clasificador_api_user:ClasificadorAPI2024!SecurePass@host:port/database

# Configurar variable de entorno para operaciones administrativas
ADMIN_DATABASE_URL=postgresql://clasificador_admin_user:ClasificadorAdmin2024!SuperSecure@host:port/database
```

#### 3.2 Actualizar Código de Aplicación

El código ya está actualizado para usar la nueva configuración. Verificar que los archivos siguientes estén actualizados:

- `backend/src/config/database.ts` ✅
- `backend/src/database/client.ts` ✅
- `backend/src/database/seed.ts` ✅

### Fase 4: Testing y Verificación

#### 4.1 Tests Automatizados
```bash
# Ejecutar tests de seguridad
cd backend
npm test -- --testPathPattern=security

# Verificar que todos los tests pasan
npm test
```

#### 4.2 Verificación Manual

**Verificar Conexión de API:**
```bash
# Probar conexión con usuario de API
psql $DATABASE_URL -c "SELECT COUNT(*) FROM words;"
```

**Verificar Políticas:**
```bash
# Listar todas las políticas
psql $DATABASE_URL -c "SELECT policyname, cmd FROM pg_policies WHERE tablename = 'words';"
```

**Verificar Usuarios:**
```bash
# Verificar que los usuarios existen
psql $ADMIN_DATABASE_URL -c "SELECT usename, usesuper FROM pg_user WHERE usename LIKE 'clasificador_%';"
```

#### 4.3 Test de Funcionalidad de API

```bash
# Probar endpoint de palabra aleatoria
curl https://bold-rania-af-93-147cdd98.koyeb.app/api/words/random

# Probar endpoint de estadísticas
curl https://bold-rania-af-93-147cdd98.koyeb.app/api/words/stats
```

### Fase 5: Despliegue a Producción

#### 5.1 Actualizar Código en Repositorio
```bash
# Hacer commit de todos los cambios
git add .
git commit -m "feat: Implementar Row Level Security (RLS) en base de datos

- Habilitar RLS en tabla words
- Crear usuarios de base de datos con permisos limitados
- Implementar políticas de seguridad
- Agregar tests de seguridad
- Actualizar documentación"

# Push al repositorio
git push origin main
```

#### 5.2 Configurar Variables en Plataforma de Hosting

**Para Koyeb:**
1. Ir a Settings > Environment Variables
2. Actualizar `DATABASE_URL` con usuario de API
3. Agregar `ADMIN_DATABASE_URL` con usuario administrador

**Para Railway:**
1. Ir a Variables tab
2. Actualizar variables de entorno

**Para Heroku:**
```bash
heroku config:set DATABASE_URL="postgresql://clasificador_api_user:password@host:port/database"
heroku config:set ADMIN_DATABASE_URL="postgresql://clasificador_admin_user:password@host:port/database"
```

#### 5.3 Ejecutar Migraciones en Producción

**Opción 1: Desde local (recomendado para primera vez)**
```bash
# Configurar variables para producción
export ADMIN_DATABASE_URL="postgresql://postgres:admin_password@production_host:5432/database"

# Ejecutar migraciones
npm run db:rls:migrate
```

**Opción 2: Desde plataforma de hosting**
```bash
# Conectar a la plataforma y ejecutar
heroku run npm run db:rls:migrate
# o
railway run npm run db:rls:migrate
```

## Verificación Post-Despliegue

### Checklist de Verificación

- [ ] RLS está habilitado en tabla `words`
- [ ] Usuarios `clasificador_api_user` y `clasificador_admin_user` existen
- [ ] Políticas de seguridad están creadas
- [ ] API responde correctamente a peticiones
- [ ] Tests de seguridad pasan
- [ ] No hay errores en logs de aplicación
- [ ] Frontend funciona sin errores

### Comandos de Verificación

```bash
# Verificar estado completo
psql $DATABASE_URL -c "
SELECT 
  'RLS Status' as check_type,
  CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_class WHERE relname = 'words'
UNION ALL
SELECT 
  'Policy Count' as check_type,
  COUNT(*)::text as status
FROM pg_policies WHERE tablename = 'words'
UNION ALL
SELECT 
  'User Count' as check_type,
  COUNT(*)::text as status
FROM pg_user WHERE usename LIKE 'clasificador_%';
"
```

### Monitoreo

```bash
# Verificar logs de aplicación
tail -f /var/log/app.log

# Monitorear conexiones de base de datos
psql $ADMIN_DATABASE_URL -c "
SELECT 
  usename,
  count(*) as connections,
  state
FROM pg_stat_activity 
WHERE usename LIKE 'clasificador_%'
GROUP BY usename, state;
"
```

## Rollback (Si es necesario)

### Rollback Completo

```bash
# 1. Restaurar desde backup
psql $DATABASE_URL < backup_before_rls_YYYYMMDD_HHMMSS.sql

# 2. O ejecutar rollback manual
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/001_enable_rls_rollback.sql

# 3. Revertir variables de entorno
export DATABASE_URL="postgresql://original_user:password@host:port/database"
```

### Rollback Parcial (Solo deshabilitar RLS)

```bash
# Deshabilitar RLS manteniendo usuarios y políticas
psql $ADMIN_DATABASE_URL -c "ALTER TABLE words DISABLE ROW LEVEL SECURITY;"
```

## Troubleshooting

### Problemas Comunes

#### Error: "role does not exist"
```bash
# Verificar que los usuarios se crearon
psql $ADMIN_DATABASE_URL -c "SELECT usename FROM pg_user WHERE usename LIKE 'clasificador_%';"

# Recrear usuario si es necesario
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/003_create_api_user.sql
```

#### Error: "permission denied"
```bash
# Verificar permisos
psql $ADMIN_DATABASE_URL -c "
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'words' AND grantee = 'clasificador_api_user';
"

# Otorgar permisos si es necesario
psql $ADMIN_DATABASE_URL -c "GRANT SELECT ON words TO clasificador_api_user;"
```

#### Error: "no policy exists"
```bash
# Verificar políticas
psql $DATABASE_URL -c "SELECT policyname FROM pg_policies WHERE tablename = 'words';"

# Recrear políticas si es necesario
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/002_create_read_policies.sql
```

### Contacto de Soporte

Si encuentras problemas durante el despliegue:

1. Verificar logs de aplicación
2. Ejecutar comandos de diagnóstico
3. Consultar documentación en `backend/docs/DATABASE_SECURITY.md`
4. Crear issue en el repositorio con detalles del error

## Consideraciones de Seguridad

### Contraseñas

- Cambiar contraseñas por defecto en producción
- Usar contraseñas seguras (mínimo 16 caracteres)
- Rotar contraseñas regularmente

### Acceso

- Limitar acceso a variables de entorno de producción
- Usar conexiones SSL/TLS para base de datos
- Monitorear acceso y conexiones

### Auditoría

- Revisar políticas de seguridad regularmente
- Monitorear logs de acceso a base de datos
- Ejecutar tests de seguridad periódicamente