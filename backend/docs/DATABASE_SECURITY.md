# Documentación de Seguridad de Base de Datos

## Resumen

Este documento describe la implementación de Row Level Security (RLS) en la base de datos PostgreSQL del proyecto Clasificador de Acentos. RLS se implementó para solucionar problemas de seguridad donde la tabla `words` estaba expuesta sin restricciones de acceso.

## Arquitectura de Seguridad

### Usuarios de Base de Datos

#### 1. Usuario de API (`clasificador_api_user`)
- **Propósito**: Conexiones de la aplicación en producción
- **Permisos**: Solo lectura (SELECT) en tabla `words`
- **Características**:
  - No es superusuario
  - No puede crear bases de datos
  - No puede crear roles
  - No puede bypasear RLS
  - Puede hacer login

#### 2. Usuario Administrador (`clasificador_admin_user`)
- **Propósito**: Migraciones, seeds y operaciones administrativas
- **Permisos**: Acceso completo (SELECT, INSERT, UPDATE, DELETE) en tabla `words`
- **Características**:
  - No es superusuario
  - No puede crear bases de datos
  - No puede crear roles
  - Puede hacer login

## Políticas de Row Level Security

### Políticas de Solo Lectura

#### 1. `words_select_policy`
```sql
CREATE POLICY "words_select_policy" ON words
    FOR SELECT
    USING (true);
```
- **Propósito**: Permite acceso de lectura básico
- **Alcance**: Todas las operaciones SELECT
- **Condición**: Siempre verdadero (acceso público a lectura)

#### 2. `words_api_select_policy`
```sql
CREATE POLICY "words_api_select_policy" ON words
    FOR SELECT
    TO PUBLIC
    USING (true);
```
- **Propósito**: Política específica para acceso público de la API
- **Alcance**: Operaciones SELECT para rol PUBLIC
- **Condición**: Siempre verdadero

#### 3. `words_authenticated_select_policy`
```sql
CREATE POLICY "words_authenticated_select_policy" ON words
    FOR SELECT
    TO authenticated
    USING (true);
```
- **Propósito**: Preparado para futuras implementaciones de autenticación
- **Alcance**: Usuarios autenticados
- **Condición**: Siempre verdadero

### Políticas Administrativas

#### 1. `words_admin_all_policy`
```sql
CREATE POLICY "words_admin_all_policy" ON words
    FOR ALL
    TO clasificador_admin_user
    USING (true)
    WITH CHECK (true);
```
- **Propósito**: Acceso completo para usuario administrador
- **Alcance**: Todas las operaciones
- **Usuario**: Solo `clasificador_admin_user`

#### 2. `words_insert_policy`
```sql
CREATE POLICY "words_insert_policy" ON words
    FOR INSERT
    TO clasificador_admin_user
    WITH CHECK (true);
```
- **Propósito**: Permitir inserción de nuevas palabras
- **Usuario**: Solo `clasificador_admin_user`

#### 3. `words_update_policy`
```sql
CREATE POLICY "words_update_policy" ON words
    FOR UPDATE
    TO clasificador_admin_user
    USING (true)
    WITH CHECK (true);
```
- **Propósito**: Permitir actualización de palabras existentes
- **Usuario**: Solo `clasificador_admin_user`

#### 4. `words_delete_policy`
```sql
CREATE POLICY "words_delete_policy" ON words
    FOR DELETE
    TO clasificador_admin_user
    USING (true);
```
- **Propósito**: Permitir eliminación de palabras
- **Usuario**: Solo `clasificador_admin_user`

## Configuración de Conexiones

### Variables de Entorno

#### Producción
```bash
# Usuario de API (solo lectura)
DATABASE_URL="postgresql://clasificador_api_user:password@host:port/database"

# Usuario administrador (para migraciones)
ADMIN_DATABASE_URL="postgresql://clasificador_admin_user:password@host:port/database"
```

#### Desarrollo Local
```bash
# Puede usar el mismo usuario para ambos en desarrollo
DATABASE_URL="postgresql://postgres:password@localhost:5432/clasificador_dev"
ADMIN_DATABASE_URL="postgresql://postgres:password@localhost:5432/clasificador_dev"
```

### Configuración en Código

```typescript
// Cliente para operaciones de API (solo lectura)
const apiClient = createApiClient();

// Cliente para operaciones administrativas
const adminClient = createAdminClient();
```

## Migraciones

### Orden de Ejecución

1. **001_enable_rls.sql** - Habilita RLS en tabla `words`
2. **002_create_read_policies.sql** - Crea políticas de solo lectura
3. **003_create_api_user.sql** - Crea usuario de API con permisos limitados
4. **004_create_admin_policies.sql** - Crea políticas administrativas y usuario admin

### Comandos de Migración

