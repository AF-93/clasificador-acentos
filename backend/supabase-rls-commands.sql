-- =====================================================
-- COMANDOS SQL PARA IMPLEMENTAR RLS EN SUPABASE
-- =====================================================
-- Ejecutar estos comandos en el Supabase Dashboard > SQL Editor
-- URL: https://supabase.com/dashboard/project/[tu-proyecto]/sql

-- =====================================================
-- PASO 1: HABILITAR ROW LEVEL SECURITY
-- =====================================================

-- Habilitar RLS en la tabla words
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Verificar que RLS está habilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'words';

-- =====================================================
-- PASO 2: CREAR POLÍTICAS DE SOLO LECTURA
-- =====================================================

-- Política básica de solo lectura (permite SELECT a todos)
CREATE POLICY "words_select_policy" ON words
    FOR SELECT
    USING (true);

-- Política específica para acceso público de la API
CREATE POLICY "words_api_select_policy" ON words
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Política para usuarios autenticados (preparada para futuro)
CREATE POLICY "words_authenticated_select_policy" ON words
    FOR SELECT
    TO authenticated
    USING (true);

-- =====================================================
-- PASO 3: CREAR USUARIO DE API (SOLO LECTURA)
-- =====================================================

-- Crear usuario de API con permisos limitados
CREATE USER clasificador_api_user WITH 
    PASSWORD 'ClasificadorAPI2024!SecurePass'
    NOSUPERUSER 
    NOCREATEDB 
    NOCREATEROLE 
    NOINHERIT 
    LOGIN;

-- Otorgar permisos básicos al usuario de API
GRANT CONNECT ON DATABASE postgres TO clasificador_api_user;
GRANT USAGE ON SCHEMA public TO clasificador_api_user;
GRANT SELECT ON TABLE words TO clasificador_api_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO clasificador_api_user;

-- =====================================================
-- PASO 4: CREAR USUARIO ADMINISTRADOR
-- =====================================================

-- Crear usuario administrador para operaciones de escritura
CREATE USER clasificador_admin_user WITH 
    PASSWORD 'ClasificadorAdmin2024!SuperSecure'
    NOSUPERUSER 
    NOCREATEDB 
    NOCREATEROLE 
    NOINHERIT 
    LOGIN;

-- Otorgar permisos completos al usuario administrador
GRANT CONNECT ON DATABASE postgres TO clasificador_admin_user;
GRANT USAGE ON SCHEMA public TO clasificador_admin_user;
GRANT ALL PRIVILEGES ON TABLE words TO clasificador_admin_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO clasificador_admin_user;

-- =====================================================
-- PASO 5: CREAR POLÍTICAS ADMINISTRATIVAS
-- =====================================================

-- Política administrativa completa (todas las operaciones)
CREATE POLICY "words_admin_all_policy" ON words
    FOR ALL
    TO clasificador_admin_user
    USING (true)
    WITH CHECK (true);

-- Política específica para inserción
CREATE POLICY "words_insert_policy" ON words
    FOR INSERT
    TO clasificador_admin_user
    WITH CHECK (true);

-- Política específica para actualización
CREATE POLICY "words_update_policy" ON words
    FOR UPDATE
    TO clasificador_admin_user
    USING (true)
    WITH CHECK (true);

-- Política específica para eliminación
CREATE POLICY "words_delete_policy" ON words
    FOR DELETE
    TO clasificador_admin_user
    USING (true);

-- =====================================================
-- PASO 6: VERIFICACIÓN DE LA IMPLEMENTACIÓN
-- =====================================================

-- Verificar que RLS está habilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  forcerowsecurity
FROM pg_tables 
WHERE tablename = 'words';

-- Listar todas las políticas creadas
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'words' AND schemaname = 'public'
ORDER BY policyname;

-- Verificar usuarios creados
SELECT 
  usename,
  usecreatedb,
  usesuper,
  userepl,
  usebypassrls
FROM pg_user 
WHERE usename IN ('clasificador_api_user', 'clasificador_admin_user')
ORDER BY usename;

-- Verificar permisos otorgados
SELECT 
  grantee,
  table_schema,
  table_name,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'words'
AND grantee IN ('clasificador_api_user', 'clasificador_admin_user', 'PUBLIC')
ORDER BY grantee, privilege_type;

-- =====================================================
-- PASO 7: PRUEBA DE FUNCIONAMIENTO
-- =====================================================

-- Probar que se pueden leer palabras (debería funcionar)
SELECT COUNT(*) as total_words FROM words;

-- Probar una consulta específica
SELECT word, accentType FROM words LIMIT 5;

-- =====================================================
-- RESULTADO ESPERADO
-- =====================================================
-- Después de ejecutar todos estos comandos, deberías ver:
-- 
-- 1. RLS habilitado: rowsecurity = true
-- 2. 7 políticas de seguridad creadas
-- 3. 2 usuarios de base de datos creados
-- 4. Permisos apropiados otorgados
-- 5. Consultas funcionando correctamente
-- 
-- =====================================================

-- COMENTARIOS PARA DOCUMENTACIÓN
COMMENT ON POLICY "words_select_policy" ON words IS 
'Política básica que permite acceso de solo lectura a todas las palabras';

COMMENT ON POLICY "words_api_select_policy" ON words IS 
'Política específica para acceso público de la API';

COMMENT ON POLICY "words_admin_all_policy" ON words IS 
'Política que permite todas las operaciones al usuario administrador';

COMMENT ON ROLE clasificador_api_user IS 
'Usuario de base de datos para la API del clasificador de acentos. Solo tiene permisos de lectura.';

COMMENT ON ROLE clasificador_admin_user IS 
'Usuario administrador para el clasificador de acentos. Tiene permisos completos para operaciones de mantenimiento.';

-- =====================================================
-- FIN DE COMANDOS SQL
-- =====================================================