"use client";

import { useEffect } from 'react';
import { initPathCorrection } from '@/lib/path-correction';

/**
 * Component that initializes path correction when mounted
 * This should be included in the layout component
 */
export default function PathCorrection() {
  useEffect(() => {
    // Initialize path correction
    initPathCorrection();
    
    // Set up a timeout to ensure all dynamic components are loaded
    const timeoutId = setTimeout(() => {
      const { fixNavigationLinks } = require('@/lib/path-correction');
      fixNavigationLinks();
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  
  // This component doesn't render anything
  return null;
}
