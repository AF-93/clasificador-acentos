import { config } from '../config/environment.js';

interface DebugInfo {
  apiBaseUrl: string;
  environment: string;
  timestamp: string;
  configSource: 'env' | 'default';
}

export function logEnvironmentInfo(): void {
  if (!config.enableDebugLogs) return;

  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  const configSource: 'env' | 'default' = envApiUrl ? 'env' : 'default';

  const debugInfo: DebugInfo = {
    apiBaseUrl: config.apiBaseUrl,
    environment: config.isDevelopment ? 'development' : 'production',
    timestamp: new Date().toISOString(),
    configSource,
  };

  console.group('🔧 Información de Configuración');
  console.log('API Base URL:', debugInfo.apiBaseUrl);
  console.log('Entorno:', debugInfo.environment);
  console.log('Fuente de configuración:', configSource === 'env' ? 'Variable de entorno' : 'Valor por defecto');
  console.log('Timestamp:', debugInfo.timestamp);
  
  if (configSource === 'default') {
    console.warn('⚠️ Usando URL por defecto. Para producción, configura VITE_API_BASE_URL');
  }
  
  console.groupEnd();
}

export function validateConfiguration(): boolean {
  const isValid = config.apiBaseUrl && config.apiBaseUrl.length > 0;
  
  if (!isValid && config.enableDebugLogs) {
    console.error('❌ Configuración inválida: API Base URL no está definida');
  }
  
  return isValid;
}

export function logApiRequest(method: string, url: string): void {
  if (config.enableDebugLogs) {
    console.log(`🚀 ${method.toUpperCase()} ${url}`);
  }
}

export function logApiResponse(status: number, url: string): void {
  if (config.enableDebugLogs) {
    const emoji = status >= 200 && status < 300 ? '✅' : '❌';
    console.log(`${emoji} ${status} ${url}`);
  }
}

export function logApiError(error: any, context?: string): void {
  if (config.enableDebugLogs) {
    console.group('❌ Error de API' + (context ? ` - ${context}` : ''));
    console.error('Error:', error);
    console.log('API Base URL configurada:', config.apiBaseUrl);
    console.log('Entorno:', config.isDevelopment ? 'development' : 'production');
    
    if (error?.response?.status === 404) {
      console.warn('💡 Sugerencia: Verifica que VITE_API_BASE_URL apunte al servidor correcto');
    }
    
    console.groupEnd();
  }
}