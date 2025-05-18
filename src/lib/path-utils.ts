/**
 * Utility functions for handling paths in the application
 */

/**
 * Get the correct path for static assets based on the environment
 * This helps when the app is deployed to different environments or subdirectories
 */
export function getAssetPath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In development or when running locally
  if (process.env.NODE_ENV === 'development') {
    return `/${cleanPath}`;
  }
  
  // In production, use the base path if configured
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}/${cleanPath}`;
}

/**
 * Determine if the current page is active based on the pathname
 * Useful for navigation highlighting
 */
export function isActivePath(currentPath: string, targetPath: string): boolean {
  // Exact match
  if (currentPath === targetPath) {
    return true;
  }
  
  // Check if current path is a subpath of target (for nested routes)
  // But only if the target is not the home page
  if (targetPath !== '/' && currentPath.startsWith(targetPath)) {
    return true;
  }
  
  return false;
}
