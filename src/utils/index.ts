// Utility functions for the application

/**
 * Checks if the application is running in locked HTML mode
 * by looking for the autism-wheel-locked-html-mode meta tag
 */
export function isLockedHtmlMode(): boolean {
  const metaTag = document.querySelector('meta[name="autism-wheel-locked-html-mode"]');
  return metaTag?.getAttribute('content') === 'true';
}