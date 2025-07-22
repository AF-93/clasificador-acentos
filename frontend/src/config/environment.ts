interface EnvironmentConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  enableDebugLogs: boolean;
  requestTimeout: number;
}

function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function createConfig(): EnvironmentConfig {
  // Leer la variable de entorno de Vite correctamente
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;
  
  // URL por defecto para desarrollo local
  const defaultApiUrl = 'http://localhost:3001';
  
  // Determinar la URL base de la API
  let apiBaseUrl: string;
  
  if (envApiUrl && validateUrl(envApiUrl)) {
    apiBaseUrl = envApiUrl;
  } else {
    apiBaseUrl = defaultApiUrl;
    
    // Mostrar warning en desarrollo si no hay variable de entorno
    if (isDev && !envApiUrl) {
      console.warn('⚠️ VITE_API_BASE_URL no está definida, usando URL por defecto:', defaultApiUrl);
    }
  }
  
  return {
    apiBaseUrl,
    isDevelopment: isDev,
    isProduction: isProd,
    enableDebugLogs: isDev,
    requestTimeout: 10000,
  };
}

export const config = createConfig();

// Logging de configuración en desarrollo
if (config.enableDebugLogs) {
  console.log('🔧 Configuración de entorno:', {
    apiBaseUrl: config.apiBaseUrl,
    environment: config.isDevelopment ? 'development' : 'production',
    debugEnabled: config.enableDebugLogs,
  });
}