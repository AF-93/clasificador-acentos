import { PrismaClient } from '@prisma/client';

// Configuración de conexiones de base de datos
interface DatabaseConfig {
  apiUrl: string;
  adminUrl?: string;
}

function getDatabaseConfig(): DatabaseConfig {
  const apiUrl = process.env.DATABASE_URL;
  const adminUrl = process.env.ADMIN_DATABASE_URL;

  if (!apiUrl) {
    throw new Error('DATABASE_URL no está definida en las variables de entorno');
  }

  return {
    apiUrl,
    adminUrl,
  };
}

// Cliente Prisma para operaciones de API (solo lectura)
export function createApiClient(): PrismaClient {
  const config = getDatabaseConfig();
  
  return new PrismaClient({
    datasources: {
      db: {
        url: config.apiUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
}

// Cliente Prisma para operaciones administrativas (migraciones, seeds)
export function createAdminClient(): PrismaClient {
  const config = getDatabaseConfig();
  
  if (!config.adminUrl) {
    console.warn('ADMIN_DATABASE_URL no está definida, usando DATABASE_URL para operaciones administrativas');
    return createApiClient();
  }
  
  return new PrismaClient({
    datasources: {
      db: {
        url: config.adminUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
}

// Cliente por defecto para la aplicación (API)
export const prisma = createApiClient();

// Función para verificar conexión y permisos
export async function verifyDatabaseConnection(): Promise<void> {
  try {
    // Verificar conexión básica
    await prisma.$connect();
    console.log('✅ Conexión a base de datos establecida');
    
    // Verificar que podemos leer de la tabla words
    const wordCount = await prisma.word.count();
    console.log(`✅ Acceso a tabla words verificado. Total palabras: ${wordCount}`);
    
    // Verificar que RLS está habilitado (solo en PostgreSQL)
    if (process.env.DATABASE_URL?.includes('postgresql')) {
      const rlsStatus = await prisma.$queryRaw`
        SELECT relrowsecurity 
        FROM pg_class 
        WHERE relname = 'words'
      ` as Array<{ relrowsecurity: boolean }>;
      
      if (rlsStatus.length > 0 && rlsStatus[0].relrowsecurity) {
        console.log('✅ Row Level Security está habilitado en la tabla words');
      } else {
        console.warn('⚠️ Row Level Security NO está habilitado en la tabla words');
      }
    }
    
  } catch (error) {
    console.error('❌ Error al verificar conexión de base de datos:', error);
    throw error;
  }
}

// Función para cerrar conexiones
export async function closeDatabaseConnections(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('✅ Conexiones de base de datos cerradas');
  } catch (error) {
    console.error('❌ Error al cerrar conexiones de base de datos:', error);
  }
}