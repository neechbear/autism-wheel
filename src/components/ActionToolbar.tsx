/*
 * ⚠️  IMPORTANT CSS RULES FOR AI AGENTS ⚠️
 *
 * 1. NEVER use CSS !important declarations except for:
 *    - Completely hiding elements (display: none !important)
 *    - Print media styles (for paper printing)
 *
 * 2. NEVER use inline style="" attributes on HTML elements
 *    - All styling MUST be via dedicated CSS files
 *    - Use CSS Modules for component-specific styles
 *    - Use global.css for shared design tokens
 *
 * Violation of these rules is STRICTLY FORBIDDEN.
 */

// Action toolbar component following Single Responsibility Principle
// Handles primary action buttons like print, copy link, save

import { Printer, ChevronDown, Link, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAppContext, appActions } from '../state/AppContext';
import { encodeState } from '../state/MigrateState';
import styles from './ActionToolbar.module.css';
import { useState } from 'react';
import { isLockedHtmlMode } from '../utils';

function ActionToolbar(): JSX.Element {
  const { state, dispatch } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isLocked = isLockedHtmlMode();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    const url = new URL(window.location.href);
    // Use the same compression system as the rest of the application
    const encodedState = encodeState(state);
    url.searchParams.set('state', encodedState);

    try {
      await navigator.clipboard.writeText(url.toString());
      // Show success message
      console.log('Link copied to clipboard:', url.toString());
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link. Please try again.');
    }
  };

  const handleSaveDiagram = (format: string) => {
    // For HTML exports, close dropdown first to prevent capture of open state
    if (format === 'html' || format === 'locked_html') {
      setDropdownOpen(false);
      // Use a longer delay to ensure dropdown is fully closed
      setTimeout(() => {
        handleHtmlExport(format);
      }, 200);
      return;
    }

    // For other formats, proceed with the rest of the logic
    handleNonHtmlExport(format);
  };

  const handleHtmlExport = async (format: string) => {
    // Better approach: Always use clean DOM capture with proper cleanup
    // Close dropdown first
    setDropdownOpen(false);

    // Small delay to ensure dropdown closes
    setTimeout(() => {
      // Scroll to top to ensure clean capture
      window.scrollTo(0, 0);

      // Encode current state to include in the HTML
      const encodedState = encodeState(state);

      // Get the HTML content and clean it thoroughly
      let htmlContent = document.documentElement.outerHTML;

      // Remove development-specific scripts that break in static files
      htmlContent = htmlContent.replace(/<script[^>]*src=".*\/@vite\/client"[^>]*><\/script>/gi, '');
      htmlContent = htmlContent.replace(/<script[^>]*src=".*\/src\/main\.tsx"[^>]*><\/script>/gi, '');

      // Clear any Radix UI portals and dropdowns
      htmlContent = htmlContent.replace(/<div[^>]*data-radix-portal[^>]*>[\s\S]*?<\/div>/gi, '');
      htmlContent = htmlContent.replace(/data-state="open"/gi, 'data-state="closed"');

      // Remove any style elements that contain development-specific CSS
      htmlContent = htmlContent.replace(/<style[^>]*data-vite-dev-id[^>]*>[\s\S]*?<\/style>/gi, '');

      // Add comprehensive initialization script
      const initScript = `
      <script>
        (function() {
          // Comprehensive scroll and interaction fixes
          function fixPage() {
            // Reset scroll
            if (document.body) document.body.scrollTop = 0;
            if (document.documentElement) document.documentElement.scrollTop = 0;

            // Ensure scrolling works
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            document.body.style.height = 'auto';
            document.documentElement.style.height = 'auto';

            // Remove any stuck dropdown states
            const stuckElements = document.querySelectorAll('[data-state="open"]');
            stuckElements.forEach(el => {
              el.setAttribute('data-state', 'closed');
              el.removeAttribute('data-state');
            });

            // Remove any overlay elements that might block interaction
            const overlays = document.querySelectorAll('[data-radix-portal], [data-radix-focus-guard]');
            overlays.forEach(el => el.remove());

            // Force re-layout
            document.body.offsetHeight;
          }

          // Apply fixes immediately and on load
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fixPage);
          } else {
            fixPage();
          }

          window.addEventListener('load', fixPage);

          // Also apply fixes after a short delay to catch any late-loading content
          setTimeout(fixPage, 100);
          setTimeout(fixPage, 500);
        })();
      </script>`;

      if (format === 'html') {
        htmlContent = htmlContent.replace(
          '<head>',
          `<head>\n<meta name="autism-wheel-state" content="${encodedState}">${initScript}`
        );

        const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(htmlBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'autism-wheel.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (format === 'locked_html') {
        htmlContent = htmlContent.replace(
          '<head>',
          `<head>\n<meta name="autism-wheel-locked-html-mode" content="true">\n<meta name="autism-wheel-state" content="${encodedState}">${initScript}`
        );

        const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(htmlBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'autism-wheel-locked.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 300); // Longer delay to ensure cleanup
  };

  const handleNonHtmlExport = (format: string) => {
    // Look for the main radial diagram SVG - it should be the largest one or have specific attributes
    const svgElements = document.querySelectorAll('svg');
    let svgElement: SVGElement | null = null;

    // Find the radial diagram SVG by looking for the one with the correct dimensions or viewBox
    for (const svg of svgElements) {
      const viewBox = svg.getAttribute('viewBox');
      const width = svg.getAttribute('width');
      const height = svg.getAttribute('height');

      // Look for the main diagram SVG (750x750 or similar large dimensions)
      if ((viewBox && viewBox.includes('750')) ||
          (width === '750' && height === '750') ||
          (width && height && parseInt(width) >= 400 && parseInt(height) >= 400)) {
        svgElement = svg;
        break;
      }
    }

    // Fallback: if no large SVG found, get the largest one by area
    if (!svgElement && svgElements.length > 0) {
      let maxArea = 0;
      for (const svg of svgElements) {
        const bbox = svg.getBoundingClientRect();
        const area = bbox.width * bbox.height;
        if (area > maxArea) {
          maxArea = area;
          svgElement = svg;
        }
      }
    }

    if (!svgElement) {
      alert('Unable to find the radial diagram. Please try again.');
      return;
    }

    try {
      // Clone and enhance the SVG for better export quality
      const svgClone = svgElement.cloneNode(true) as SVGElement;

      // Determine background color based on theme mode
      const rootStyles = getComputedStyle(document.documentElement);
      const isDarkMode = document.documentElement.classList.contains('dark') ||
                        document.documentElement.getAttribute('data-theme') === 'dark' ||
                        rootStyles.getPropertyValue('--color-scheme')?.trim() === 'dark';

      const backgroundColorForExport = isDarkMode ? '#000000' : '#ffffff';

      // Ensure proper SVG dimensions and viewBox
      svgClone.setAttribute('width', '750');
      svgClone.setAttribute('height', '750');
      svgClone.setAttribute('viewBox', '0 0 750 750');

      // Add background rect to SVG for themed exports
      const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      backgroundRect.setAttribute('x', '0');
      backgroundRect.setAttribute('y', '0');
      backgroundRect.setAttribute('width', '750');
      backgroundRect.setAttribute('height', '750');
      backgroundRect.setAttribute('fill', backgroundColorForExport);
      svgClone.insertBefore(backgroundRect, svgClone.firstChild);

      // Add font definitions for better rendering in external applications
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = `
        text {
          font-family: "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
        }
      `;
      defs.appendChild(style);
      svgClone.insertBefore(defs, backgroundRect.nextSibling);

      // Ensure all text elements have proper font specification
      const textElements = svgClone.querySelectorAll('text');
      textElements.forEach(textEl => {
        textEl.setAttribute('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif');
      });

      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

      if (format === 'svg') {
        // Direct SVG download
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'autismwheel.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }

      // For PNG and JPEG, convert SVG to canvas with high resolution
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Unable to get canvas context');
      }

      const img = new Image();

      // High resolution settings for crisp images (3x scale for extra quality)
      const scale = 3;
      const baseSize = 750;
      const finalSize = baseSize * scale;

      img.onload = () => {
        canvas.width = finalSize;
        canvas.height = finalSize;

        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fill background with theme color
        ctx.fillStyle = backgroundColorForExport;
        ctx.fillRect(0, 0, finalSize, finalSize);

        // Draw the SVG image at high resolution
        ctx.drawImage(img, 0, 0, finalSize, finalSize);

        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'jpeg' ? 0.95 : undefined; // High quality for JPEG
        const filename = format === 'png' ? 'autismwheel.png' : 'autismwheel.jpg';

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          } else {
            throw new Error('Failed to create image blob');
          }
        }, mimeType, quality);
      };

      img.onerror = () => {
        throw new Error('Failed to load SVG image');
      };

      const svgUrl = URL.createObjectURL(svgBlob);
      img.src = svgUrl;

    } catch (error) {
      console.error('Failed to save diagram:', error);
      alert('Failed to save diagram. Please try again.');
    }
  };

  const handleHelp = () => {
    // Scroll to top when navigating to help
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(appActions.setView('help'));
  };

  return (
    <div className={styles.container}>
      <Button
        onClick={handleCopyLink}
        className={`${styles.button} ${styles.blackButton}`}
      >
        <Link className={styles.buttonIcon} />
        Copy link
      </Button>

      <Button
        onClick={handlePrint}
        className={`${styles.button} ${styles.blackButton}`}
      >
        <Printer className={styles.buttonIcon} />
        Print
      </Button>

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger
          role="button"
          className={`${styles.button} ${styles.blackButton}`}
        >
          Save diagram
          <ChevronDown className={styles.chevronIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSaveDiagram('png')}>
            Save as PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSaveDiagram('svg')}>
            Save as SVG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSaveDiagram('jpeg')}>
            Save as JPEG
          </DropdownMenuItem>
          {!isLocked && (
            <DropdownMenuItem onClick={() => handleSaveDiagram('html')}>
              Save as HTML
            </DropdownMenuItem>
          )}
          {!isLocked && (
            <DropdownMenuItem onClick={() => handleSaveDiagram('locked_html')}>
              Save as locked HTML
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {state.currentView !== 'help' && (
        <Button
          onClick={handleHelp}
          className={`${styles.button} ${styles.greenButton}`}
        >
          <HelpCircle className={styles.buttonIcon} />
          Help
        </Button>
      )}
    </div>
  );
}

export default ActionToolbar;