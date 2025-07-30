import { PrismaClient } from '@prisma/client';
import { createApiClient, createAdminClient, verifyDatabaseConnection } from '../../config/database.js';

describe('Row Level Security Tests', () => {
  let apiClient: PrismaClient;
  let adminClient: PrismaClient;

  beforeAll(async () => {
    apiClient = createApiClient();
    adminClient = createAdminClient();
  });

  afterAll(async () => {
    await apiClient.$disconnect();
    await adminClient.$disconnect();
  });

  describe('RLS Configuration', () => {
    it('should have RLS enabled on words table', async () => {
      const result = await apiClient.$queryRaw`
        SELECT relrowsecurity 
        FROM pg_class 
        WHERE relname = 'words'
      ` as Array<{ relrowsecurity: boolean }>;

      expect(result).toHaveLength(1);
      expect(result[0].relrowsecurity).toBe(true);
    });

    it('should have security policies created', async () => {
      const policies = await apiClient.$queryRaw`
        SELECT policyname, cmd, permissive, roles, qual, with_check
        FROM pg_policies 
        WHERE tablename = 'words' AND schemaname = 'public'
      ` as Array<any>;

      expect(policies.length).toBeGreaterThan(0);
      
      // Verificar que existe al menos una política de SELECT
      const selectPolicies = policies.filter(p => p.cmd === 'SELECT' || p.cmd === 'ALL');
      expect(selectPolicies.length).toBeGreaterThan(0);
    });
  });

  describe('API User Permissions', () => {
    it('should allow SELECT operations for API user', async () => {
      // Esta prueba verifica que el usuario de API puede leer datos
      const words = await apiClient.word.findMany({
        take: 5
      });

      expect(Array.isArray(words)).toBe(true);
      // No importa si hay datos o no, lo importante es que no falle por permisos
    });

    it('should allow counting words for API user', async () => {
      const count = await apiClient.word.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('should allow finding random word for API user', async () => {
      // Intentar obtener una palabra aleatoria
      const word = await apiClient.word.findFirst();
      // Puede ser null si no hay datos, pero no debe fallar por permisos
      expect(word === null || typeof word === 'object').toBe(true);
    });
  });

  describe('Database Connection Verification', () => {
    it('should verify database connection successfully', async () => {
      // Esta función incluye verificación de RLS
      await expect(verifyDatabaseConnection()).resolves.not.toThrow();
    });

    it('should connect to database with API client', async () => {
      await expect(apiClient.$connect()).resolves.not.toThrow();
    });
  });

  describe('Security Policies Functionality', () => {
    it('should have proper policy configuration', async () => {
      // Verificar que las políticas están configuradas correctamente
      const policyInfo = await apiClient.$queryRaw`
        SELECT 
          policyname,
          cmd,
          permissive,
          roles,
          qual,
          with_check
        FROM pg_policies 
        WHERE tablename = 'words' 
        AND schemaname = 'public'
        ORDER BY policyname
      ` as Array<{
        policyname: string;
        cmd: string;
        permissive: string;
        roles: string[];
        qual: string;
        with_check: string;
      }>;

      expect(policyInfo.length).toBeGreaterThan(0);

      // Verificar que hay políticas para SELECT
      const selectPolicies = policyInfo.filter(p => 
        p.cmd === 'SELECT' || p.cmd === 'ALL'
      );
      expect(selectPolicies.length).toBeGreaterThan(0);

      // Verificar que las políticas son permisivas (PERMISSIVE)
      const permissivePolicies = policyInfo.filter(p => p.permissive === 'PERMISSIVE');
      expect(permissivePolicies.length).toBeGreaterThan(0);
    });

    it('should allow access through defined policies', async () => {
      // Probar que las políticas permiten el acceso esperado
      const testQuery = async () => {
        return await apiClient.word.findMany({
          select: {
            id: true,
            word: true,
            accentType: true
          },
          take: 1
        });
      };

      await expect(testQuery()).resolves.not.toThrow();
    });
  });

  describe('User Roles and Permissions', () => {
    it('should have API user with correct permissions', async () => {
      // Verificar que el usuario de API tiene los permisos correctos
      const permissions = await apiClient.$queryRaw`
        SELECT 
          grantee,
          table_name,
          privilege_type
        FROM information_schema.table_privileges 
        WHERE table_name = 'words' 
        AND grantee = 'clasificador_api_user'
      ` as Array<{
        grantee: string;
        table_name: string;
        privilege_type: string;
      }>;

      // Verificar que tiene al menos permisos de SELECT
      const selectPermissions = permissions.filter(p => p.privilege_type === 'SELECT');
      expect(selectPermissions.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Probar que los errores de base de datos se manejan correctamente
      const invalidQuery = async () => {
        return await apiClient.$queryRaw`SELECT * FROM non_existent_table`;
      };

      await expect(invalidQuery()).rejects.toThrow();
    });

    it('should maintain connection stability', async () => {
      // Verificar que la conexión se mantiene estable después de errores
      const validQuery = async () => {
        return await apiClient.word.count();
      };

      await expect(validQuery()).resolves.not.toThrow();
    });
  });
});