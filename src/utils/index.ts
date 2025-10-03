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