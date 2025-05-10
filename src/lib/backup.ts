import fs from 'fs';
import path from 'path';

// Define the paths to our JSON files
const dataDir = path.join(process.cwd(), 'src/data');
const backupDir = path.join(process.cwd(), 'src/data/backups');

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

/**
 * Creates a backup of a specific JSON data file
 * @param filename The name of the file to backup (e.g., 'investments.json')
 * @returns boolean indicating success or failure
 */
export function backupFile(filename: string): boolean {
  try {
    const sourcePath = path.join(dataDir, filename);
    
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.error(`Source file does not exist: ${sourcePath}`);
      return false;
    }
    
    // Create timestamp for backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `${path.parse(filename).name}_${timestamp}${path.parse(filename).ext}`;
    const backupPath = path.join(backupDir, backupFilename);
    
    // Copy the file
    fs.copyFileSync(sourcePath, backupPath);
    console.log(`Backup created: ${backupPath}`);
    
    return true;
  } catch (error) {
    console.error(`Error creating backup for ${filename}:`, error);
    return false;
  }
}

/**
 * Creates backups of all JSON data files
 * @returns boolean indicating success or failure
 */
export function backupAllFiles(): boolean {
  try {
    // Get all JSON files in the data directory
    const files = fs.readdirSync(dataDir)
      .filter(file => path.extname(file).toLowerCase() === '.json');
    
    if (files.length === 0) {
      console.warn('No JSON files found to backup');
      return false;
    }
    
    // Backup each file
    let allSuccessful = true;
    for (const file of files) {
      const success = backupFile(file);
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
    
    return true;
  } catch (error) {
    console.error(`Error restoring from backup ${backupFilename}:`, error);
    return false;
  }
}

/**
 * Lists all available backups
 * @returns Array of backup filenames
 */
export function listBackups(): string[] {
  try {
    if (!fs.existsSync(backupDir)) {
      return [];
    }
    
    return fs.readdirSync(backupDir)
      .filter(file => path.extname(file).toLowerCase() === '.json');
  } catch (error) {
    console.error('Error listing backups:', error);
    return [];
  }
}

// Export the backup directory path
export const BACKUP_DIR = backupDir;
