-- Migración: Habilitar Row Level Security en tabla words
-- Propósito: Solucionar problema de seguridad donde la tabla words está expuesta sin restricciones
-- Fecha: $(Get-Date -Format "yyyy-MM-dd")

-- Habilitar Row Level Security en la tabla words
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Crear política de solo lectura para acceso público
-- Esta política permite que cualquier usuario pueda leer todas las palabras
CREATE POLICY "words_select_policy" ON words
    FOR SELECT
    USING (true);

-- Comentarios para documentación
COMMENT ON POLICY "words_select_policy" ON words IS 
'Política que permite acceso de solo lectura a todas las palabras. Necesaria para que la API funcione correctamente.';

-- Verificar que RLS está habilitado
DO $$
BEGIN
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'words') THEN
        RAISE EXCEPTION 'Row Level Security no se habilitó correctamente en la tabla words';
    END IF;
    
    RAISE NOTICE 'Row Level Security habilitado exitosamente en la tabla words';
END $$;