import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '../types/index.js';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
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
          throw new Error('Error de conexión. Verifica tu conexión a internet.');
        }
        
        // Manejo de errores HTTP
        const status = error.response.status;
        switch (status) {
          case 404:
            throw new Error('Recurso no encontrado');
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