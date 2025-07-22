/**
 * @jest-environment jsdom
 */

// Mock import.meta.env
const mockEnv = {
  VITE_API_BASE_URL: 'https://api.example.com',
  DEV: true,
  PROD: false,
};

Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: mockEnv,
    },
  },
});

// Mock config
jest.mock('../config/environment.js', () => ({
  config: {
    apiBaseUrl: 'https://api.example.com',
    isDevelopment: true,
    isProduction: false,
    enableDebugLogs: true,
    requestTimeout: 10000,
  },
}));

import { 
  logEnvironmentInfo, 
  validateConfiguration, 
  logApiRequest, 
  logApiResponse, 
  logApiError 
} from '../debug.js';

describe('Debug Utilities', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'group').mockImplementation(() => {});
    jest.spyOn(console, 'groupEnd').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('logEnvironmentInfo', () => {
    it('should log environment information when debug is enabled', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'group');
      const consoleLogSpy = jest.spyOn(console, 'log');

      // Act
      logEnvironmentInfo();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('🔧 Información de Configuración');
      expect(consoleLogSpy).toHaveBeenCalledWith('API Base URL:', 'https://api.example.com');
      expect(consoleLogSpy).toHaveBeenCalledWith('Entorno:', 'development');
    });
  });

  describe('validateConfiguration', () => {
    it('should return true for valid configuration', () => {
      // Act
      const result = validateConfiguration();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false and log error for invalid configuration', () => {
      // Arrange
      jest.doMock('../config/environment.js', () => ({
        config: {
          apiBaseUrl: '',
          enableDebugLogs: true,
        },
      }));

      const consoleErrorSpy = jest.spyOn(console, 'error');

      // Act
      const result = validateConfiguration();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('logApiRequest', () => {
    it('should log API request when debug is enabled', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log');

      // Act
      logApiRequest('GET', '/api/words/random');

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('🚀 GET /api/words/random');
    });
  });

  describe('logApiResponse', () => {
    it('should log successful API response', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log');

      // Act
      logApiResponse(200, '/api/words/random');

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('✅ 200 /api/words/random');
    });

    it('should log failed API response', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log');

      // Act
      logApiResponse(404, '/api/words/random');

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('❌ 404 /api/words/random');
    });
  });

  describe('logApiError', () => {
    it('should log API error with context', () => {
      // Arrange
      const consoleGroupSpy = jest.spyOn(console, 'group');
      const consoleErrorSpy = jest.spyOn(console, 'error');
      const error = new Error('Test error');

      // Act
      logApiError(error, 'Test context');

      // Assert
      expect(consoleGroupSpy).toHaveBeenCalledWith('❌ Error de API - Test context');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', error);
    });

    it('should show suggestion for 404 errors', () => {
      // Arrange
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      const error = { response: { status: 404 } };

      // Act
      logApiError(error);

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith('💡 Sugerencia: Verifica que VITE_API_BASE_URL apunte al servidor correcto');
    });
  });
});