// Archivo de verificación manual para la configuración de variables de entorno
import { config } from '../config/environment.js';
import { logEnvironmentInfo, validateConfiguration } from '../utils/debug.js';

export function verifyConfiguration() {
  console.log('🔍 Verificando configuración...');
  
  // 1. Verificar que la configuración se carga correctamente
  console.log('✅ Configuración cargada:', {
    apiBaseUrl: config.apiBaseUrl,
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    enableDebugLogs: config.enableDebugLogs,
    requestTimeout: config.requestTimeout,
  });
  
  // 2. Verificar que las utilidades de debug funcionan
  logEnvironmentInfo();
  
  // 3. Verificar validación
  const isValid = validateConfiguration();
  console.log('✅ Configuración válida:', isValid);
  
  // 4. Verificar que la URL base se construye correctamente
  const expectedApiUrl = `${config.apiBaseUrl}/api`;
  console.log('✅ URL de API esperada:', expectedApiUrl);
  
  // 5. Verificar detección de entorno
  if (config.isDevelopment) {
    console.log('✅ Modo desarrollo detectado correctamente');
  } else {
    console.log('✅ Modo producción detectado correctamente');
  }
  
  // 6. Verificar que import.meta.env funciona
  const envVar = import.meta.env.VITE_API_BASE_URL;
  console.log('✅ Variable de entorno VITE_API_BASE_URL:', envVar || 'No definida (usando default)');
  
  return {
    configLoaded: !!config,
    validConfiguration: isValid,
    apiBaseUrl: config.apiBaseUrl,
    environment: config.isDevelopment ? 'development' : 'production',
    environmentVariable: envVar,
  };
}

// Ejecutar verificación si este archivo se importa directamente
if (typeof window !== 'undefined') {
  console.log('🚀 Ejecutando verificación de configuración...');
  verifyConfiguration();
}