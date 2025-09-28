import React from 'react';
import { useAppState, useAppDispatch } from '../state/AppContext';
import { UserSelection } from '../types';
import styles from './RadialDiagram.module.css';
import clsx from 'clsx';

const TOTAL_RINGS = 10;
const CENTER_X = 375;
const CENTER_Y = 375;
const MIN_RADIUS = 55;
const MAX_RADIUS = 265;
const RING_WIDTH = (MAX_RADIUS - MIN_RADIUS) / TOTAL_RINGS;

const ASD_LABELS = [
  { text: 'ASD-1', radius: (MIN_RADIUS + (MIN_RADIUS + 4 * RING_WIDTH)) / 2 },
  { text: 'ASD-2', radius: (MIN_RADIUS + 4 * RING_WIDTH + (MIN_RADIUS + 7 * RING_WIDTH)) / 2 },
  { text: 'ASD-3', radius: (MIN_RADIUS + 7 * RING_WIDTH + MAX_RADIUS) / 2 },
];

// Helper function to darken a hex color for accessible text
const darkenColor = (hexColor: string, amount: number = 0.4): string => {
    const color = hexColor.replace('#', '');
    const num = parseInt(color, 16);
    const r = Math.max(0, (num >> 16) - 255 * amount);
    const g = Math.max(0, ((num >> 8) & 0x00ff) - 255 * amount);
    const b = Math.max(0, (num & 0x0000ff) - 255 * amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

const RadialDiagram: React.FC = () => {
  const { categories, profile, settings } = useAppState();
  const dispatch = useAppDispatch();
  const svgRef = React.useRef<SVGSVGElement>(null);

  const handleSegmentClick = (sliceIndex: number, ringIndex: number) => {
    const categoryId = categories[sliceIndex].id;
    const existingSelection = profile.selections[categoryId] || { categoryId, typicalImpact: 0, stressedImpact: 0 };
    const segmentNumber = ringIndex + 1; // 1-based index

    let newTypical = existingSelection.typicalImpact;
    let newStressed = existingSelection.stressedImpact;

    if (newTypical === 0) { // First click, sets typical
        newTypical = segmentNumber;
    } else if (segmentNumber <= newTypical) { // Click on or inside typical range
        newTypical = 0;
        newStressed = 0;
    } else if (newStressed === 0 || segmentNumber > newStressed) { // Sets or expands stressed
        newStressed = segmentNumber;
    } else if (segmentNumber <= newStressed) { // Click inside stressed range
        newStressed = 0;
    }

    // Ensure stressed is always greater than typical if both are set
    if (newStressed > 0 && newStressed <= newTypical) {
        newStressed = 0;
    }

    const newSelection: UserSelection = { categoryId, typicalImpact: newTypical, stressedImpact: newStressed };
    dispatch({ type: 'UPDATE_SELECTION', payload: newSelection });
  };

  const createSegmentPath = (sliceIndex: number, ringIndex: number) => {
    const angleStep = (2 * Math.PI) / categories.length;
    const startAngle = sliceIndex * angleStep - Math.PI / 2;
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

    return `M ${x1},${y1} L ${x2},${y2} A ${outerRadius},${outerRadius} 0 0 1 ${x3},${y3} L ${x4},${y4} A ${innerRadius},${innerRadius} 0 0 0 ${x1},${y1} Z`;
  };

  const getLabelPosition = (sliceIndex: number) => {
    const angleStep = (2 * Math.PI) / categories.length;
    const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep / 2;
    const labelRadius = MAX_RADIUS + 30;
    const x = CENTER_X + labelRadius * Math.cos(angle);
    const y = CENTER_Y + labelRadius * Math.sin(angle);
    return { x, y, angle };
  };

  return (
    <svg ref={svgRef} width="750" height="750" viewBox="0 0 750 750" className={styles.diagram}>
      {/* Segments */}
      {categories.map((category, sliceIndex) => {
        const selection = profile.selections[category.id];
        return Array.from({ length: TOTAL_RINGS }, (_, ringIndex) => {
          const segmentNumber = ringIndex + 1;
          let fill = 'var(--diagram-unselected-fill)';
          if (selection) {
            if (segmentNumber <= selection.typicalImpact) {
              fill = category.color;
            } else if (segmentNumber <= selection.stressedImpact) {
              fill = `${category.color}80`; // 50% opacity
            }
          }
          return (
            <path
              key={`segment-${sliceIndex}-${ringIndex}`}
              d={createSegmentPath(sliceIndex, ringIndex)}
              fill={fill}
              stroke={'var(--diagram-segment-stroke)'}
              strokeWidth="1"
              className={styles.segment}
              onClick={() => handleSegmentClick(sliceIndex, ringIndex)}
            />
          );
        });
      })}

      {/* Grid Lines */}
      {Array.from({ length: TOTAL_RINGS + 1 }, (_, i) => {
        const isGroupBoundary = i === 4 || i === 7;
        return (
          <circle
            key={`ring-${i}`}
            cx={CENTER_X}
            cy={CENTER_Y}
            r={MIN_RADIUS + i * RING_WIDTH}
            className={clsx(styles.gridLine, isGroupBoundary && styles.gridLineBoundary)}
          />
        );
      })}
      {categories.map((_, i) => (
        <line
          key={`divider-${i}`}
          x1={CENTER_X}
          y1={CENTER_Y}
          x2={CENTER_X + MAX_RADIUS * Math.cos((i * 2 * Math.PI) / categories.length - Math.PI / 2)}
          y2={CENTER_Y + MAX_RADIUS * Math.sin((i * 2 * Math.PI) / categories.length - Math.PI / 2)}
          className={styles.gridLine}
        />
      ))}

      {/* Labels */}
      {settings.showLabels && categories.map((category, sliceIndex) => {
        const { x, y, angle } = getLabelPosition(sliceIndex);
        const rotation = angle * (180 / Math.PI);
        const shouldFlip = rotation > 90 && rotation < 270;
        return (
          <g key={`label-g-${sliceIndex}`} transform={`translate(${x}, ${y}) rotate(${shouldFlip ? rotation + 180 : rotation})`}>
            <text textAnchor="middle" dominantBaseline="middle" className={styles.labelText}>
              {category.name}
            </text>
          </g>
        );
      })}

      {/* Icons */}
      {settings.showIcons && categories.map((category, sliceIndex) => {
        const angleStep = (2 * Math.PI) / categories.length;
        const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep / 2;
        const iconRadius = MIN_RADIUS * 0.7;
        return (
          <text
            key={`icon-${sliceIndex}`}
            x={CENTER_X + iconRadius * Math.cos(angle)}
            y={CENTER_Y + iconRadius * Math.sin(angle)}
            textAnchor="middle"
            dominantBaseline="middle"
            className={styles.centerIcon}
          >
            {category.icon}
          </text>
        );
      })}

      {/* Selection Numbers */}
      {settings.showNumbers && Object.values(profile.selections).map(selection => {
        const sliceIndex = categories.findIndex(c => c.id === selection.categoryId);
        if (sliceIndex === -1) return null;

        const angleStep = (2 * Math.PI) / categories.length;
        const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep / 2;
        const { color } = categories[sliceIndex];

        return [selection.typicalImpact, selection.stressedImpact].map(impact => {
            if (impact === 0) return null;
            const ringIndex = impact - 1;
            const radius = MIN_RADIUS + (ringIndex + 0.5) * RING_WIDTH;
            const x = CENTER_X + radius * Math.cos(angle);
            const y = CENTER_Y + radius * Math.sin(angle);
            const isTypical = impact === selection.typicalImpact;

            return (
                <text
                    key={`num-${selection.categoryId}-${impact}`}
                    x={x} y={y}
                    className={styles.selectionNumber}
                    style={{ fill: darkenColor(color, isTypical ? 0.4 : 0.2) }}
                >
                    {impact}
                </text>
            )
        })
      })}

    </svg>
  );
};

export default RadialDiagram;