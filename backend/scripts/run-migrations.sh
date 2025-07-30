#!/bin/bash

# Script para ejecutar migraciones de Row Level Security
# Propósito: Aplicar todas las migraciones de RLS en orden correcto
# Uso: ./scripts/run-migrations.sh

set -e

echo "🔧 Iniciando migraciones de Row Level Security..."

# Verificar que las variables de entorno estén configuradas
if [ -z "$ADMIN_DATABASE_URL" ]; then
    echo "❌ Error: ADMIN_DATABASE_URL no está configurada"
    echo "💡 Configura la variable con: export ADMIN_DATABASE_URL='postgresql://admin_user:password@host:port/database'"
    exit 1
fi

# Función para ejecutar migración SQL
run_migration() {
    local migration_file=$1
    local migration_name=$(basename "$migration_file" .sql)
    
    echo "📄 Ejecutando migración: $migration_name"
    
    if psql "$ADMIN_DATABASE_URL" -f "$migration_file"; then
        echo "✅ Migración $migration_name completada exitosamente"
    else
        echo "❌ Error ejecutando migración $migration_name"
        exit 1
    fi
}

# Ejecutar migraciones en orden
echo "🚀 Ejecutando migraciones..."

run_migration "backend/prisma/migrations/001_enable_rls.sql"
run_migration "backend/prisma/migrations/002_create_read_policies.sql"
run_migration "backend/prisma/migrations/003_create_api_user.sql"
run_migration "backend/prisma/migrations/004_create_admin_policies.sql"

echo "🎉 Todas las migraciones de RLS completadas exitosamente"
echo "📋 Resumen:"
echo "   ✅ Row Level Security habilitado en tabla words"
echo "   ✅ Políticas de solo lectura creadas"
echo "   ✅ Usuario de API creado con permisos limitados"
echo "   ✅ Usuario administrador creado con permisos completos"
echo "   ✅ Políticas administrativas implementadas"

echo ""
echo "🔍 Para verificar el estado de RLS, ejecuta:"
echo "   psql \$DATABASE_URL -c \"SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'words';\""