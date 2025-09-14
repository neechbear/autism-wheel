import React, { useState, useRef } from 'react';
import { Button } from './ui/button';

interface Selection {
  [sliceIndex: number]: number[];
}

const TOTAL_RINGS = 10;
const TOTAL_SLICES = 8;
const CENTER_X = 350;
const CENTER_Y = 350;
const MIN_RADIUS = 40;
const MAX_RADIUS = 250;
const RING_WIDTH = (MAX_RADIUS - MIN_RADIUS) / TOTAL_RINGS;

const INITIAL_SLICE_LABELS = [
  'Social Interaction',
  'Communication',
  'Sensory Processing',
  'Repetitive Behaviors and Special Interests',
  'Executive Functioning',
  'Emotional Regulation',
  'Cognitive and Learning Skills',
  'Motor Skills and Physical Development'
];

const INITIAL_SLICE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
];



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

interface DraggableSliceProps {
  sliceIndex: number;
  sliceLabels: string[];
  sliceColors: string[];
  selections: Selection;
  onSegmentClick: (sliceIndex: number, ringIndex: number) => void;
  onSliceMove: (dragIndex: number, hoverIndex: number) => void;
  isDragging: boolean;
  draggedSlice: number | null;
  onMouseDown: (sliceIndex: number, event: React.MouseEvent) => void;
}

