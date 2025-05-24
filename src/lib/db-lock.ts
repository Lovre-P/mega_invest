import fs from 'fs';
import path from 'path';

// Simple file locking mechanism for JSON data files
class FileLock {
  private lockMap: Map<string, boolean> = new Map();
  private lockQueue: Map<string, Array<() => void>> = new Map();
  private lockTimeout: number = 10000; // 10 seconds timeout

  // Acquire a lock for a file
  async acquireLock(filePath: string): Promise<boolean> {
    const normalizedPath = path.normalize(filePath);
    
    // If the file is already locked, add to queue
    if (this.lockMap.get(normalizedPath)) {
      return new Promise((resolve) => {
        // Add to queue
        if (!this.lockQueue.has(normalizedPath)) {
          this.lockQueue.set(normalizedPath, []);
        }
        
        const queue = this.lockQueue.get(normalizedPath)!;
        
        // Add timeout to prevent deadlocks
        const timeoutId = setTimeout(() => {
          const index = queue.indexOf(onLockReleased);
          if (index !== -1) {
            queue.splice(index, 1);
          }
          resolve(false);
        }, this.lockTimeout);
        
        const onLockReleased = () => {
          clearTimeout(timeoutId);
          this.lockMap.set(normalizedPath, true);
          resolve(true);
        };
        
        queue.push(onLockReleased);
      });
    }
    
    // Lock the file
    this.lockMap.set(normalizedPath, true);
    return true;
  }

  // Release a lock for a file
  releaseLock(filePath: string): void {
    const normalizedPath = path.normalize(filePath);
    this.lockMap.set(normalizedPath, false);
    
    // Process queue
    const queue = this.lockQueue.get(normalizedPath);
    if (queue && queue.length > 0) {
      const nextInQueue = queue.shift();
      if (nextInQueue) {
        nextInQueue();
      }
    }
  }

  // Check if a file is locked
  isLocked(filePath: string): boolean {
    const normalizedPath = path.normalize(filePath);
    return !!this.lockMap.get(normalizedPath);
  }
}

// Singleton instance
const fileLock = new FileLock();

// Helper functions for reading and writing JSON data with locking
export async function readJSONWithLock<T>(filePath: string): Promise<T | null> {
  const lockAcquired = await fileLock.acquireLock(filePath);
  if (!lockAcquired) {
    console.error(`Failed to acquire lock for reading ${filePath}`);
    return null;
  }

  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return null;
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading file from ${filePath}:`, error);
    return null;
  } finally {
    fileLock.releaseLock(filePath);
  }
}

export async function writeJSONWithLock<T>(filePath: string, data: T): Promise<boolean> {
  try {
    // Acquire lock
    const lockAcquired = await fileLock.acquireLock(filePath);
    if (!lockAcquired) {
      console.error(`Failed to acquire lock for ${filePath}`);
      return false;
    }
    
    try {
      // Create a backup before writing
      if (fs.existsSync(filePath)) {
        const backupPath = `${filePath}.bak`;
        fs.copyFileSync(filePath, backupPath);
      }
      
      // Write the file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } finally {
      // Always release the lock
      fileLock.releaseLock(filePath);
    }
  } catch (error) {
    console.error(`Error writing file to ${filePath}:`, error);
    return false;
  }
}

export default fileLock;