```bash
# Linux/Mac
npm run db:rls:migrate

# Windows
npm run db:rls:migrate:win

# Verificar estado de RLS
npm run db:rls:verify
```

### Migración Manual

```bash
# Ejecutar todas las migraciones
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/001_enable_rls.sql
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/002_create_read_policies.sql
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/003_create_api_user.sql
psql $ADMIN_DATABASE_URL -f backend/prisma/migrations/004_create_admin_policies.sql
```

## Verificación de Seguridad

### Comandos de Verificación

#### Verificar RLS Habilitado
```sql
SELECT schemaname, tablename, rowsecurity, forcerowsecurity 
FROM pg_tables 
WHERE tablename = 'words';
```

#### Listar Políticas
```sql
SELECT policyname, cmd, permissive, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'words' AND schemaname = 'public'
ORDER BY policyname;
```

#### Verificar Usuarios
```sql
SELECT usename, usecreatedb, usesuper, userepl, usebypassrls
FROM pg_user 
WHERE usename IN ('clasificador_api_user', 'clasificador_admin_user')
ORDER BY usename;
```

#### Verificar Permisos
```sql
SELECT grantee, table_name, privilege_type, is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'words'
AND grantee IN ('clasificador_api_user', 'clasificador_admin_user', 'PUBLIC')
ORDER BY grantee, privilege_type;
```

### Tests Automatizados

```bash
# Ejecutar tests de seguridad
npm test -- --testPathPattern=security

# Tests específicos de RLS
npm test -- src/tests/security/rls.test.ts

# Tests de seguridad de base de datos
npm test -- src/tests/security/database-security.test.ts
```

## Troubleshooting

### Problemas Comunes

#### Error: "permission denied for table words"
- **Causa**: Usuario no tiene permisos en la tabla
- **Solución**: Verificar que el usuario tenga permisos SELECT otorgados
- **Comando**: `GRANT SELECT ON words TO usuario;`

#### Error: "new row violates row-level security policy"
- **Causa**: Intento de insertar/actualizar sin permisos
- **Solución**: Usar usuario administrador para operaciones de escritura
- **Verificar**: Políticas WITH CHECK están configuradas correctamente

#### Error: "row-level security is enabled but no policy exists"
- **Causa**: RLS habilitado pero sin políticas
- **Solución**: Crear políticas apropiadas o deshabilitar RLS temporalmente
- **Comando**: `CREATE POLICY policy_name ON table_name FOR SELECT USING (true);`

#### Conexión falla con usuario de API
- **Causa**: Usuario no existe o contraseña incorrecta
- **Solución**: Verificar que el usuario fue creado correctamente
- **Verificar**: `SELECT * FROM pg_user WHERE usename = 'clasificador_api_user';`

### Comandos de Diagnóstico

```bash
# Verificar estado completo de RLS
psql $DATABASE_URL -c "
SELECT 
  t.schemaname,
  t.tablename,
  t.rowsecurity,
  COUNT(p.policyname) as policy_count
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.tablename = 'words'
GROUP BY t.schemaname, t.tablename, t.rowsecurity;
"

# Verificar permisos de usuario actual
psql $DATABASE_URL -c "
SELECT 
  current_user as current_user,
  session_user as session_user,
  current_database() as current_database;
"
```

## Mantenimiento

### Rotación de Contraseñas

```sql
-- Cambiar contraseña de usuario de API
ALTER USER clasificador_api_user WITH PASSWORD 'nueva_contraseña_segura';

-- Cambiar contraseña de usuario administrador
ALTER USER clasificador_admin_user WITH PASSWORD 'nueva_contraseña_admin';
```

### Auditoría de Acceso

```sql
-- Verificar conexiones activas
SELECT 
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  query
FROM pg_stat_activity 
WHERE usename IN ('clasificador_api_user', 'clasificador_admin_user');
```

### Backup de Políticas

```bash
# Exportar definiciones de políticas
pg_dump $DATABASE_URL --schema-only --table=words > words_policies_backup.sql
```

## Consideraciones de Performance

### Impacto de RLS

- Las políticas RLS pueden afectar el rendimiento de las consultas
- Usar índices apropiados para optimizar las condiciones de las políticas
- Monitorear tiempo de respuesta después de implementar RLS

### Optimizaciones

```sql
-- Crear índices para optimizar consultas con RLS
CREATE INDEX IF NOT EXISTS idx_words_accent_type ON words(accentType);
CREATE INDEX IF NOT EXISTS idx_words_word ON words(word);
```

### Monitoreo

```sql
-- Monitorear consultas lentas
SELECT 
  query,
  mean_time,
  calls,
  total_time
FROM pg_stat_statements 
WHERE query LIKE '%words%'
ORDER BY mean_time DESC;
```