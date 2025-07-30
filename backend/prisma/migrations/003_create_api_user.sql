-- Migración: Crear usuario de base de datos para la API
-- Propósito: Crear usuario con permisos limitados de solo lectura para la aplicación
-- Fecha: $(Get-Date -Format "yyyy-MM-dd")

-- Crear usuario para la API con permisos limitados
-- NOTA: En producción, usar una contraseña más segura
DO $$
BEGIN
    -- Verificar si el usuario ya existe
    IF NOT EXISTS (SELECT 1 FROM pg_user WHERE usename = 'clasificador_api_user') THEN
        -- Crear usuario con contraseña segura
        CREATE USER clasificador_api_user WITH 
            PASSWORD 'ClasificadorAPI2024!SecurePass'
            NOSUPERUSER 
            NOCREATEDB 
            NOCREATEROLE 
            NOINHERIT 
            LOGIN;
        
        RAISE NOTICE 'Usuario clasificador_api_user creado exitosamente';
    ELSE
        RAISE NOTICE 'Usuario clasificador_api_user ya existe';
    END IF;
END $$;

-- Otorgar permisos de conexión a la base de datos
GRANT CONNECT ON DATABASE postgres TO clasificador_api_user;

-- Otorgar permisos de uso del esquema public
GRANT USAGE ON SCHEMA public TO clasificador_api_user;

-- Otorgar permisos de SELECT específicamente en la tabla words
GRANT SELECT ON TABLE words TO clasificador_api_user;

-- Otorgar permisos en secuencias si es necesario (para IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO clasificador_api_user;

-- Comentario para documentación
COMMENT ON ROLE clasificador_api_user IS 
'Usuario de base de datos para la API del clasificador de acentos. Solo tiene permisos de lectura en la tabla words.';

-- Verificar permisos otorgados
DO $$
DECLARE
    perm_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO perm_count 
    FROM information_schema.table_privileges 
    WHERE grantee = 'clasificador_api_user' 
    AND table_name = 'words' 
    AND privilege_type = 'SELECT';
    
    IF perm_count = 0 THEN
        RAISE EXCEPTION 'No se otorgaron permisos SELECT al usuario clasificador_api_user';
    END IF;
    
    RAISE NOTICE 'Permisos otorgados exitosamente al usuario clasificador_api_user';
END $$;