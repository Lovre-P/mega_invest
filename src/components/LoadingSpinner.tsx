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
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16',
  }[size];

  const textSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl',
  }[size];

  // Create the spinner element
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Main spinner */}
        <div
          className={`${sizeClass} modern-spinner`}
          role="status"
          aria-label="Loading"
        />
        {/* Inner glow effect */}
        <div
          className={`${sizeClass} absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse`}
        />
      </div>
      {text && (
        <p className={`text-slate-600 font-medium ${textSizeClass} animate-pulse text-center`}>
          {text}
        </p>
      )}
    </div>
  );

  // If fullScreen is true, center the spinner on the screen
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center glass z-50">
        <div className="glass-card p-8 rounded-2xl">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}
