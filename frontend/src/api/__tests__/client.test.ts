/**
 * @jest-environment jsdom
 */

import axios from 'axios';
import { apiClient } from '../client.js';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock config
jest.mock('../config/environment.js', () => ({
  config: {
    apiBaseUrl: 'https://api.example.com',
    isDevelopment: false,
    isProduction: true,
    enableDebugLogs: false,
    requestTimeout: 10000,
  },
}));

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should create axios instance with correct base URL', () => {
      // Assert
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: { word: 'test', accentType: 'aguda' },
        },
      };

      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue(mockResponse),
        post: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      // Re-import to get fresh instance
      jest.resetModules();
      const { apiClient: freshClient } = await import('../client.js');

      // Act
      const result = await freshClient.get('/words/random');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/words/random', { params: undefined });
      expect(result).toEqual({ word: 'test', accentType: 'aguda' });
    });

    it('should handle API error response', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: false,
          error: { message: 'API Error' },
        },
      };

      const mockAxiosInstance = {
        get: jest.fn().mockResolvedValue(mockResponse),
        post: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      // Re-import to get fresh instance
      jest.resetModules();
      const { apiClient: freshClient } = await import('../client.js');

      // Act & Assert
      await expect(freshClient.get('/words/random')).rejects.toThrow('API Error');
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      // Arrange
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, created: true },
        },
      };

      const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      // Re-import to get fresh instance
      jest.resetModules();
      const { apiClient: freshClient } = await import('../client.js');

      // Act
      const result = await freshClient.post('/words', { word: 'test' });

      // Assert
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/words', { word: 'test' });
      expect(result).toEqual({ id: 1, created: true });
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      // Arrange
      const networkError = {
        code: 'ECONNABORTED',
        message: 'timeout',
      };

      const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { 
            use: jest.fn((successHandler, errorHandler) => {
              // Simulate calling the error handler
              errorHandler(networkError);
            })
          },
        },
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      // Re-import to get fresh instance
      jest.resetModules();
      
      // Act & Assert
      expect(() => import('../client.js')).toThrow('Tiempo de espera agotado. Verifica tu conexión.');
    });

    it('should handle 404 errors with configuration hints', async () => {
      // Arrange
      const notFoundError = {
        response: {
          status: 404,
          data: {},
        },
        config: {
          url: '/words/random',
        },
      };

      const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { 
            use: jest.fn((successHandler, errorHandler) => {
              // Simulate calling the error handler
              errorHandler(notFoundError);
            })
          },
        },
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      // Re-import to get fresh instance
      jest.resetModules();
      
      // Act & Assert
      expect(() => import('../client.js')).toThrow('Recurso no encontrado');
    });

    it('should handle 500 errors', async () => {
      // Arrange
      const serverError = {
        response: {
          status: 500,
          data: {},
        },
      };

      const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { 
            use: jest.fn((successHandler, errorHandler) => {
              // Simulate calling the error handler
              errorHandler(serverError);
            })
          },
        },
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      // Re-import to get fresh instance
      jest.resetModules();
      
      // Act & Assert
      expect(() => import('../client.js')).toThrow('Error interno del servidor');
    });
  });
});