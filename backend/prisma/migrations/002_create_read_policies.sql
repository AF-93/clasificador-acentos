-- Migración: Crear políticas adicionales de seguridad para acceso de solo lectura
-- Propósito: Definir políticas específicas para diferentes tipos de acceso
-- Fecha: $(Get-Date -Format "yyyy-MM-dd")

-- Política específica para la API (acceso anónimo de solo lectura)
CREATE POLICY "words_api_select_policy" ON words
    FOR SELECT
    TO PUBLIC
    USING (true);

-- Política para usuarios autenticados (si se implementa autenticación en el futuro)
CREATE POLICY "words_authenticated_select_policy" ON words
    FOR SELECT
    TO authenticated
    USING (true);

-- Comentarios para documentación
COMMENT ON POLICY "words_api_select_policy" ON words IS 
'Política que permite acceso de solo lectura a la API pública. Permite que cualquier conexión pueda leer palabras.';

COMMENT ON POLICY "words_authenticated_select_policy" ON words IS 
'Política para usuarios autenticados. Preparada para futuras implementaciones de autenticación.';

-- Verificar que las políticas se crearon correctamente
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename = 'words' AND schemaname = 'public';
    
    IF policy_count < 2 THEN
        RAISE EXCEPTION 'No se crearon suficientes políticas para la tabla words';
    END IF;
    
    RAISE NOTICE 'Políticas de seguridad creadas exitosamente. Total: %', policy_count;
END $$;