"use client";

/**
 * Utility for correcting paths in client-side JavaScript
 */

/**
 * Detect if the current page is in a subdirectory
 */
export function isInSubdirectory(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check if the pathname has more than one segment
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  return pathSegments.length > 0;
}

/**
 * Get the base path for relative URLs
 */
export function getBasePath(): string {
  if (typeof window === 'undefined') {
    return './';
  }
  
  return isInSubdirectory() ? '../' : './';
}

/**
 * Fix a relative URL based on the current page location
 */
export function fixRelativeUrl(url: string): string {
  if (typeof window === 'undefined') {
    return url;
  }
  
  // If it's an absolute URL or starts with a slash, don't modify it
  if (url.startsWith('http') || url.startsWith('/')) {
    return url;
  }
  
  const basePath = getBasePath();
  return `${basePath}${url}`;
}

/**
 * Fix navigation links based on the current page location
 * This should be called after the page loads
 */
export function fixNavigationLinks(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const isSubdir = isInSubdirectory();
  
  // Only fix links if we're in a subdirectory
  if (isSubdir) {
    // Fix home link
    const homeLinks = [
      document.getElementById('home-link'),
      document.getElementById('footer-home-link')
    ];
    
    homeLinks.forEach(link => {
      if (link && link.getAttribute('href') === '/') {
        link.setAttribute('href', '../');
      }
    });
    
    // Fix other navigation links
    const navLinks = {
      'investments-link': '/investments',
      'about-link': '/about',
      'contact-link': '/contact',
      'admin-link': '/admin',
      'footer-investments-link': '/investments',
      'footer-about-link': '/about',
      'footer-contact-link': '/contact',
      'footer-admin-link': '/admin'
    };
    
    Object.entries(navLinks).forEach(([id, originalHref]) => {
      const link = document.getElementById(id);
      if (link && link.getAttribute('href') === originalHref) {
        link.setAttribute('href', `..${originalHref}`);
      }
    });
  }
}

/**
 * Initialize path correction
 * This should be called once when the app loads
 */
export function initPathCorrection(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Fix navigation links after the page has loaded
  if (document.readyState === 'complete') {
    fixNavigationLinks();
  } else {
    window.addEventListener('load', fixNavigationLinks);
  }
}
