/**
 * @jest-environment jsdom
 */

// Mock import.meta.env antes de importar el módulo
const mockEnv = {
  VITE_API_BASE_URL: '',
  DEV: true,
  PROD: false,
};

// Mock global import.meta
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: mockEnv,
    },
  },
});

describe('Environment Configuration', () => {
  beforeEach(() => {
    // Reset console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Clear module cache
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should use environment variable when VITE_API_BASE_URL is set', async () => {
    // Arrange
    mockEnv.VITE_API_BASE_URL = 'https://api.example.com';
    mockEnv.DEV = false;
    mockEnv.PROD = true;

    // Act
    const { config } = await import('../environment.js');

    // Assert
    expect(config.apiBaseUrl).toBe('https://api.example.com');
    expect(config.isDevelopment).toBe(false);
    expect(config.isProduction).toBe(true);
    expect(config.enableDebugLogs).toBe(false);
  });

  it('should use default URL when VITE_API_BASE_URL is not set', async () => {
    // Arrange
    mockEnv.VITE_API_BASE_URL = '';
    mockEnv.DEV = true;
    mockEnv.PROD = false;

    // Act
    const { config } = await import('../environment.js');

    // Assert
    expect(config.apiBaseUrl).toBe('http://localhost:3001');
    expect(config.isDevelopment).toBe(true);
    expect(config.isProduction).toBe(false);
    expect(config.enableDebugLogs).toBe(true);
  });

  it('should show warning in development when using default URL', async () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, 'warn');
    mockEnv.VITE_API_BASE_URL = '';
    mockEnv.DEV = true;
    mockEnv.PROD = false;

    // Act
    await import('../environment.js');

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      '⚠️ VITE_API_BASE_URL no está definida, usando URL por defecto:',
      'http://localhost:3001'
    );
  });

  it('should validate URL format', async () => {
    // Arrange
    mockEnv.VITE_API_BASE_URL = 'invalid-url';
    mockEnv.DEV = true;
    mockEnv.PROD = false;

    // Act
    const { config } = await import('../environment.js');

    // Assert
    expect(config.apiBaseUrl).toBe('http://localhost:3001'); // Should fallback to default
  });

  it('should have correct timeout configuration', async () => {
    // Arrange
    mockEnv.VITE_API_BASE_URL = 'https://api.example.com';

    // Act
    const { config } = await import('../environment.js');

    // Assert
    expect(config.requestTimeout).toBe(10000);
  });

  it('should log configuration in development mode', async () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, 'log');
    mockEnv.VITE_API_BASE_URL = 'https://api.example.com';
    mockEnv.DEV = true;
    mockEnv.PROD = false;

    // Act
    await import('../environment.js');

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      '🔧 Configuración de entorno:',
      expect.objectContaining({
        apiBaseUrl: 'https://api.example.com',
        environment: 'development',
        debugEnabled: true,
      })
    );
  });
});