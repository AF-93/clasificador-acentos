import { createApiClient, createAdminClient } from '../../config/database.js';
import { PrismaClient } from '@prisma/client';

describe('Database Security Tests', () => {
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

  describe('Connection Security', () => {
    it('should use different connection strings for API and admin', () => {
      const apiUrl = process.env.DATABASE_URL;
      const adminUrl = process.env.ADMIN_DATABASE_URL;

      expect(apiUrl).toBeDefined();
      
      if (adminUrl) {
        expect(apiUrl).not.toBe(adminUrl);
        expect(apiUrl).toContain('clasificador_api_user');
        expect(adminUrl).toContain('clasificador_admin_user');
      }
    });

    it('should connect successfully with API client', async () => {
      await expect(apiClient.$connect()).resolves.not.toThrow();
    });

    it('should connect successfully with admin client if configured', async () => {
      if (process.env.ADMIN_DATABASE_URL) {
        await expect(adminClient.$connect()).resolves.not.toThrow();
      }
    });
  });

  describe('API Client Permissions', () => {
    it('should allow reading words', async () => {
      const words = await apiClient.word.findMany({ take: 1 });
      expect(Array.isArray(words)).toBe(true);
    });

    it('should allow counting words', async () => {
      const count = await apiClient.word.count();
      expect(typeof count).toBe('number');
    });

    it('should allow filtering words by accent type', async () => {
      const agudas = await apiClient.word.findMany({
        where: { accentType: 'aguda' },
        take: 1
      });
      expect(Array.isArray(agudas)).toBe(true);
    });
  });

  describe('RLS Policy Verification', () => {
    it('should have RLS enabled', async () => {
      const rlsStatus = await apiClient.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          rowsecurity,
          forcerowsecurity
        FROM pg_tables 
        WHERE tablename = 'words'
      ` as Array<{
        schemaname: string;
        tablename: string;
        rowsecurity: boolean;
        forcerowsecurity: boolean;
      }>;

      expect(rlsStatus).toHaveLength(1);
      expect(rlsStatus[0].rowsecurity).toBe(true);
    });

    it('should list all policies for words table', async () => {
      const policies = await apiClient.$queryRaw`
        SELECT 
          policyname,
          cmd,
          permissive,
          roles,
          qual,
          with_check
        FROM pg_policies 
        WHERE tablename = 'words'
        ORDER BY policyname
      ` as Array<{
        policyname: string;
        cmd: string;
        permissive: string;
        roles: string[];
        qual: string;
        with_check: string;
      }>;

      expect(policies.length).toBeGreaterThan(0);

      // Log policies for debugging
      console.log('📋 Políticas de seguridad encontradas:');
      policies.forEach(policy => {
        console.log(`  - ${policy.policyname}: ${policy.cmd} (${policy.permissive})`);
      });
    });

    it('should have SELECT policies', async () => {
      const selectPolicies = await apiClient.$queryRaw`
        SELECT policyname, cmd, roles
        FROM pg_policies 
        WHERE tablename = 'words' 
        AND (cmd = 'SELECT' OR cmd = 'ALL')
      ` as Array<{
        policyname: string;
        cmd: string;
        roles: string[];
      }>;

      expect(selectPolicies.length).toBeGreaterThan(0);
    });
  });

  describe('User Permissions Verification', () => {
    it('should verify API user permissions', async () => {
      const permissions = await apiClient.$queryRaw`
        SELECT 
          grantee,
          table_schema,
          table_name,
          privilege_type,
          is_grantable
        FROM information_schema.table_privileges 
        WHERE table_name = 'words'
        AND grantee IN ('clasificador_api_user', 'PUBLIC')
        ORDER BY grantee, privilege_type
      ` as Array<{
        grantee: string;
        table_schema: string;
        table_name: string;
        privilege_type: string;
        is_grantable: string;
      }>;

      // Log permissions for debugging
      console.log('🔐 Permisos encontrados:');
      permissions.forEach(perm => {
        console.log(`  - ${perm.grantee}: ${perm.privilege_type} on ${perm.table_name}`);
      });

      expect(permissions.length).toBeGreaterThan(0);
    });

    it('should verify database users exist', async () => {
      const users = await apiClient.$queryRaw`
        SELECT 
          usename,
          usecreatedb,
          usesuper,
          userepl,
          usebypassrls
        FROM pg_user 
        WHERE usename IN ('clasificador_api_user', 'clasificador_admin_user')
        ORDER BY usename
      ` as Array<{
        usename: string;
        usecreatedb: boolean;
        usesuper: boolean;
        userepl: boolean;
        usebypassrls: boolean;
      }>;

      // Log users for debugging
      console.log('👥 Usuarios de base de datos:');
      users.forEach(user => {
        console.log(`  - ${user.usename}: super=${user.usesuper}, createdb=${user.usecreatedb}`);
      });

      // Verificar que al menos existe el usuario de API
      const apiUser = users.find(u => u.usename === 'clasificador_api_user');
      expect(apiUser).toBeDefined();
      
      if (apiUser) {
        expect(apiUser.usesuper).toBe(false); // No debe ser superusuario
        expect(apiUser.usecreatedb).toBe(false); // No debe poder crear DBs
      }
    });
  });

  describe('Security Compliance', () => {
    it('should not allow bypassing RLS for API user', async () => {
      const apiUserRLS = await apiClient.$queryRaw`
        SELECT usebypassrls 
        FROM pg_user 
        WHERE usename = 'clasificador_api_user'
      ` as Array<{ usebypassrls: boolean }>;

      if (apiUserRLS.length > 0) {
        expect(apiUserRLS[0].usebypassrls).toBe(false);
      }
    });

    it('should have proper role configuration', async () => {
      const roleConfig = await apiClient.$queryRaw`
        SELECT 
          rolname,
          rolsuper,
          rolinherit,
          rolcreaterole,
          rolcreatedb,
          rolcanlogin,
          rolbypassrls
        FROM pg_roles 
        WHERE rolname IN ('clasificador_api_user', 'clasificador_admin_user')
        ORDER BY rolname
      ` as Array<{
        rolname: string;
        rolsuper: boolean;
        rolinherit: boolean;
        rolcreaterole: boolean;
        rolcreatedb: boolean;
        rolcanlogin: boolean;
        rolbypassrls: boolean;
      }>;

      roleConfig.forEach(role => {
        if (role.rolname === 'clasificador_api_user') {
          expect(role.rolsuper).toBe(false);
          expect(role.rolcreaterole).toBe(false);
          expect(role.rolcreatedb).toBe(false);
          expect(role.rolbypassrls).toBe(false);
          expect(role.rolcanlogin).toBe(true);
        }
      });
    });
  });
});