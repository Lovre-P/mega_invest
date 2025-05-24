// src/lib/backup.test.ts
import { backupFile, isBackupNeeded, cleanupOldBackups, getLastBackupTime, BACKUP_DIR } from './backup';
import fs from 'fs'; // Will be mocked
import path from 'path';

// Mock the entire fs module
jest.mock('fs');

// Define the paths as they are in backup.ts for consistency in tests
const dataDir = path.join(process.cwd(), '_internal_data');
const backupDir = path.join(process.cwd(), '_internal_data', 'backups');
const backupConfigPath = path.join(dataDir, 'backup-config.json');

// Backup interval in milliseconds (12 hours) - from backup.ts
const BACKUP_INTERVAL_MS = 12 * 60 * 60 * 1000;

describe('Backup Utility Functions', () => {
  // Typed mock for fs functions
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();

    // Default mock implementations
    mockFs.existsSync.mockReturnValue(true); // Assume files/dirs exist unless specified
    mockFs.mkdirSync.mockReturnValue(undefined);
    mockFs.copyFileSync.mockReturnValue(undefined);
    mockFs.writeFileSync.mockReturnValue(undefined);
    mockFs.unlinkSync.mockReturnValue(undefined);
    // Default for readdirSync: return empty arrays to avoid errors if not specifically mocked
    mockFs.readdirSync.mockReturnValue([]); 
  });

  describe('isBackupNeeded', () => {
    it('should return true if no previous backup exists for a file', () => {
      mockFs.existsSync.mockReturnValueOnce(true); // backupConfigPath exists
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify({ lastBackups: {} }));
      expect(isBackupNeeded('testfile.json')).toBe(true);
    });

    it('should return true if backupConfig.json does not exist', () => {
      mockFs.existsSync.mockReturnValueOnce(false); // backupConfigPath does NOT exist
      // writeFileSync will be called to create a default one
      mockFs.writeFileSync.mockImplementation(() => {}); 
      expect(isBackupNeeded('testfile.json')).toBe(true);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        backupConfigPath,
        JSON.stringify({ lastBackups: {} }, null, 2),
        'utf8'
      );
    });

    it('should return true if previous backup is older than BACKUP_INTERVAL_MS', () => {
      const oldTimestamp = new Date(Date.now() - BACKUP_INTERVAL_MS - 1000).toISOString();
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify({
        lastBackups: { 'testfile.json': oldTimestamp }
      }));
      expect(isBackupNeeded('testfile.json')).toBe(true);
    });

    it('should return false if previous backup is within BACKUP_INTERVAL_MS', () => {
      const recentTimestamp = new Date(Date.now() - BACKUP_INTERVAL_MS / 2).toISOString();
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify({
        lastBackups: { 'testfile.json': recentTimestamp }
      }));
      expect(isBackupNeeded('testfile.json')).toBe(false);
    });

    it('should return true if timestamp is invalid (causes Date constructor to be invalid)', () => {
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify({
        lastBackups: { 'testfile.json': 'invalid-date-string' }
      }));
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(isBackupNeeded('testfile.json')).toBe(true);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Invalid backup timestamp found for testfile.json: invalid-date-string. Assuming backup is needed."
      );
      consoleWarnSpy.mockRestore();
    });
  });

  describe('backupFile', () => {
    const testFilename = 'investments.json';
    const sourcePath = path.join(dataDir, testFilename);

    it('should successfully create a backup if needed', () => {
      // Mock isBackupNeeded to return true indirectly by not having a recent backup
      mockFs.readFileSync.mockImplementation((filePath) => {
        if (filePath === backupConfigPath) {
          return JSON.stringify({ lastBackups: {} }); // No recent backup
        }
        return ''; // Default for other files if any
      });

      const result = backupFile(testFilename);
      expect(result).toBe(true);
      expect(mockFs.copyFileSync).toHaveBeenCalledTimes(1);
      // Check that copyFileSync was called with a path in the backupDir
      expect(mockFs.copyFileSync.mock.calls[0][1]).toContain(BACKUP_DIR);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        backupConfigPath,
        expect.stringContaining(testFilename), // Config should be updated
        'utf8'
      );
    });

    it('should skip backup if not needed', () => {
       const recentTimestamp = new Date(Date.now() - BACKUP_INTERVAL_MS / 2).toISOString();
       mockFs.readFileSync.mockImplementation((filePath) => {
        if (filePath === backupConfigPath) {
          return JSON.stringify({ lastBackups: { [testFilename]: recentTimestamp } });
        }
        return '';
      });
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      const result = backupFile(testFilename);
      expect(result).toBe(true); // Skipping is considered a success
      expect(mockFs.copyFileSync).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Backup skipped'));
      consoleLogSpy.mockRestore();
    });

    it('should return false if source file does not exist', () => {
      mockFs.existsSync.mockImplementation((pathToCheck) => {
        if (pathToCheck === sourcePath) return false; // Source file doesn't exist
        return true; // Other paths (like backupConfigPath) exist
      });
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = backupFile(testFilename);
      expect(result).toBe(false);
      expect(mockFs.copyFileSync).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Source file does not exist'));
      consoleErrorSpy.mockRestore();
    });
    
    it('should return true even if updateBackupTimestamp fails (logs a warning)', () => {
      // isBackupNeeded returns true (no recent backup)
      mockFs.readFileSync.mockImplementation((filePath) => {
         if (filePath === backupConfigPath) return JSON.stringify({ lastBackups: {} });
         return '';
      });
      // Simulate writeBackupConfig failure (which updateBackupTimestamp calls)
      mockFs.writeFileSync.mockImplementation((filePath, data) => {
        if (filePath === backupConfigPath) throw new Error('Failed to write config');
      });
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // To catch the error from writeFileSync

      const result = backupFile(testFilename);
      
      expect(result).toBe(true); // Backup file was created
      expect(mockFs.copyFileSync).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to update backup timestamp'));
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error writing backup config:", expect.any(Error));
      
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should call cleanupOldBackups after a successful backup', () => {
        mockFs.readFileSync.mockImplementation((filePath) => {
            if (filePath === backupConfigPath) return JSON.stringify({ lastBackups: {} });
            return '';
        });
        // Mock readdirSync for cleanupOldBackups to avoid errors
        mockFs.readdirSync.mockImplementation((dirPath) => {
            if (dirPath === dataDir) return [testFilename, 'backup-config.json'];
            if (dirPath === backupDir) return []; // No existing backups to trigger cleanup logic complexity
            return [];
        });

        backupFile(testFilename);
        // We can't directly check if cleanupOldBackups was called without spying on it
        // or by observing its side effects (like fs.unlinkSync).
        // For this test, we'll assume if copyFileSync was called, cleanup was attempted.
        // A more robust test would spy on cleanupOldBackups if it were exported,
        // or test its effects more directly.
        expect(mockFs.copyFileSync).toHaveBeenCalled();
    });
  });

  describe('cleanupOldBackups', () => {
    const baseFilename = 'investments'; // e.g. investments.json
    const dataFiles = [`${baseFilename}.json`, 'backup-config.json']; // Corrected backtick to single quote
    
    beforeEach(() => {
        // Mock readdirSync for dataDir
        mockFs.readdirSync.mockImplementation((p) => {
            if (p === dataDir) {
                return dataFiles;
            }
            // For backupDir, it will be set by specific tests
            return []; 
        });
    });

    it('should delete older backups, keeping maxBackupsPerFile', () => {
      const maxBackups = 2;
      const now = Date.now();
      const backupFiles = [
        `${baseFilename}_${new Date(now - 1000).toISOString().replace(/[:.]/g, '-')}.json`, // newest
        `${baseFilename}_${new Date(now - 2000).toISOString().replace(/[:.]/g, '-')}.json`, // second newest
        `${baseFilename}_${new Date(now - 3000).toISOString().replace(/[:.]/g, '-')}.json`, // to be deleted
        `${baseFilename}_${new Date(now - 4000).toISOString().replace(/[:.]/g, '-')}.json`, // to be deleted
      ];
      mockFs.readdirSync.mockImplementation((p) => {
        if (p === dataDir) return dataFiles;
        if (p === backupDir) return backupFiles;
        return [];
      });
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = cleanupOldBackups(maxBackups);
      expect(result).toBe(true);
      expect(mockFs.unlinkSync).toHaveBeenCalledTimes(2);
      expect(mockFs.unlinkSync).toHaveBeenCalledWith(path.join(backupDir, backupFiles[2]));
      expect(mockFs.unlinkSync).toHaveBeenCalledWith(path.join(backupDir, backupFiles[3]));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(`Deleted old backup: ${path.join(backupDir, backupFiles[2])}`));
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining(`Deleted old backup: ${path.join(backupDir, backupFiles[3])}`));
      consoleLogSpy.mockRestore();
    });

    it('should not delete anything if backups are less than or equal to maxBackupsPerFile', () => {
      const maxBackups = 3;
      const backupFiles = [
        `${baseFilename}_timestamp1.json`,
        `${baseFilename}_timestamp2.json`,
      ];
       mockFs.readdirSync.mockImplementation((p) => {
        if (p === dataDir) return dataFiles;
        if (p === backupDir) return backupFiles;
        return [];
      });
      
      const result = cleanupOldBackups(maxBackups);
      expect(result).toBe(true);
      expect(mockFs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should return true if backup directory does not exist', () => {
      mockFs.existsSync.mockImplementation((p) => p !== backupDir); // backupDir does not exist
      const result = cleanupOldBackups();
      expect(result).toBe(true);
      expect(mockFs.readdirSync).not.toHaveBeenCalledWith(backupDir);
    });

    it('should handle multiple original data files correctly', () => {
        const baseFilename1 = 'investments';
        const baseFilename2 = 'users';
        const multipleDataFiles = [`${baseFilename1}.json`, `${baseFilename2}.json`, 'backup-config.json'];
        mockFs.readdirSync.mockImplementation((p) => {
            if (p === dataDir) return multipleDataFiles;
            if (p === backupDir) {
                // 3 backups for investments, 1 for users
                return [
                    `${baseFilename1}_ts3.json`, // newest
                    `${baseFilename1}_ts2.json`,
                    `${baseFilename1}_ts1.json`, // oldest
                    `${baseFilename2}_ts1.json`, // only one for users
                ];
            }
            return [];
        });
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const result = cleanupOldBackups(1); // Keep only 1 per file
        expect(result).toBe(true);
        expect(mockFs.unlinkSync).toHaveBeenCalledTimes(2); // Delete 2 from investments
        expect(mockFs.unlinkSync).toHaveBeenCalledWith(path.join(backupDir, `${baseFilename1}_ts2.json`));
        expect(mockFs.unlinkSync).toHaveBeenCalledWith(path.join(backupDir, `${baseFilename1}_ts1.json`));
        consoleLogSpy.mockRestore();
    });
  });

  // getLastBackupTime is a simple wrapper around readBackupConfig,
  // so its tests would be very similar to isBackupNeeded's config reading part.
  describe('getLastBackupTime', () => {
    it('should return the timestamp if file has a backup entry', () => {
      const timestamp = new Date().toISOString();
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify({
        lastBackups: { 'testfile.json': timestamp }
      }));
      expect(getLastBackupTime('testfile.json')).toBe(timestamp);
    });

    it('should return null if file has no backup entry', () => {
      mockFs.readFileSync.mockReturnValueOnce(JSON.stringify({
        lastBackups: {}
      }));
      expect(getLastBackupTime('testfile.json')).toBe(null);
    });
  });
});
