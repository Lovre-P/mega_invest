import { hashPassword, comparePasswords, authenticateUser, createJWT, verifyJWT } from './auth';
import { User } from './db-query'; // Assuming User type is exported from db-query

// Mock server-db
jest.mock('@/lib/server-db', () => ({
  getUserByEmail: jest.fn(),
}));

// Helper to manage environment variables
const originalEnv = process.env;

describe('Auth Functions', () => {
  beforeEach(() => {
    // Reset the environment variables before each test
    jest.resetModules(); // Clears module cache, useful if modules read env vars on load
    process.env = { ...originalEnv }; // Restore original env
  });

  afterAll(() => {
    // Restore original environment variables after all tests
    process.env = originalEnv;
  });

  describe('Auth Password Functions', () => {
    describe('hashPassword', () => {
      it('should produce a hash for a given password', async () => {
        const password = 'mysecretpassword';
        const hashedPassword = await hashPassword(password);
        
        expect(hashedPassword).toBeDefined();
        expect(typeof hashedPassword).toBe('string');
        expect(hashedPassword).not.toEqual(password);
      });

      it('should produce different hashes for the same password (due to salting)', async () => {
        const password = 'mysecretpassword';
        const hashedPassword1 = await hashPassword(password);
        const hashedPassword2 = await hashPassword(password);
        
        expect(hashedPassword1).not.toEqual(hashedPassword2);
      });
    });

    describe('comparePasswords', () => {
      it('should return true for a correct password and its hash', async () => {
        const password = 'mysecretpassword';
        const hashedPassword = await hashPassword(password);
        
        const isMatch = await comparePasswords(password, hashedPassword);
        expect(isMatch).toBe(true);
      });

      it('should return false for an incorrect password and a hash', async () => {
        const password = 'mysecretpassword';
        const incorrectPassword = 'wrongpassword';
        const hashedPassword = await hashPassword(password);
        
        const isMatch = await comparePasswords(incorrectPassword, hashedPassword);
        expect(isMatch).toBe(false);
      });

      it('should return false if the hash is invalid or corrupted', async () => {
          const password = 'mysecretpassword';
          const invalidHash = 'thisisnotavalidbcryptHash';
          
          const isMatch = await comparePasswords(password, invalidHash);
          expect(isMatch).toBe(false);
        });
    });
  });

  describe('authenticateUser', () => {
    const adminEmail = 'admin@test.com';
    const adminPassword = 'password123';

    it('should authenticate admin with correct .env credentials', async () => {
      process.env.ADMIN_EMAIL = adminEmail;
      process.env.ADMIN_PASSWORD = adminPassword;
      
      const user = await authenticateUser(adminEmail, adminPassword);
      expect(user).not.toBeNull();
      expect(user?.email).toBe(adminEmail);
      expect(user?.role).toBe('admin');
      expect(user?.id).toBe('admin');
      expect((user as User)?.password).toBeUndefined(); // Ensure password is not returned
    });

    it('should not authenticate with incorrect password for .env admin', async () => {
      process.env.ADMIN_EMAIL = adminEmail;
      process.env.ADMIN_PASSWORD = adminPassword;
      
      const user = await authenticateUser(adminEmail, 'wrongpassword');
      expect(user).toBeNull();
    });

    it('should not authenticate with incorrect email for .env admin', async () => {
      process.env.ADMIN_EMAIL = adminEmail;
      process.env.ADMIN_PASSWORD = adminPassword;
      
      const user = await authenticateUser('wrong@test.com', adminPassword);
      expect(user).toBeNull();
    });

    it('should not authenticate if ADMIN_EMAIL is not set in .env', async () => {
      process.env.ADMIN_EMAIL = undefined; // or delete process.env.ADMIN_EMAIL;
      process.env.ADMIN_PASSWORD = adminPassword;
      
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const user = await authenticateUser(adminEmail, adminPassword);
      expect(user).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Admin authentication attempted, but ADMIN_EMAIL is not set in environment variables. Authentication will fail.'
      );
      consoleWarnSpy.mockRestore();
    });

     it('should not authenticate if ADMIN_PASSWORD is not set in .env (even if ADMIN_EMAIL is set)', async () => {
      process.env.ADMIN_EMAIL = adminEmail;
      process.env.ADMIN_PASSWORD = undefined; 
      
      const user = await authenticateUser(adminEmail, adminPassword);
      expect(user).toBeNull();
    });
  });

  describe('JWT Functions (createJWT & verifyJWT)', () => {
    const jwtSecret = 'test-jwt-secret-very-secure';
    const sampleUser: Omit<User, 'password'> = {
      id: 'user123',
      email: 'test@example.com',
      role: 'admin',
      name: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    beforeEach(() => {
      process.env.JWT_SECRET = jwtSecret;
    });

    it('should create a JWT token and verify it successfully', async () => {
      const token = await createJWT(sampleUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // Basic check for JWT structure

      const decodedPayload = await verifyJWT(token);
      expect(decodedPayload).not.toBeNull();
      expect(decodedPayload?.id).toBe(sampleUser.id);
      expect(decodedPayload?.email).toBe(sampleUser.email);
      expect(decodedPayload?.role).toBe(sampleUser.role);
      // Check for expiration (iat and exp should exist)
      expect(decodedPayload?.iat).toBeDefined();
      expect(decodedPayload?.exp).toBeDefined();
    });

    it('should return null when verifying an invalid token string', async () => {
      const invalidToken = 'this.is.notavalidtoken';
      const decodedPayload = await verifyJWT(invalidToken);
      expect(decodedPayload).toBeNull();
    });
    
    it('should return null when verifying an expired token', async () => {
        // Create a token that expires immediately
        const expiredToken = await new (require('jose').SignJWT)({ ...sampleUser })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('0s') // Expires immediately
            .sign(new TextEncoder().encode(jwtSecret));

        // Wait a tiny bit to ensure it's expired
        await new Promise(resolve => setTimeout(resolve, 50)); 
        
        const decodedPayload = await verifyJWT(expiredToken);
        expect(decodedPayload).toBeNull();
    });

    it('should return null when verifying a token signed with a different secret', async () => {
      const anotherSecret = 'another-different-secret-key';
      const tokenSignedWithDifferentSecret = await new (require('jose').SignJWT)({ ...sampleUser })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(anotherSecret)); // Signed with anotherSecret
      
      // process.env.JWT_SECRET is still 'test-jwt-secret-very-secure' for verifyJWT
      const decodedPayload = await verifyJWT(tokenSignedWithDifferentSecret);
      expect(decodedPayload).toBeNull();
    });
  });
});
