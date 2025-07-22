import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '../types/index.js';
import { config } from '../config/environment.js';

class ApiClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    // Usar la URL completa desde la configuración
    this.baseUrl = `${config.apiBaseUrl}/api`;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.requestTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logConfiguration();
    this.setupInterceptors();
  }

  private logConfiguration() {
    if (config.enableDebugLogs) {
      console.log('🌐 Cliente API inicializado:', {
        baseUrl: this.baseUrl,
        timeout: config.requestTimeout,
        environment: config.isDevelopment ? 'development' : 'production',
      });
    }
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        
        // Si la respuesta indica error en el nivel de aplicación
        if (!response.data.success) {
          throw new Error(response.data.error?.message || 'Error de API');
        }
        
        return response;
      },
      (error) => {
        console.error('❌ Response Error:', error);
        
        // Manejo de errores de red
        if (error.code === 'ECONNABORTED') {
          throw new Error('Tiempo de espera agotado. Verifica tu conexión.');
        }
        
        if (!error.response) {
          const message = 'Error de conexión. Verifica tu conexión a internet.';
          if (config.enableDebugLogs) {
            console.error('🔧 Debug: Verifica que VITE_API_BASE_URL apunte al servidor correcto:', config.apiBaseUrl);
          }
          throw new Error(message);
        }
        
        // Manejo de errores HTTP
        const status = error.response.status;
        switch (status) {
          case 404:
            let notFoundMessage = 'Recurso no encontrado';
            if (config.enableDebugLogs) {
              console.error('🔧 Debug: URL solicitada:', error.config?.url);
              console.error('🔧 Debug: Base URL configurada:', this.baseUrl);
              console.error('🔧 Debug: Verifica que el servidor API esté ejecutándose en:', config.apiBaseUrl);
              
              // Detectar si es un problema de configuración
              const requestedUrl = error.config?.url || '';
              if (requestedUrl.includes('netlify.app/api') && config.apiBaseUrl.includes('koyeb.app')) {
                notFoundMessage = 'Error de configuración: La aplicación está intentando conectar a Netlify en lugar del servidor API. Verifica la configuración de VITE_API_BASE_URL.';
              } else if (!config.apiBaseUrl.includes('koyeb.app') && !config.isDevelopment) {
                notFoundMessage = 'Error de configuración: Verifica que VITE_API_BASE_URL esté configurada correctamente en el entorno de despliegue.';
              }
            }
            throw new Error(notFoundMessage);
          case 500:
            throw new Error('Error interno del servidor');
          default:
            throw new Error(error.response.data?.error?.message || 'Error desconocido');
        }
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data.data!;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data!;
  }
}

export const apiClient = new ApiClient();