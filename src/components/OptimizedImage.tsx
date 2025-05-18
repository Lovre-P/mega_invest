"use client";

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { getAssetPath } from '@/lib/path-utils';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  /**
   * The source path for the image
   * This will be processed through getAssetPath to ensure correct path resolution
   */
  src: string;
  
  /**
   * Optional fallback image to display if the main image fails to load
   */
  fallbackSrc?: string;
  
  /**
   * Whether to apply a blur effect while the image is loading
   */
  withBlur?: boolean;
}

/**
 * An optimized image component that handles path resolution and loading states
 */
export default function OptimizedImage({
  src,
  fallbackSrc,
  withBlur = false,
  alt,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(getAssetPath(src));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Reset loading state when src changes
  useEffect(() => {
    setImageSrc(getAssetPath(src));
    setIsLoading(true);
    setError(false);
  }, [src]);
  
  // Handle image load error
  const handleError = () => {
    setError(true);
    if (fallbackSrc) {
      setImageSrc(getAssetPath(fallbackSrc));
    }
  };
  
  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  return (
    <div className={`relative ${props.className || ''}`} style={props.style}>
      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        className={`
          ${props.className || ''}
          ${isLoading && withBlur ? 'blur-sm' : ''}
          ${error && !fallbackSrc ? 'opacity-50' : ''}
          transition-all duration-300
        `}
        onError={handleError}
        onLoad={handleLoad}
      />
      
      {isLoading && withBlur && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
        </div>
      )}
      
      {error && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-gray-500">Failed to load image</span>
        </div>
      )}
    </div>
  );
}
