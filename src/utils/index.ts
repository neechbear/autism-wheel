// Utility functions for the application

/**
 * Checks if the application is running in locked HTML mode
 * by looking for the autism-wheel-locked-html-mode meta tag
 */
export function isLockedHtmlMode(): boolean {
  const metaTag = document.querySelector('meta[name="autism-wheel-locked-html-mode"]');
  return metaTag?.getAttribute('content') === 'true';
}

/**
 * Checks if the application is loaded from a file:// URL scheme
 * @returns true if loaded from file:// (offline context), false otherwise
 */
export function isFileScheme(): boolean {
  return window.location.protocol === 'file:';
}

/**
 * Attempts to load state from the autism-wheel-state meta tag
 * @returns encoded state string or null if not found/invalid
 */
export function getStateFromMetaTag(): string | null {
  try {
    const metaTag = document.querySelector('meta[name="autism-wheel-state"]');
    if (!metaTag) {
      return null;
    }
    
    const content = metaTag.getAttribute('content');
    if (!content || content.trim() === '') {
      return null;
    }
    
    return content.trim();
  } catch (error) {
    console.warn('Failed to read state from meta tag:', error);
    return null;
  }
}

/**
 * Gets tooltip configuration from URL parameters
 * @returns Object with disabled state and delay duration
 */
export function getTooltipConfig(): { disabled: boolean; delayDuration: number } {
  const urlParams = new URLSearchParams(window.location.search);
  const tooltipWaitMs = urlParams.get('tooltipwaitms');

  if (tooltipWaitMs === null) {
    // Default behavior: 700ms delay (Radix UI default)
    return { disabled: false, delayDuration: 700 };
  }

  const waitMs = parseInt(tooltipWaitMs, 10);

  if (waitMs === -1) {
    // Disable tooltips completely
    return { disabled: true, delayDuration: 0 };
  }

  if (waitMs >= 0) {
    // Use specified delay (0 for instant, >0 for delay)
    return { disabled: false, delayDuration: waitMs };
  }

  // Invalid value, use default
  return { disabled: false, delayDuration: 700 };
}