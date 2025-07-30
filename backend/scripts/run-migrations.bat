@echo off
REM Script para ejecutar migraciones de Row Level Security en Windows
REM Propósito: Aplicar todas las migraciones de RLS en orden correcto
REM Uso: scripts\run-migrations.bat

echo 🔧 Iniciando migraciones de Row Level Security...

REM Verificar que las variables de entorno estén configuradas
if "%ADMIN_DATABASE_URL%"=="" (
    echo ❌ Error: ADMIN_DATABASE_URL no está configurada
    echo 💡 Configura la variable con: set ADMIN_DATABASE_URL=postgresql://admin_user:password@host:port/database
    exit /b 1
)

echo 🚀 Ejecutando migraciones...

echo 📄 Ejecutando migración: 001_enable_rls
psql "%ADMIN_DATABASE_URL%" -f "backend/prisma/migrations/001_enable_rls.sql"
if errorlevel 1 (
    echo ❌ Error ejecutando migración 001_enable_rls
    exit /b 1
)
echo ✅ Migración 001_enable_rls completada exitosamente

echo 📄 Ejecutando migración: 002_create_read_policies
psql "%ADMIN_DATABASE_URL%" -f "backend/prisma/migrations/002_create_read_policies.sql"
if errorlevel 1 (
    echo ❌ Error ejecutando migración 002_create_read_policies
    exit /b 1
)
echo ✅ Migración 002_create_read_policies completada exitosamente

echo 📄 Ejecutando migración: 003_create_api_user
psql "%ADMIN_DATABASE_URL%" -f "backend/prisma/migrations/003_create_api_user.sql"
if errorlevel 1 (
    echo ❌ Error ejecutando migración 003_create_api_user
    exit /b 1
)
echo ✅ Migración 003_create_api_user completada exitosamente

echo 📄 Ejecutando migración: 004_create_admin_policies
psql "%ADMIN_DATABASE_URL%" -f "backend/prisma/migrations/004_create_admin_policies.sql"
if errorlevel 1 (
    echo ❌ Error ejecutando migración 004_create_admin_policies
    exit /b 1
)
echo ✅ Migración 004_create_admin_policies completada exitosamente

echo 🎉 Todas las migraciones de RLS completadas exitosamente
echo 📋 Resumen:
echo    ✅ Row Level Security habilitado en tabla words
echo    ✅ Políticas de solo lectura creadas
echo    ✅ Usuario de API creado con permisos limitados
echo    ✅ Usuario administrador creado con permisos completos
echo    ✅ Políticas administrativas implementadas

echo.
echo 🔍 Para verificar el estado de RLS, ejecuta:
echo    psql "%DATABASE_URL%" -c "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'words';"

pause