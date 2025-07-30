import { PrismaClient } from '@prisma/client';
import { prisma as apiClient, verifyDatabaseConnection, closeDatabaseConnections } from '../config/database.js';

// Exportar el cliente de API como cliente principal
export const prisma = apiClient;

// Función para conectar a la base de datos con verificación de RLS
export const connectDatabase = async () => {
  try {
    await verifyDatabaseConnection();
    console.log('✅ Base de datos conectada correctamente con RLS verificado');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
};

// Función para desconectar de la base de datos
export const disconnectDatabase = async () => {
  await closeDatabaseConnections();
};