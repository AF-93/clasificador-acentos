import { PrismaClient } from '@prisma/client';

// Configurar variables de entorno directamente
process.env.ADMIN_DATABASE_URL = "postgresql://postgres:clasificadoracentos2025@db.ryyhjjpsstmeeibvlban.supabase.co:5432/postgres";
process.env.DATABASE_URL = "postgresql://postgres:clasificadoracentos2025@db.ryyhjjpsstmeeibvlban.supabase.co:5432/postgres";

// Crear cliente administrador directamente
function createAdminClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.ADMIN_DATABASE_URL,
      },
    },
    log: ['error'],
  });
}

async function deployRLS() {
  console.log('🚀 Iniciando despliegue de Row Level Security en producción...');
  console.log('🔗 URL de conexión:', process.env.ADMIN_DATABASE_URL?.substring(0, 50) + '...');
  
  const prisma = createAdminClient();
  
  try {
    // Verificar conexión
    console.log('🔄 Intentando conectar a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');
    
    // Paso 1: Habilitar RLS en tabla words
    console.log('📄 Paso 1: Habilitando Row Level Security...');
    await prisma.$executeRaw`ALTER TABLE words ENABLE ROW LEVEL SECURITY;`;
    console.log('✅ RLS habilitado en tabla words');
    
    // Paso 2: Crear política de solo lectura básica
    console.log('📄 Paso 2: Creando política de solo lectura...');
    await prisma.$executeRaw`
      CREATE POLICY "words_select_policy" ON words
        FOR SELECT
        USING (true);
    `;
    console.log('✅ Política de solo lectura creada');
    
    // Paso 3: Crear políticas adicionales de lectura
    console.log('📄 Paso 3: Creando políticas adicionales...');
    
    try {
      await prisma.$executeRaw`
        CREATE POLICY "words_api_select_policy" ON words
          FOR SELECT
          TO PUBLIC
          USING (true);
      `;
      console.log('✅ Política de API creada');
    } catch (error) {
      console.log('⚠️ Política de API ya existe o no se pudo crear');
    }
    
    try {
      await prisma.$executeRaw`
        CREATE POLICY "words_authenticated_select_policy" ON words
          FOR SELECT
          TO authenticated
          USING (true);
      `;
      console.log('✅ Política de usuarios autenticados creada');
    } catch (error) {
      console.log('⚠️ Política de usuarios autenticados ya existe o no se pudo crear');
    }
    
    // Paso 4: Crear usuario de API
    console.log('📄 Paso 4: Creando usuario de API...');
    try {
      await prisma.$executeRaw`
        CREATE USER clasificador_api_user WITH 
          PASSWORD 'ClasificadorAPI2024!SecurePass'
          NOSUPERUSER 
          NOCREATEDB 
          NOCREATEROLE 
          NOINHERIT 
          LOGIN;
      `;
      console.log('✅ Usuario clasificador_api_user creado');
    } catch (error) {
      console.log('⚠️ Usuario clasificador_api_user ya existe');
    }
    
    // Otorgar permisos al usuario de API
    await prisma.$executeRaw`GRANT CONNECT ON DATABASE postgres TO clasificador_api_user;`;
    await prisma.$executeRaw`GRANT USAGE ON SCHEMA public TO clasificador_api_user;`;
    await prisma.$executeRaw`GRANT SELECT ON TABLE words TO clasificador_api_user;`;
    await prisma.$executeRaw`GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO clasificador_api_user;`;
    console.log('✅ Permisos otorgados al usuario de API');
    
    // Paso 5: Crear usuario administrador
    console.log('📄 Paso 5: Creando usuario administrador...');
    try {
      await prisma.$executeRaw`
        CREATE USER clasificador_admin_user WITH 
          PASSWORD 'ClasificadorAdmin2024!SuperSecure'
          NOSUPERUSER 
          NOCREATEDB 
          NOCREATEROLE 
          NOINHERIT 
          LOGIN;
      `;
      console.log('✅ Usuario clasificador_admin_user creado');
    } catch (error) {
      console.log('⚠️ Usuario clasificador_admin_user ya existe');
    }
    
    // Otorgar permisos al usuario administrador
    await prisma.$executeRaw`GRANT CONNECT ON DATABASE postgres TO clasificador_admin_user;`;
    await prisma.$executeRaw`GRANT USAGE ON SCHEMA public TO clasificador_admin_user;`;
    await prisma.$executeRaw`GRANT ALL PRIVILEGES ON TABLE words TO clasificador_admin_user;`;
    await prisma.$executeRaw`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO clasificador_admin_user;`;
    console.log('✅ Permisos otorgados al usuario administrador');
    
    // Paso 6: Crear políticas administrativas
    console.log('📄 Paso 6: Creando políticas administrativas...');
    
    try {
      await prisma.$executeRaw`
        CREATE POLICY "words_admin_all_policy" ON words
          FOR ALL
          TO clasificador_admin_user
          USING (true)
          WITH CHECK (true);
      `;
      console.log('✅ Política administrativa completa creada');
    } catch (error) {
      console.log('⚠️ Política administrativa ya existe');
    }
    
    // Verificar que RLS está habilitado
    console.log('📄 Verificando implementación...');
    const rlsStatus = await prisma.$queryRaw`
      SELECT relrowsecurity 
      FROM pg_class 
      WHERE relname = 'words'
    ` as Array<{ relrowsecurity: boolean }>;
    
    if (rlsStatus.length > 0 && rlsStatus[0].relrowsecurity) {
      console.log('✅ Row Level Security está habilitado correctamente');
    } else {
      throw new Error('❌ RLS no está habilitado');
    }
    
    // Verificar políticas
    const policies = await prisma.$queryRaw`
      SELECT policyname, cmd 
      FROM pg_policies 
      WHERE tablename = 'words'
    ` as Array<{ policyname: string; cmd: string }>;
    
    console.log(`✅ ${policies.length} políticas de seguridad creadas:`);
    policies.forEach(policy => {
      console.log(`   - ${policy.policyname}: ${policy.cmd}`);
    });
    
    // Verificar usuarios
    const users = await prisma.$queryRaw`
      SELECT usename 
      FROM pg_user 
      WHERE usename LIKE 'clasificador_%'
    ` as Array<{ usename: string }>;
    
    console.log(`✅ ${users.length} usuarios de base de datos creados:`);
    users.forEach(user => {
      console.log(`   - ${user.usename}`);
    });
    
    console.log('🎉 Row Level Security implementado exitosamente en producción!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Actualizar DATABASE_URL para usar clasificador_api_user');
    console.log('2. Actualizar variables de entorno en Koyeb');
    console.log('3. Redesplegar la aplicación');
    
  } catch (error) {
    console.error('❌ Error durante el despliegue de RLS:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar directamente
deployRLS().catch((error) => {
  console.error(error);
  process.exit(1);
});

export { deployRLS };