function DraggableSlice({ 
  sliceIndex, 
  sliceLabels, 
  sliceColors, 
  selections, 
  onSegmentClick,
  onSliceMove,
  isDragging,
  draggedSlice,
  onMouseDown
}: DraggableSliceProps) {

  const createSegmentPath = (ringIndex: number) => {
    const angleStep = (2 * Math.PI) / TOTAL_SLICES;
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

  const getSegmentFill = (ringIndex: number) => {
    const currentSelections = selections[sliceIndex] || [];
    const segmentNumber = ringIndex + 1;
    const baseColor = sliceColors[sliceIndex];
    
    if (currentSelections.length === 0) {
      return 'rgba(0, 0, 0, 0.05)';
    }
    
    if (currentSelections.length === 1) {
      const selectedSegment = currentSelections[0];
      if (segmentNumber <= selectedSegment) {
        return baseColor;
      }
    } else if (currentSelections.length === 2) {
      const [first, second] = currentSelections;
      if (segmentNumber <= first) {
        return baseColor;
      } else if (segmentNumber <= second) {
        // Lighter shade for the second range
        return baseColor + '80'; // 50% opacity
      }
    }
    
    return 'rgba(0, 0, 0, 0.05)';
  };

  const isCurrentlyDragging = isDragging && draggedSlice === sliceIndex;
  const isDropTarget = isDragging && draggedSlice !== null && draggedSlice !== sliceIndex;

  return (
    <g
      style={{ 
        opacity: isCurrentlyDragging ? 0.5 : 1,
        filter: isDropTarget ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' : 'none',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={(e) => onMouseDown(sliceIndex, e)}
    >
      {/* Segments */}
      {Array.from({ length: TOTAL_RINGS }, (_, ringIndex) => {
        const path = createSegmentPath(ringIndex);
        const fill = getSegmentFill(ringIndex);
        
        return (
          <path
            key={`segment-${sliceIndex}-${ringIndex}`}
            d={path}
            fill={fill}
            stroke="white"
            strokeWidth="1"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              if (!isDragging) {
                e.stopPropagation();
                onSegmentClick(sliceIndex, ringIndex);
              }
            }}
          />
        );
      })}
      
      {/* Selection numbers */}
      {(() => {
        const currentSelections = selections[sliceIndex] || [];
        if (currentSelections.length === 0) return null;
        
        return currentSelections.map((selectionNumber) => {
          const ringIndex = selectionNumber - 1; // Convert back to 0-based
          const angleStep = (2 * Math.PI) / TOTAL_SLICES;
          const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep / 2; // Center of slice
          const radius = MIN_RADIUS + (ringIndex + 0.5) * RING_WIDTH; // Center of ring
          
          const x = CENTER_X + radius * Math.cos(angle);
          const y = CENTER_Y + radius * Math.sin(angle);
          
          // Determine the text color based on segment color
          const baseColor = sliceColors[sliceIndex];
          let textColor;
          
          if (currentSelections.length === 1) {
            // Only one selection, so this number is in the dark color range
            textColor = darkenColor(baseColor);
          } else if (currentSelections.length === 2) {
            const [firstSelection, secondSelection] = currentSelections;
            if (selectionNumber === firstSelection) {
              // This is the first selection, in the dark color range
              textColor = darkenColor(baseColor);
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
      })()}
      
      {/* Label */}
      {(() => {
        const label = sliceLabels[sliceIndex];
        const getLabelPosition = () => {
          const angleStep = (2 * Math.PI) / TOTAL_SLICES;
          const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep / 2; // Center of slice
          const labelRadius = MAX_RADIUS + 30;
          
          const x = CENTER_X + labelRadius * Math.cos(angle);
          const y = CENTER_Y + labelRadius * Math.sin(angle);
          
          return { x, y, angle };
        };

        const { x, y, angle } = getLabelPosition();
        const rotation = angle * (180 / Math.PI);
        const shouldFlip = rotation > 90 && rotation < 270;
        const finalRotation = shouldFlip ? rotation + 180 : rotation;
        
        // Split long labels into multiple lines
        const words = label.split(' ');
        const maxWordsPerLine = words.length > 3 ? 2 : words.length;
        const lines = [];
        
        for (let i = 0; i < words.length; i += maxWordsPerLine) {
          lines.push(words.slice(i, i + maxWordsPerLine).join(' '));
        }
        
        return (
          <g>
            {lines.map((line, lineIndex) => (
              <text
                key={`label-line-${sliceIndex}-${lineIndex}`}
                x={x}
                y={y + (lineIndex - (lines.length - 1) / 2) * 12}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fill="#374151"
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}
                transform={`rotate(${finalRotation} ${x} ${y})`}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })()}
    </g>
  );
}

function CircularDiagramContent() {
  const [selections, setSelections] = useState<Selection>({});
  const [sliceLabels, setSliceLabels] = useState(INITIAL_SLICE_LABELS);
  const [sliceColors, setSliceColors] = useState(INITIAL_SLICE_COLORS);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSlice, setDraggedSlice] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleSegmentClick = (sliceIndex: number, ringIndex: number) => {
    setSelections(prev => {
      const currentSelections = prev[sliceIndex] || [];
      const segmentNumber = ringIndex + 1; // Convert to 1-based numbering
      
      if (currentSelections.length === 0) {
        // No current selections, add this one
        return {
          ...prev,
          [sliceIndex]: [segmentNumber]
        };
      } else if (currentSelections.length === 1) {
        const [firstSelection] = currentSelections;
        
        if (segmentNumber <= firstSelection) {
          // Clicked on a dark-colored segment, clear all selections
          return {
            ...prev,
            [sliceIndex]: []
          };
        } else {
          // Clicked on an uncolored segment, add as second selection
          return {
            ...prev,
            [sliceIndex]: [firstSelection, segmentNumber].sort((a, b) => a - b)
          };
        }
      } else if (currentSelections.length === 2) {
        const [firstSelection, secondSelection] = currentSelections;
        
        if (segmentNumber <= firstSelection) {
          // Clicked on a dark-colored segment, clear all selections
          return {
            ...prev,
            [sliceIndex]: []
          };
        } else if (segmentNumber <= secondSelection) {
          // Clicked on a light-colored segment, remove second selection
          return {
            ...prev,
            [sliceIndex]: [firstSelection]
          };
        } else {
          // Clicked on an uncolored segment, do nothing (already have 2 selections)
          return prev;
        }
      }
      
      return prev;
    });
  };

  const handleSliceMove = (dragIndex: number, hoverIndex: number) => {
    // Reorder the labels and colors
    const newLabels = [...sliceLabels];
    const newColors = [...sliceColors];
    
    const draggedLabel = newLabels[dragIndex];
    const draggedColor = newColors[dragIndex];
    
    newLabels.splice(dragIndex, 1);
    newColors.splice(dragIndex, 1);
    
    newLabels.splice(hoverIndex, 0, draggedLabel);
    newColors.splice(hoverIndex, 0, draggedColor);
    
    setSliceLabels(newLabels);
    setSliceColors(newColors);
    
    // Update selections to match new indices
    setSelections(prev => {
      const newSelections: Selection = {};
      
      // Create a mapping from old index to new index
      const indexMapping: { [key: number]: number } = {};
      
      // Track which slices moved where
      if (dragIndex < hoverIndex) {
        // Moving right
        for (let i = 0; i < TOTAL_SLICES; i++) {
          if (i < dragIndex) {
            indexMapping[i] = i;
          } else if (i === dragIndex) {
            indexMapping[i] = hoverIndex;
          } else if (i <= hoverIndex) {
            indexMapping[i] = i - 1;
          } else {
            indexMapping[i] = i;
          }
        }
      } else {
        // Moving left
        for (let i = 0; i < TOTAL_SLICES; i++) {
          if (i < hoverIndex) {
            indexMapping[i] = i;
          } else if (i < dragIndex) {
            indexMapping[i] = i + 1;
          } else if (i === dragIndex) {
            indexMapping[i] = hoverIndex;
          } else {
            indexMapping[i] = i;
          }
        }
      }
      
      // Remap all selections to new indices
      Object.keys(prev).forEach(oldIndexStr => {
        const oldIndex = parseInt(oldIndexStr);
        const newIndex = indexMapping[oldIndex];
        if (prev[oldIndex] && prev[oldIndex].length > 0) {
          newSelections[newIndex] = prev[oldIndex];
        }
      });
      
      return newSelections;
    });
  };

  const handleMouseDown = (sliceIndex: number, event: React.MouseEvent) => {
    // Prevent drag if clicking on segments (to allow segment selection)
    const target = event.target as Element;
    if (target.tagName === 'path') {
      return;
    }

    setDraggedSlice(sliceIndex);
    setDragStart({ x: event.clientX, y: event.clientY });
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart) return;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - dragStart.x, 2) + Math.pow(e.clientY - dragStart.y, 2)
      );
      
      // Start dragging if moved more than 5 pixels
      if (distance > 5) {
        setIsDragging(true);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && svgRef.current) {
        // Find which slice we're over
        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate angle
        let angle = Math.atan2(mouseY, mouseX) + Math.PI / 2;
        if (angle < 0) angle += 2 * Math.PI;
        
        // Convert to slice index
        const targetSliceIndex = Math.floor((angle / (2 * Math.PI)) * TOTAL_SLICES) % TOTAL_SLICES;
        
        // Perform the move if it's a different slice
        if (targetSliceIndex !== sliceIndex && draggedSlice !== null) {
          handleSliceMove(draggedSlice, targetSliceIndex);
        }
      }
      
      // Reset drag state
      setIsDragging(false);
      setDraggedSlice(null);
      setDragStart(null);
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };



  const saveDiagramAsPNG = () => {
    if (!svgRef.current) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to include space for labels that extend beyond the SVG
    const containerWidth = 700;
    const containerHeight = 700;
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    // Get SVG data
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const img = new Image();
    
    img.onload = () => {
      // Draw the SVG onto the canvas
      ctx.drawImage(img, 0, 0);
      
      // Create download link
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'circular-diagram.png';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };

    // Convert SVG to data URL
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.src = svgUrl;
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h1 className="mb-2">Interactive Circular Diagram</h1>
        <p className="text-muted-foreground">
          Click on segments to select them. You can select up to 2 segments per slice. Drag slices to reorder them.
        </p>
      </div>
      
      <div className="relative" style={{ userSelect: 'none' }}>
        <svg ref={svgRef} width="700" height="700" viewBox="0 0 700 700" style={{ userSelect: 'none' }}>
          {/* Grid lines */}
          {Array.from({ length: TOTAL_RINGS + 1 }, (_, i) => {
            const radius = MIN_RADIUS + i * RING_WIDTH;
            // Highlight boundaries between groups: 4-5 (index 4) and 7-8 (index 7)
            const isGroupBoundary = i === 4 || i === 7;
            const strokeColor = isGroupBoundary ? "#374151" : "#e5e7eb"; // darker grey for boundaries
            
            return (
              <circle
                key={`ring-${i}`}
                cx={CENTER_X}
                cy={CENTER_Y}
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth="1"
              />
            );
          })}
          
          {/* Slice dividers */}
          {Array.from({ length: TOTAL_SLICES }, (_, i) => {
            const angle = (i * 2 * Math.PI) / TOTAL_SLICES - Math.PI / 2;
            const x = CENTER_X + MAX_RADIUS * Math.cos(angle);
            const y = CENTER_Y + MAX_RADIUS * Math.sin(angle);
            return (
              <line
                key={`divider-${i}`}
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={x}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Draggable Slices */}
          {Array.from({ length: TOTAL_SLICES }, (_, sliceIndex) => (
            <DraggableSlice
              key={`slice-${sliceIndex}`}
              sliceIndex={sliceIndex}
              sliceLabels={sliceLabels}
              sliceColors={sliceColors}
              selections={selections}
              onSegmentClick={handleSegmentClick}
              onSliceMove={handleSliceMove}
              isDragging={isDragging}
              draggedSlice={draggedSlice}
              onMouseDown={handleMouseDown}
            />
          ))}
        </svg>

      </div>
      
      <Button onClick={saveDiagramAsPNG} className="mt-4">
        Save diagram
      </Button>
    </div>
  );
}

export default function CircularDiagram() {
  return <CircularDiagramContent />;
}