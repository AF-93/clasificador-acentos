import { PrismaClient } from '@prisma/client';

// Configurar variables de entorno directamente
process.env.DATABASE_URL = "postgresql://postgres:clasificadoracentos2025@db.ryyhjjpsstmeeibvlban.supabase.co:5432/postgres";

async function testConnection() {
  console.log('🔄 Probando conexión a Supabase...');
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['error', 'warn'],
  });
  
  try {
    // Intentar conectar
    await prisma.$connect();
    console.log('✅ Conexión exitosa a Supabase');
    
    // Probar una consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta de prueba exitosa:', result);
    
    // Verificar si la tabla words existe
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'words'
      );
    `;
    console.log('✅ Verificación de tabla words:', tableExists);
    
    // Contar palabras si la tabla existe
    try {
      const wordCount = await prisma.word.count();
      console.log(`✅ Total de palabras en la base de datos: ${wordCount}`);
    } catch (error) {
      console.log('⚠️ No se pudo contar palabras (tabla puede no existir)');
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    
    // Información adicional para debug
    console.log('🔧 Información de debug:');
    console.log('- URL de conexión:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    console.log('- Error code:', (error as any)?.errorCode);
    console.log('- Error message:', (error as any)?.message);
    
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar test
testConnection().catch(console.error);