import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'black' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
}

/**
 * A reusable loading spinner component
 */
export default function LoadingSpinner({
  size = 'medium',
  color = 'black',
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  // Determine the size of the spinner
  const sizeClass = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-4',
  }[size];

  // Determine the color of the spinner
  const colorClass = {
    black: 'border-black',
    white: 'border-white',
    gray: 'border-gray-400',
  }[color];

  // Create the spinner element
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizeClass} border-t-transparent ${colorClass}`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="mt-2 text-sm font-medium">{text}</p>}
    </div>
  );

  // If fullScreen is true, center the spinner on the screen
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
