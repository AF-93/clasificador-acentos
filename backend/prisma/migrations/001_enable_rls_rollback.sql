-- Rollback: Deshabilitar Row Level Security en tabla words
-- Propósito: Revertir la migración 001_enable_rls.sql si es necesario
-- ADVERTENCIA: Esto eliminará las políticas de seguridad

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "words_select_policy" ON words;

-- Deshabilitar Row Level Security
ALTER TABLE words DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado
DO $$
BEGIN
    IF (SELECT relrowsecurity FROM pg_class WHERE relname = 'words') THEN
        RAISE EXCEPTION 'Row Level Security no se deshabilitó correctamente en la tabla words';
    END IF;
    
    RAISE NOTICE 'Row Level Security deshabilitado en la tabla words';
END $$;