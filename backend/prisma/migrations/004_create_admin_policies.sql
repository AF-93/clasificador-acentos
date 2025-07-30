-- Migración: Crear políticas de administración y usuario administrador
-- Propósito: Crear políticas para operaciones de escritura y usuario administrador
-- Fecha: $(Get-Date -Format "yyyy-MM-dd")

-- Crear usuario administrador para operaciones de escritura
DO $$
BEGIN
    -- Verificar si el usuario administrador ya existe
    IF NOT EXISTS (SELECT 1 FROM pg_user WHERE usename = 'clasificador_admin_user') THEN
        -- Crear usuario administrador con contraseña segura
        CREATE USER clasificador_admin_user WITH 
            PASSWORD 'ClasificadorAdmin2024!SuperSecure'
            NOSUPERUSER 
            NOCREATEDB 
            NOCREATEROLE 
            NOINHERIT 
            LOGIN;
        
        RAISE NOTICE 'Usuario clasificador_admin_user creado exitosamente';
    ELSE
        RAISE NOTICE 'Usuario clasificador_admin_user ya existe';
    END IF;
END $$;

-- Otorgar permisos completos al usuario administrador
GRANT CONNECT ON DATABASE postgres TO clasificador_admin_user;
GRANT USAGE ON SCHEMA public TO clasificador_admin_user;
GRANT ALL PRIVILEGES ON TABLE words TO clasificador_admin_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO clasificador_admin_user;

-- Crear política de administración para operaciones completas
CREATE POLICY "words_admin_all_policy" ON words
    FOR ALL
    TO clasificador_admin_user
    USING (true)
    WITH CHECK (true);

-- Crear política para inserción de nuevas palabras (solo admin)
CREATE POLICY "words_insert_policy" ON words
    FOR INSERT
    TO clasificador_admin_user
    WITH CHECK (true);

-- Crear política para actualización de palabras (solo admin)
CREATE POLICY "words_update_policy" ON words
    FOR UPDATE
    TO clasificador_admin_user
    USING (true)
    WITH CHECK (true);

-- Crear política para eliminación de palabras (solo admin)
CREATE POLICY "words_delete_policy" ON words
    FOR DELETE
    TO clasificador_admin_user
    USING (true);

-- Comentarios para documentación
COMMENT ON ROLE clasificador_admin_user IS 
'Usuario administrador para el clasificador de acentos. Tiene permisos completos en la tabla words para operaciones de mantenimiento.';

COMMENT ON POLICY "words_admin_all_policy" ON words IS 
'Política que permite todas las operaciones al usuario administrador.';

COMMENT ON POLICY "words_insert_policy" ON words IS 
'Política que permite insertar nuevas palabras solo al usuario administrador.';

COMMENT ON POLICY "words_update_policy" ON words IS 
'Política que permite actualizar palabras existentes solo al usuario administrador.';

COMMENT ON POLICY "words_delete_policy" ON words IS 
'Política que permite eliminar palabras solo al usuario administrador.';

-- Verificar que las políticas administrativas se crearon correctamente
DO $$
DECLARE
    admin_policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_policy_count 
    FROM pg_policies 
    WHERE tablename = 'words' 
    AND schemaname = 'public'
    AND (policyname LIKE '%admin%' OR policyname LIKE '%insert%' OR policyname LIKE '%update%' OR policyname LIKE '%delete%');
    
    IF admin_policy_count < 4 THEN
        RAISE EXCEPTION 'No se crearon suficientes políticas administrativas para la tabla words';
    END IF;
    
    RAISE NOTICE 'Políticas administrativas creadas exitosamente. Total: %', admin_policy_count;
END $$;