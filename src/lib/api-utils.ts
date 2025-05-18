/**
 * Utility functions for API calls and path handling
 */

/**
 * Get the base API URL with proper path handling
 * This helps when the app is deployed to different environments
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // In development or when running locally
  if (process.env.NODE_ENV === 'development') {
    return `/api/${cleanEndpoint}`;
  }
  
  // In production, use the absolute URL if needed
  // This can be customized based on your deployment setup
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}/api/${cleanEndpoint}`;
}

/**
 * Enhanced fetch function with proper error handling and path resolution
 */
export async function fetchApi<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Try to parse error message from response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}
