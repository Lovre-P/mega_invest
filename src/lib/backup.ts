import fs from 'fs';
import path from 'path';

// Define the paths to our JSON files
const dataDir = path.join(process.cwd(), 'src/data');
const backupDir = path.join(process.cwd(), 'src/data/backups');
const backupConfigPath = path.join(dataDir, 'backup-config.json');

// Backup interval in milliseconds (12 hours)
const BACKUP_INTERVAL_MS = 12 * 60 * 60 * 1000;

// Type definition for backup config
interface BackupConfig {
  lastBackups: {
    [filename: string]: string; // filename -> ISO timestamp
  };
}

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

/**
 * Reads the backup configuration file
 * @returns The backup configuration object
 */
function readBackupConfig(): BackupConfig {
  try {
    if (!fs.existsSync(backupConfigPath)) {
      // Create default config if it doesn't exist
      const defaultConfig: BackupConfig = { lastBackups: {} };
      fs.writeFileSync(backupConfigPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
      return defaultConfig;
    }

    const configData = fs.readFileSync(backupConfigPath, 'utf8');
    return JSON.parse(configData) as BackupConfig;
  } catch (error) {
    console.error(`Error reading backup config:`, error);
    // Return default config in case of error
    return { lastBackups: {} };
  }
}

/**
 * Writes the backup configuration file
 * @param config The backup configuration object to write
 * @returns boolean indicating success or failure
 */
function writeBackupConfig(config: BackupConfig): boolean {
  try {
    fs.writeFileSync(backupConfigPath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing backup config:`, error);
    return false;
  }
}

/**
 * Checks if a backup is needed for a file based on the last backup timestamp
 * @param filename The name of the file to check
 * @returns boolean indicating if backup is needed
 */
function isBackupNeeded(filename: string): boolean {
  const config = readBackupConfig();
  const lastBackupTime = config.lastBackups[filename];

  // If no previous backup, a backup is needed
  if (!lastBackupTime) {
    return true;
  }

  try {
    const lastBackupDate = new Date(lastBackupTime);
    const currentDate = new Date();

    // Check if the time difference is greater than the backup interval
    const timeDiff = currentDate.getTime() - lastBackupDate.getTime();
    return timeDiff >= BACKUP_INTERVAL_MS;
  } catch (error) {
    console.error(`Error parsing backup timestamp for ${filename}:`, error);
    // If there's an error parsing the timestamp, assume backup is needed
    return true;
  }
}

/**
 * Updates the last backup timestamp for a file
 * @param filename The name of the file that was backed up
 * @returns boolean indicating success or failure
 */
function updateBackupTimestamp(filename: string): boolean {
  try {
    const config = readBackupConfig();
    config.lastBackups[filename] = new Date().toISOString();
    return writeBackupConfig(config);
  } catch (error) {
    console.error(`Error updating backup timestamp for ${filename}:`, error);
    return false;
  }
}

/**
 * Creates a backup of a specific JSON data file if needed
 * @param filename The name of the file to backup (e.g., 'investments.json')
 * @param forceBackup If true, creates a backup regardless of the timestamp
 * @returns boolean indicating success or failure
 */
export function backupFile(filename: string, forceBackup: boolean = false): boolean {
  try {
    const sourcePath = path.join(dataDir, filename);

    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.error(`Source file does not exist: ${sourcePath}`);
      return false;
    }

    // Check if backup is needed based on timestamp
    if (!forceBackup && !isBackupNeeded(filename)) {
      console.log(`Backup skipped for ${filename}: Last backup is less than 12 hours old`);
      return true; // Return true since skipping is not a failure
    }

    // Create timestamp for backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `${path.parse(filename).name}_${timestamp}${path.parse(filename).ext}`;
    const backupPath = path.join(backupDir, backupFilename);

    // Copy the file
    fs.copyFileSync(sourcePath, backupPath);
    console.log(`Backup created: ${backupPath}`);

    // Update the backup timestamp
    updateBackupTimestamp(filename);

    return true;
  } catch (error) {
    console.error(`Error creating backup for ${filename}:`, error);
    return false;
  }
}

/**
 * Creates backups of all JSON data files
 * @param forceBackup If true, creates backups regardless of the timestamp
 * @returns boolean indicating success or failure
 */
export function backupAllFiles(forceBackup: boolean = false): boolean {
  try {
    // Get all JSON files in the data directory
    const files = fs.readdirSync(dataDir)
      .filter(file => path.extname(file).toLowerCase() === '.json')
      // Exclude the backup config file itself
      .filter(file => file !== path.basename(backupConfigPath));

    if (files.length === 0) {
      console.warn('No JSON files found to backup');
      return false;
    }

    // Backup each file
    let allSuccessful = true;
    for (const file of files) {
      const success = backupFile(file, forceBackup);
      if (!success) {
        allSuccessful = false;
      }
    }

    return allSuccessful;
  } catch (error) {
    console.error('Error backing up all files:', error);
    return false;
  }
}

/**
 * Restores a file from a backup
 * @param backupFilename The name of the backup file to restore
 * @param targetFilename The name to restore to (defaults to original filename)
 * @returns boolean indicating success or failure
 */
export function restoreFromBackup(backupFilename: string, targetFilename?: string): boolean {
  try {
    const backupPath = path.join(backupDir, backupFilename);

    // Check if backup file exists
    if (!fs.existsSync(backupPath)) {
      console.error(`Backup file does not exist: ${backupPath}`);
      return false;
    }

    // Determine target filename if not provided
    if (!targetFilename) {
      // Extract original filename from backup (remove timestamp)
      const match = backupFilename.match(/^([^_]+)/);
      if (!match) {
        console.error(`Could not determine original filename from backup: ${backupFilename}`);
        return false;
      }
      targetFilename = `${match[1]}.json`;
    }

    const targetPath = path.join(dataDir, targetFilename);

    // Copy the file
    fs.copyFileSync(backupPath, targetPath);
    console.log(`Restored from backup: ${targetPath}`);

    // Update the backup timestamp to reflect this restore
    updateBackupTimestamp(targetFilename);

    return true;
  } catch (error) {
    console.error(`Error restoring from backup ${backupFilename}:`, error);
    return false;
  }
}

/**
 * Lists all available backups
 * @param originalFilename Optional filter to only list backups for a specific file
 * @returns Array of backup filenames
 */
export function listBackups(originalFilename?: string): string[] {
  try {
    if (!fs.existsSync(backupDir)) {
      return [];
    }

    let backups = fs.readdirSync(backupDir)
      .filter(file => path.extname(file).toLowerCase() === '.json');

    // Filter by original filename if provided
    if (originalFilename) {
      const prefix = path.parse(originalFilename).name;
      backups = backups.filter(file => file.startsWith(`${prefix}_`));
    }

    return backups;
  } catch (error) {
    console.error('Error listing backups:', error);
    return [];
  }
}

/**
 * Cleans up old backups, keeping only the most recent ones
 * @param maxBackupsPerFile Maximum number of backups to keep per file
 * @returns boolean indicating success or failure
 */
export function cleanupOldBackups(maxBackupsPerFile: number = 5): boolean {
  try {
    if (!fs.existsSync(backupDir)) {
      return true; // Nothing to clean up
    }

    // Get all JSON files in the data directory
    const dataFiles = fs.readdirSync(dataDir)
      .filter(file => path.extname(file).toLowerCase() === '.json')
      .filter(file => file !== path.basename(backupConfigPath))
      .map(file => path.parse(file).name);

    let allSuccessful = true;

    // Process each original file
    for (const baseFilename of dataFiles) {
      // Get all backups for this file
      const backups = listBackups(`${baseFilename}.json`);

      // Sort backups by timestamp (newest first)
      backups.sort((a, b) => {
        // Extract timestamps from filenames
        const timestampA = a.match(/_(.+)\.json$/)?.[1] || '';
        const timestampB = b.match(/_(.+)\.json$/)?.[1] || '';
        // Compare timestamps (reverse order for newest first)
        return timestampB.localeCompare(timestampA);
      });

      // Delete older backups beyond the maximum
      if (backups.length > maxBackupsPerFile) {
        const backupsToDelete = backups.slice(maxBackupsPerFile);

        for (const backupFile of backupsToDelete) {
          try {
            const backupPath = path.join(backupDir, backupFile);
            fs.unlinkSync(backupPath);
            console.log(`Deleted old backup: ${backupPath}`);
          } catch (deleteError) {
            console.error(`Error deleting backup ${backupFile}:`, deleteError);
            allSuccessful = false;
          }
        }
      }
    }

    return allSuccessful;
  } catch (error) {
    console.error('Error cleaning up old backups:', error);
    return false;
  }
}

/**
 * Gets the last backup timestamp for a file
 * @param filename The name of the file to check
 * @returns The timestamp as a string, or null if no backup exists
 */
export function getLastBackupTime(filename: string): string | null {
  const config = readBackupConfig();
  return config.lastBackups[filename] || null;
}

// Export the backup directory path
export const BACKUP_DIR = backupDir;
