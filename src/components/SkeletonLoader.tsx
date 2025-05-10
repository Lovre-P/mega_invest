import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}

/**
 * A skeleton loader component for a single item
 */
export function Skeleton({ width = 'w-full', height = 'h-4', rounded = true, className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${width} ${height} ${
        rounded ? 'rounded' : ''
      } ${className}`}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  width?: string | string[];
  className?: string;
}

/**
 * A skeleton loader component for text with multiple lines
 */
export function SkeletonText({ lines = 3, width = 'w-full', className = '' }: SkeletonTextProps) {
  // If width is a string, use the same width for all lines
  // If width is an array, use different widths for each line
  const widths = Array.isArray(width) ? width : Array(lines).fill(width);

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={widths[i] || 'w-full'} height="h-4" />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  imageHeight?: string;
  lines?: number;
  className?: string;
}

/**
 * A skeleton loader component for a card with an image and text
 */
export function SkeletonCard({ imageHeight = 'h-48', lines = 3, className = '' }: SkeletonCardProps) {
  return (
    <div className={`overflow-hidden rounded-lg bg-white shadow ${className}`}>
      <Skeleton height={imageHeight} rounded={false} />
      <div className="p-4">
        <Skeleton width="w-3/4" className="mb-4" height="h-6" />
        <SkeletonText lines={lines} width={['w-full', 'w-full', 'w-2/3']} />
      </div>
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  columns?: number;
  className?: string;
}

/**
 * A skeleton loader component for a grid of cards
 */
export function SkeletonGrid({ count = 6, columns = 3, className = '' }: SkeletonGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns as 1 | 2 | 3 | 4] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid gap-6 ${gridClass} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
