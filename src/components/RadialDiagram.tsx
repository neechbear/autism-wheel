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

// Radial diagram component - the core SVG wheel visualization
// Follows Single Responsibility Principle - only handles diagram rendering and interactions

import React, { useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useAppContext } from '../state/AppContext';
import type { ConditionalTooltipProps } from '../types';
import { TOTAL_RINGS, CENTER_X, CENTER_Y, MIN_RADIUS, RING_WIDTH, MAX_RADIUS } from '../types';
import { ASD_LABELS } from '../constants/defaults';

// Conditional Tooltip wrapper component
function ConditionalTooltip({ children, content, disabled = false, delayDuration }: ConditionalTooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-diagram-half">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Helper function to darken a hex color
const darkenColor = (hexColor: string, amount: number = 0.3): string => {
  // Remove the # if present
  const color = hexColor.replace('#', '');

  // Parse the RGB values
  const num = parseInt(color, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  // Darken each component
  const darkenedR = Math.floor(r * (1 - amount));
  const darkenedG = Math.floor(g * (1 - amount));
  const darkenedB = Math.floor(b * (1 - amount));

  // Convert back to hex
  return `#${((darkenedR << 16) | (darkenedG << 8) | darkenedB).toString(16).padStart(6, '0')}`;
};

// Helper function to get support needs text
const getSupportNeedsText = (number: number): string => {
  if (number >= 1 && number <= 4) return "Occasional Support Needs";
  if (number >= 5 && number <= 7) return "Frequent Support Needs";
  if (number >= 8 && number <= 10) return "Consistent Support Needs";
  return "";
};

type RadialDiagramProps = {
  onSegmentClick: (sliceIndex: number, ringIndex: number) => void;
  tooltipsDisabled?: boolean;
  tooltipDelay?: number;
};

function RadialDiagram({ onSegmentClick, tooltipsDisabled = false, tooltipDelay = 1000 }: RadialDiagramProps): JSX.Element {
  const { state } = useAppContext();
  const { categories, profile, settings } = state;
  const svgRef = useRef<SVGSVGElement>(null);

  // Extract slice data from categories
  const sliceLabels = categories.map(cat => cat.name);
  const sliceColors = categories.map(cat => cat.color);
  const sliceIcons = categories.map(cat => cat.icon);
  const sliceDescriptions = categories.map(cat => cat.description);
  const selections = profile.selections;

  // Theme detection
  const isDarkMode = settings.theme === 'dark' ||
    (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Create segment path function
  const createSegmentPath = (sliceIndex: number, ringIndex: number): string => {
    if (sliceLabels.length === 0) {
      return '';
    }
    const angleStep = (2 * Math.PI) / sliceLabels.length;
    const startAngle = sliceIndex * angleStep - Math.PI / 2; // Start from top
    const endAngle = startAngle + angleStep;

    const innerRadius = MIN_RADIUS + ringIndex * RING_WIDTH;
    const outerRadius = MIN_RADIUS + (ringIndex + 1) * RING_WIDTH;

    const x1 = CENTER_X + innerRadius * Math.cos(startAngle);
    const y1 = CENTER_Y + innerRadius * Math.sin(startAngle);
    const x2 = CENTER_X + outerRadius * Math.cos(startAngle);
    const y2 = CENTER_Y + outerRadius * Math.sin(startAngle);

    const x3 = CENTER_X + outerRadius * Math.cos(endAngle);
    const y3 = CENTER_Y + outerRadius * Math.sin(endAngle);
    const x4 = CENTER_X + innerRadius * Math.cos(endAngle);
    const y4 = CENTER_Y + innerRadius * Math.sin(endAngle);

    const largeArcFlag = angleStep > Math.PI ? 1 : 0;

    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
      Z
    `;
  };

  // Get label position function
  const getLabelPosition = (sliceIndex: number) => {
    if (sliceLabels.length === 0) {
      return { x: 0, y: 0, angle: 0 };
    }
    const angleStep = (2 * Math.PI) / sliceLabels.length;
    const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep / 2; // Center of slice
    const labelRadius = MAX_RADIUS + 30;

    const x = CENTER_X + labelRadius * Math.cos(angle);
    const y = CENTER_Y + labelRadius * Math.sin(angle);

    return { x, y, angle };
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <svg
        ref={svgRef}
        width="750"
        height="750"
        viewBox="0 0 750 750"
        className="overflow-visible"
        style={{ background: 'transparent' }}
      >
        {/* Light segments - drawn first, on bottom */}
        {sliceLabels.length > 0 && Array.from({ length: sliceLabels.length }, (_, sliceIndex) =>
          Array.from({ length: TOTAL_RINGS }, (_, ringIndex) => {
            const currentSelections = selections[sliceIndex] || [];
            const segmentNumber = ringIndex + 1;

            // Only render light segments for two-selection ranges
            if (currentSelections.length === 2) {
              const [first, second] = currentSelections.sort((a: number, b: number) => a - b);
              if (segmentNumber > first && segmentNumber <= second) {
                const baseColor = sliceColors[sliceIndex];
                const fill = baseColor + '80'; // Add 50% opacity
                const path = createSegmentPath(sliceIndex, ringIndex);

                return (
                  <ConditionalTooltip
                    key={`light-segment-${sliceIndex}-${ringIndex}`}
                    disabled={tooltipsDisabled}
                    delayDuration={tooltipDelay}
                    content={
                      <div className="space-y-1">
                        <div className="font-medium">{sliceLabels[sliceIndex]}</div>
                        <div className="text-sm text-muted-foreground">
                          Impact {ringIndex + 1}/10 - {getSupportNeedsText(ringIndex + 1)}
                        </div>
                        {sliceDescriptions[sliceIndex] && (
                          <div className="text-sm text-muted-foreground">
                            {sliceDescriptions[sliceIndex]}
                          </div>
                        )}
                      </div>
                    }
                  >
                    <path
                      d={path}
                      fill={fill}
                      stroke={isDarkMode ? "#393939ff" : "white"}
                      strokeWidth="1"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onSegmentClick(sliceIndex, ringIndex)}
                      data-testid={`segment-${sliceIndex}-${ringIndex}`}
                    />
                  </ConditionalTooltip>
                );
              }
            }
            return null;
          })
        )}

        {/* Dark segments and unselected segments - drawn second, still behind all grid lines */}
        {sliceLabels.length > 0 && Array.from({ length: sliceLabels.length }, (_, sliceIndex) =>
          Array.from({ length: TOTAL_RINGS }, (_, ringIndex) => {
            const currentSelections = selections[sliceIndex] || [];
            const segmentNumber = ringIndex + 1;
            const baseColor = sliceColors[sliceIndex];

            let fill = 'rgba(0, 0, 0, 0.05)'; // default unselected
            let shouldRender = true;

            if (currentSelections.length === 0) {
              fill = 'rgba(0, 0, 0, 0.05)';
            } else if (currentSelections.length === 1) {
              const selectedSegment = currentSelections[0];
              if (segmentNumber <= selectedSegment) {
                fill = baseColor; // Dark segment
              } else {
                fill = 'rgba(0, 0, 0, 0.05)'; // Unselected
              }
            } else if (currentSelections.length === 2) {
              const [first, second] = currentSelections.sort((a: number, b: number) => a - b);
              if (segmentNumber <= first) {
                fill = baseColor; // Dark segment
              } else if (segmentNumber <= second) {
                // Light segment - don't render here as it's already rendered above
                shouldRender = false;
              } else {
                fill = 'rgba(0, 0, 0, 0.05)'; // Unselected
              }
            }

            if (!shouldRender) return null;

            const path = createSegmentPath(sliceIndex, ringIndex);

            return (
              <ConditionalTooltip
                key={`segment-${sliceIndex}-${ringIndex}`}
                disabled={tooltipsDisabled}
                delayDuration={tooltipDelay}
                content={
                  <div className="space-y-1">
                    <div className="font-medium">{sliceLabels[sliceIndex]}</div>
                    <div className="text-sm text-muted-foreground">
                      Impact {ringIndex + 1}/10 - {getSupportNeedsText(ringIndex + 1)}
                    </div>
                    {sliceDescriptions[sliceIndex] && (
                      <div className="text-sm text-muted-foreground">
                        {sliceDescriptions[sliceIndex]}
                      </div>
                    )}
                  </div>
                }
              >
                <path
                  d={path}
                  fill={fill}
                  stroke={isDarkMode ? "#393939ff" : "white"}
                  strokeWidth="1"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => onSegmentClick(sliceIndex, ringIndex)}
                  data-testid={`segment-${sliceIndex}-${ringIndex}`}
                />
              </ConditionalTooltip>
            );
          })
        )}

        {/* Grid lines - drawn on top of segments */}
        {/* Radial grid lines (spokes) */}
        {sliceLabels.length > 0 && Array.from({ length: sliceLabels.length }, (_, i) => {
          const angle = (i * 2 * Math.PI) / sliceLabels.length - Math.PI / 2;
          const x1 = CENTER_X + MIN_RADIUS * Math.cos(angle);
          const y1 = CENTER_Y + MIN_RADIUS * Math.sin(angle);
          const x2 = CENTER_X + MAX_RADIUS * Math.cos(angle);
          const y2 = CENTER_Y + MAX_RADIUS * Math.sin(angle);

          return (
            <line
              key={`spoke-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isDarkMode ? "#393939ff" : "white"}
              strokeWidth={settings.boundaryWeight === 'bold' ? "2" : "1"}
            />
          );
        })}

        {/* Center radial grid lines (spokes in the emoji area) */}
        {sliceLabels.length > 0 && Array.from({ length: sliceLabels.length }, (_, i) => {
          const angle = (i * 2 * Math.PI) / sliceLabels.length - Math.PI / 2;
          const x1 = CENTER_X;
          const y1 = CENTER_Y;
          const x2 = CENTER_X + MIN_RADIUS * Math.cos(angle);
          const y2 = CENTER_Y + MIN_RADIUS * Math.sin(angle);

          return (
            <line
              key={`center-spoke-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"}
              strokeWidth={settings.boundaryWeight === 'bold' ? "2" : "1"}
            />
          );
        })}

        {/* Concentric circles */}
        {Array.from({ length: TOTAL_RINGS + 1 }, (_, i) => {
          const radius = MIN_RADIUS + i * RING_WIDTH;
          return (
            <circle
              key={`circle-${i}`}
              cx={CENTER_X}
              cy={CENTER_Y}
              r={radius}
              fill="none"
              stroke={isDarkMode ? "#393939ff" : "white"}
              strokeWidth={settings.boundaryWeight === 'bold' ? "2" : "1"}
            />
          );
        })}

        {/* ASD boundary lines and labels */}
        {settings.numberPosition !== 'hide_all' && ASD_LABELS.map((label, index) => {
          // Calculate the center radius for each ASD level
          let centerRadius;
          if (label.text === "ASD-1") {
            // Centered between segment 1 and 4: (MIN_RADIUS + (MIN_RADIUS + 4*RING_WIDTH)) / 2
            centerRadius = (MIN_RADIUS + (MIN_RADIUS + 4 * RING_WIDTH)) / 2;
          } else if (label.text === "ASD-2") {
            // Centered between segment 5 and 7: ((MIN_RADIUS + 4*RING_WIDTH) + (MIN_RADIUS + 7*RING_WIDTH)) / 2
            centerRadius = ((MIN_RADIUS + 4 * RING_WIDTH) + (MIN_RADIUS + 7 * RING_WIDTH)) / 2;
          } else if (label.text === "ASD-3") {
            // Centered between segment 8 and 10: ((MIN_RADIUS + 7*RING_WIDTH) + MAX_RADIUS) / 2
            centerRadius = ((MIN_RADIUS + 7 * RING_WIDTH) + MAX_RADIUS) / 2;
          } else {
            // Default fallback
            centerRadius = label.radius;
          }

          return (
            <g key={`asd-${index}`}>
              {/* ASD boundary circle - only show for ASD-2 and ASD-3 */}
              {(label.text === "ASD-2" || label.text === "ASD-3") && (
                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r={label.radius}
                  fill="none"
                  stroke={isDarkMode ? "#e5e7eb" : "#6b7280"}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
              {/* ASD label positioned on top vertical line, rotated 90 degrees anticlockwise */}
              <text
                x={CENTER_X}
                y={CENTER_Y - centerRadius}
                fontSize="13"
                fill={isDarkMode ? "#9ca3af" : "#6b7280"}
                stroke={isDarkMode ? "#1f1f1f" : "#ffffff"}
                strokeWidth="3"
                paintOrder="stroke"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(-90, ${CENTER_X}, ${CENTER_Y - centerRadius})`}
                style={{
                  fontWeight: 'bold'
                }}
              >
                {label.text}
              </text>
            </g>
          );
        })}

        {/* Selection numbers */}
        {settings.numberPosition !== 'hide_segment' && settings.numberPosition !== 'hide_all' &&
          sliceLabels.length > 0 &&
          Object.entries(selections).map(([sliceIndexStr, selectionArray]) => {
            const sliceIndex = parseInt(sliceIndexStr);
            if (sliceLabels.length === 0 || !Array.isArray(selectionArray) || selectionArray.length === 0 ||
                isNaN(sliceIndex) || sliceIndex < 0 || sliceIndex >= sliceLabels.length) {
              return null;
            }
            return selectionArray.map((selectionNumber: number, index: number) => {
              if (typeof selectionNumber !== 'number' || isNaN(selectionNumber) || sliceLabels.length === 0) {
                return null;
              }
              const ringIndex = selectionNumber - 1; // Convert back to 0-based

              // Calculate angle based on position setting
              const angleStep = (2 * Math.PI) / sliceLabels.length;
              let positionFactor: number;

              switch (settings.numberPosition) {
                case 'left':
                  positionFactor = 0.25; // Left side of segment
                  break;
                case 'center':
                  positionFactor = 0.5; // Center of segment
                  break;
                case 'right':
                  positionFactor = 0.75; // Right side of segment
                  break;
                default:
                  positionFactor = 0.5; // Default to center
                  break;
              }

              const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep * positionFactor;
              const radius = MIN_RADIUS + (ringIndex + 0.5) * RING_WIDTH;
              const x = CENTER_X + radius * Math.cos(angle);
              const y = CENTER_Y + radius * Math.sin(angle);

              // Determine text color based on selection type
              let textColor = 'white';
              const baseColor = sliceColors[sliceIndex];
              const currentSelections = selectionArray;

              if (currentSelections.length === 1) {
                // Single selection, always use white on dark color
                textColor = 'white';
              } else if (currentSelections.length === 2) {
                if (index === 0) {
                  // This is the first selection, in the dark color
                  textColor = 'white';
                } else {
                  // This is the second selection, in the light color range
                  // Since the light color is baseColor + '80' (50% opacity), we darken the base color less
                  textColor = darkenColor(baseColor, 0.15);
                }
              }

              return (
                <text
                  key={`selection-number-${sliceIndex}-${selectionNumber}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm pointer-events-none"
                  style={{
                    fontWeight: 'bold',
                    fill: textColor
                  }}
                >
                  {selectionNumber}
                </text>
              );
            });
          })
        }

        {/* Labels as SVG text */}
        {settings.labelStyle !== 'hidden' && sliceLabels.length > 0 && sliceLabels.map((label, sliceIndex) => {
          if (sliceLabels.length === 0) return null;
          const { x, y, angle } = getLabelPosition(sliceIndex);
          const rotation = angle * (180 / Math.PI);
          const shouldFlip = rotation > 90 && rotation < 270;
          const finalRotation = shouldFlip ? rotation + 180 : rotation;

          // Wrap long labels into multiple lines
          const lines: string[] = [];
          const words = label.split(' ');
          let currentLine = '';
          const maxLineLength = 18; // Max characters per line

          for (const word of words) {
            // If adding the new word exceeds the max length, push the current line and start a new one
            if (currentLine.length + word.length + 1 > maxLineLength && currentLine.length > 0) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              // Otherwise, add the word to the current line
              if (currentLine.length === 0) {
                currentLine = word;
              } else {
                currentLine += ` ${word}`;
              }
            }
          }
          // Add the last line
          lines.push(currentLine);

          const textOutlineProps = settings.labelStyle === 'bold'
            ? {
                stroke: isDarkMode ? '#1f1f1f' : '#ffffff',
                strokeWidth: 4,
                paintOrder: 'stroke' as const,
              }
            : {};

          return (
            <ConditionalTooltip
              key={`label-tooltip-${sliceIndex}`}
              disabled={tooltipsDisabled}
              delayDuration={tooltipDelay}
              content={
                <div className="space-y-1">
                  <div className="font-medium">{sliceLabels[sliceIndex]}</div>
                  {sliceDescriptions[sliceIndex] && (
                    <div className="text-sm text-muted-foreground">
                      {sliceDescriptions[sliceIndex]}
                    </div>
                  )}
                </div>
              }
            >
              <g
                key={`label-${sliceIndex}`}
                className="cursor-pointer"
                transform={`translate(${x}, ${y}) rotate(${finalRotation})`}
                style={{ pointerEvents: 'auto' }} // Enable pointer events for labels
              >
                {lines.map((line, lineIndex) => (
                  <text
                    key={`label-line-${sliceIndex}-${lineIndex}`}
                    x={0}
                    y={0 + (lineIndex - (lines.length - 1) / 2) * 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                    fill={isDarkMode ? "#9ca3af" : "#374151"}
                    {...textOutlineProps}
                    style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: settings.labelStyle === 'bold' ? 'bold' : 'normal',
                      pointerEvents: 'auto', // Enable pointer events for text
                    }}
                  >
                    {line}
                  </text>
                ))}
              </g>
            </ConditionalTooltip>
          );
        })}

        {/* Icons in center ring */}
        {settings.showIcons && sliceLabels.length > 0 && sliceIcons.map((icon, sliceIndex) => {
          const angleStep = (2 * Math.PI) / sliceLabels.length;
          const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep / 2; // Center of slice

          // Dynamic sizing and positioning based on number of categories
          const numCategories = sliceLabels.length;

          // Calculate dynamic font size: 36 for 2 categories, 18 for 10 categories, linear interpolation between
          const minFontSize = 18; // 10 categories
          const maxFontSize = 36; // 2 categories
          const fontSize = Math.round(maxFontSize - ((numCategories - 2) / (10 - 2)) * (maxFontSize - minFontSize));

          // Calculate dynamic radius: slightly closer for fewer categories
          // 0.5 for 2 categories, 0.75 for 10 categories
          const minRadiusMultiplier = 0.5; // 2 categories (closer to center)
          const maxRadiusMultiplier = 0.75;  // 10 categories (moved further out)
          const radiusMultiplier = minRadiusMultiplier + ((numCategories - 2) / (10 - 2)) * (maxRadiusMultiplier - minRadiusMultiplier);

          const iconRadius = MIN_RADIUS * radiusMultiplier;
          const iconX = CENTER_X + iconRadius * Math.cos(angle);
          // Apply a larger downward adjustment to compensate for emoji baseline issues
          // Based on observation that emojis appear too high by about the width of a radial line
          const verticalOffset = fontSize * 0.15; // 15% of font size downward adjustment
          const iconY = CENTER_Y + iconRadius * Math.sin(angle) + verticalOffset;

          return (
            <text
              key={`icon-${sliceIndex}`}
              x={iconX}
              y={iconY}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={fontSize}
              style={{
                pointerEvents: 'none',
                alignmentBaseline: 'middle'
              }}
            >
              {icon}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default RadialDiagram;