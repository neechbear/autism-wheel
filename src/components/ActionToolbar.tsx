// Action toolbar component following Single Responsibility Principle
// Handles primary action buttons like print, copy link, save

import { Printer, Download, ChevronDown, Link, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAppContext, appActions } from '../state/AppContext';
import { encodeState } from '../state/migrations';
import styles from './ActionToolbar.module.css';

function ActionToolbar(): JSX.Element {
  const { state, dispatch } = useAppContext();

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
    const svgElement = document.querySelector('svg');
    if (!svgElement) {
      alert('Unable to find diagram. Please try again.');
      return;
    }

    try {
      // Clone and enhance the SVG for better export quality
      const svgClone = svgElement.cloneNode(true) as SVGElement;

      // Get current theme background color
      const currentBackgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--background').trim();

      // Add background rect to SVG for themed exports
      const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      backgroundRect.setAttribute('width', '100%');
      backgroundRect.setAttribute('height', '100%');
      backgroundRect.setAttribute('fill', currentBackgroundColor || '#F9F9F9');
      svgClone.insertBefore(backgroundRect, svgClone.firstChild);

      // Add font definitions for better rendering in external applications
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = `
        text {
          font-family: "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif !important;
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
        link.download = 'autism-wheel.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }

      if (format === 'html') {
        // Save current page as HTML
        const htmlContent = document.documentElement.outerHTML;
        const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(htmlBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'autism-wheel.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }

      if (format === 'locked_html') {
        // Save as locked HTML with meta tag
        let htmlContent = document.documentElement.outerHTML;
        // Add the locked mode meta tag
        htmlContent = htmlContent.replace(
          '<head>',
          '<head>\n<meta name="autism-wheel-locked-html-mode" content="true">'
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
        return;
      }

      // For PNG and JPEG, convert SVG to canvas with high resolution
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      // Increase resolution for better quality (2x scale)
      const scale = 2;
      const baseSize = 750;

      img.onload = () => {
        canvas.width = baseSize * scale;
        canvas.height = baseSize * scale;

        // Scale the context to maintain high resolution
        ctx!.scale(scale, scale);

        // Use theme-appropriate background color
        const bgColor = currentBackgroundColor || (format === 'jpeg' ? '#ffffff' : '#F9F9F9');
        ctx!.fillStyle = bgColor;
        ctx!.fillRect(0, 0, baseSize, baseSize);

        // Enable high-quality rendering
        ctx!.imageSmoothingEnabled = true;
        ctx!.imageSmoothingQuality = 'high';

        ctx!.drawImage(img, 0, 0, baseSize, baseSize);

        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'jpeg' ? 0.95 : undefined; // High quality for JPEG

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `autism-wheel.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, mimeType, quality);
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
        className={`${styles.button} ${styles.primaryButton}`}
      >
        <Link className={styles.buttonIcon} />
        Copy link
      </Button>

      <Button
        onClick={handlePrint}
        className={`${styles.button} ${styles.primaryButton}`}
      >
        <Printer className={styles.buttonIcon} />
        Print
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger className={`${styles.button} ${styles.primaryButton}`}>
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
          <DropdownMenuItem onClick={() => handleSaveDiagram('html')}>
            Save as HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSaveDiagram('locked_html')}>
            Save as locked HTML
          </DropdownMenuItem>
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