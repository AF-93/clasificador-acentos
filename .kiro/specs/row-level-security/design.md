# Documento de Diseño - Row Level Security (RLS)

## Visión General

Este diseño aborda la implementación de Row Level Security (RLS) en la base de datos PostgreSQL para solucionar el problema de seguridad donde la tabla `public.words` está expuesta sin restricciones de acceso.

### Problema Actual

1. La tabla `words` está en el esquema `public` sin RLS habilitado
2. Cualquier conexión a la base de datos puede acceder a todos los datos
3. No hay políticas de seguridad que controlen el acceso
4. Riesgo de exposición de datos y modificaciones no autorizadas

## Arquitectura de Seguridad

### Modelo de Seguridad

```mermaid
graph TD
    A[Cliente API] --> B[Conexión DB con Usuario Limitado]
    B --> C[Tabla words con RLS]
    C --> D[Política de Solo Lectura]
    C --> E[Política de Administrador]
    
    F[Usuario Admin] --> G[Conexión DB con Usuario Admin]
    G --> C
    
    H[PostgREST/Supabase] --> I[Usuario Anónimo]
    I --> C
```

### Estrategia de RLS

1. **Habilitar RLS** en la tabla `words`
2. **Crear políticas específicas** para diferentes tipos de acceso
3. **Configurar usuarios de base de datos** con permisos limitados
4. **Mantener compatibilidad** con la aplicación existente

## Componentes y Interfaces

### 1. Políticas de Seguridad

#### Política de Solo Lectura (Público)
```sql
CREATE POLICY "words_select_policy" ON words
    FOR SELECT
    USING (true);
```

#### Política de Administración (Restringida)
```sql
CREATE POLICY "words_admin_policy" ON words
    FOR ALL
    USING (current_user = 'admin_user');
```

### 2. Usuarios de Base de Datos

#### Usuario de API (Solo Lectura)
```sql
CREATE USER api_user WITH PASSWORD 'secure_password';
GRANT SELECT ON words TO api_user;
```

#### Usuario Administrador (Acceso Completo)
```sql
CREATE USER admin_user WITH PASSWORD 'admin_password';
GRANT ALL ON words TO admin_user;
```

### 3. Configuración de Conexión

#### Para la API
```typescript
// Usar usuario con permisos limitados
DATABASE_URL="postgresql://api_user:password@host:port/database"
```

#### Para Migraciones y Administración
```typescript
// Usar usuario administrador
ADMIN_DATABASE_URL="postgresql://admin_user:password@host:port/database"
```

## Modelos de Datos

### Estructura de Políticas

```typescript
interface RLSPolicy {
  name: string;
  table: string;
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  using?: string;
  withCheck?: string;
  role?: string;
}
```

### Configuración de Usuario

```typescript
interface DatabaseUser {
  username: string;
  permissions: string[];
  tables: string[];
  policies: string[];
}
```

## Implementación de Seguridad

### Fase 1: Preparación
1. **Crear usuarios de base de datos** con permisos específicos
2. **Preparar migraciones** para habilitar RLS
3. **Definir políticas** de acceso

### Fase 2: Implementación
1. **Habilitar RLS** en la tabla `words`
2. **Crear políticas** de seguridad
3. **Asignar permisos** a usuarios

### Fase 3: Configuración
1. **Actualizar conexiones** de la aplicación
2. **Probar acceso** con diferentes usuarios
3. **Verificar políticas** funcionan correctamente

## Políticas de Seguridad Específicas

### 1. Política de Lectura Pública
- **Propósito**: Permitir que la API lea todas las palabras
- **Alcance**: Solo operaciones SELECT
- **Condición**: Siempre verdadero (acceso público a lectura)

### 2. Política de Administración
- **Propósito**: Permitir operaciones completas para administradores
- **Alcance**: Todas las operaciones (SELECT, INSERT, UPDATE, DELETE)
- **Condición**: Solo usuarios administradores

### 3. Política de Inserción Controlada
- **Propósito**: Controlar quién puede agregar nuevas palabras
- **Alcance**: Solo operaciones INSERT
- **Condición**: Usuarios autorizados específicos

## Manejo de Errores

### Errores de Acceso
```typescript
enum RLSErrorCodes {
  ACCESS_DENIED = 'RLS_ACCESS_DENIED',
  POLICY_VIOLATION = 'RLS_POLICY_VIOLATION',
  INSUFFICIENT_PRIVILEGES = 'RLS_INSUFFICIENT_PRIVILEGES'
}
```

### Manejo en la Aplicación
```typescript
try {
  const words = await wordsRepository.findMany();
} catch (error) {
  if (error.code === 'RLS_ACCESS_DENIED') {
    // Manejar error de acceso denegado
    throw new Error('Acceso denegado a los datos');
  }
}
```

## Estrategia de Testing

### Tests de Seguridad
1. **Verificar RLS habilitado** - Confirmar que RLS está activo
2. **Probar políticas** - Verificar que las políticas funcionan
3. **Test de acceso denegado** - Confirmar que se bloquea acceso no autorizado
4. **Test de funcionalidad** - Verificar que la aplicación sigue funcionando

### Tests de Integración
1. **API con usuario limitado** - Verificar que la API funciona
2. **Operaciones CRUD** - Probar diferentes operaciones
3. **Manejo de errores** - Verificar respuestas de error apropiadas

## Consideraciones de Implementación

### Compatibilidad
- Mantener funcionamiento actual de la API
- No romper consultas existentes
- Preservar performance de las consultas

### Seguridad
- Usar contraseñas seguras para usuarios de DB
- Rotar credenciales regularmente
- Auditar acceso a datos

### Mantenimiento
- Documentar todas las políticas
- Crear scripts de migración reversibles
- Monitorear acceso y uso de políticas

### Performance
- Las políticas RLS pueden afectar performance
- Optimizar consultas con índices apropiados
- Monitorear tiempo de respuesta después de implementar