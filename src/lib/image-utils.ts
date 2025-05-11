import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseError, ErrorCodes, logError } from './error-handler';

/**
 * Interface for image metadata
 */
export interface ImageMetadata {
  id: string;
  filename: string;
  originalFilename: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

/**
 * Ensures the upload directory exists for a specific investment
 * @param investmentId The ID of the investment
 * @returns The path to the upload directory
 */
export function ensureUploadDir(investmentId: string): string {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', investmentId);
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  return uploadDir;
}

/**
 * Saves an uploaded file to the server
 * @param file The file to save
 * @param investmentId The ID of the investment
 * @returns The metadata of the saved image
 */
export async function saveImage(
  file: File,
  investmentId: string
): Promise<ImageMetadata | null> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds the 5MB limit');
    }
    
    // Generate a unique filename
    const fileExtension = path.extname(file.name);
    const uniqueId = uuidv4();
    const filename = `${uniqueId}${fileExtension}`;
    
    // Ensure the upload directory exists
    const uploadDir = ensureUploadDir(investmentId);
    const filePath = path.join(uploadDir, filename);
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Write the file to disk
    fs.writeFileSync(filePath, buffer);
    
    // Create and return metadata
    const metadata: ImageMetadata = {
      id: uniqueId,
      filename,
      originalFilename: file.name,
      path: `/uploads/${investmentId}/${filename}`,
      size: file.size,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
    };
    
    return metadata;
  } catch (error) {
    const dbError = new DatabaseError(
      `Error saving image for investment ${investmentId}`,
      ErrorCodes.FILE_WRITE_ERROR,
      error as Error
    );
    logError(dbError, { investmentId });
    return null;
  }
}

/**
 * Deletes an image from the server
 * @param investmentId The ID of the investment
 * @param filename The filename of the image to delete
 * @returns True if the image was deleted successfully, false otherwise
 */
export function deleteImage(investmentId: string, filename: string): boolean {
  try {
    const filePath = path.join(process.cwd(), 'public', 'uploads', investmentId, filename);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return false;
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    const dbError = new DatabaseError(
      `Error deleting image ${filename} for investment ${investmentId}`,
      ErrorCodes.FILE_DELETE_ERROR,
      error as Error
    );
    logError(dbError, { investmentId, filename });
    return false;
  }
}

/**
 * Gets all images for an investment
 * @param investmentId The ID of the investment
 * @returns An array of image metadata
 */
export function getInvestmentImages(investmentId: string): string[] {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', investmentId);
    
    // Check if the directory exists
    if (!fs.existsSync(uploadDir)) {
      return [];
    }
    
    // Get all files in the directory
    const files = fs.readdirSync(uploadDir);
    
    // Return the file paths
    return files.map(file => `/uploads/${investmentId}/${file}`);
  } catch (error) {
    const dbError = new DatabaseError(
      `Error getting images for investment ${investmentId}`,
      ErrorCodes.FILE_READ_ERROR,
      error as Error
    );
    logError(dbError, { investmentId });
    return [];
  }
}
