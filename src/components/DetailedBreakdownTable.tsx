import React, { useState, useMemo } from 'react';
import { useAppState } from '../state/AppContext';
import { ChevronUp, ChevronDown } from 'lucide-react';
import styles from './DetailedBreakdownTable.module.css';
import clsx from 'clsx';

// Helper function to get support needs text based on number
const getSupportNeedsText = (number: number) => {
  if (number >= 1 && number <= 4) return 'Occasional Support Needs';
  if (number >= 5 && number <= 7) return 'Frequent Support Needs';
  if (number >= 8 && number <= 10) return 'Consistent Support Needs';
  return '';
};

// Helper function to darken a hex color for accessible text
const darkenColor = (hexColor: string, amount: number = 0.4): string => {
    const color = hexColor.replace('#', '');
    const num = parseInt(color, 16);
    const r = Math.max(0, (num >> 16) - 255 * amount);
    const g = Math.max(0, ((num >> 8) & 0x00ff) - 255 * amount);
    const b = Math.max(0, (num & 0x0000ff) - 255 * amount);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

type SortColumn = 'category' | 'typical' | 'stress';
type SortDirection = 'asc' | 'desc';

const DetailedBreakdownTable: React.FC = () => {
  const { categories, profile, settings } = useAppState();
  const [sortColumn, setSortColumn] = useState<SortColumn | null>('stress');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTableData = useMemo(() => {
    const tableData = categories.map((category) => {
      const selection = profile.selections[category.id];
      return {
        ...category,
        typicalImpact: selection?.typicalImpact || 0,
        stressedImpact: selection?.stressedImpact || 0,
      };
    });

    if (!sortColumn) return tableData;

    return tableData.sort((a, b) => {
      let comparison = 0;
      switch (sortColumn) {
        case 'category':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'typical':
          comparison = a.typicalImpact - b.typicalImpact;
          break;
        case 'stress':
          comparison = a.stressedImpact - b.stressedImpact;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [categories, profile.selections, sortColumn, sortDirection]);

  const SortableHeader: React.FC<{ column: SortColumn; label: string }> = ({ column, label }) => (
    <th className={styles.tableHeader} onClick={() => handleSort(column)}>
      <div className={styles.sortableHeaderCell}>
        {label}
        <div className={styles.sortIcons}>
          <ChevronUp className={clsx(sortColumn === column && sortDirection === 'asc' && styles.sortIconActive)} />
          <ChevronDown className={clsx(styles.sortIconDown, sortColumn === column && sortDirection === 'desc' && styles.sortIconActive)} />
        </div>
      </div>
    </th>
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Detailed Breakdown</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <SortableHeader column="category" label="Category" />
              <SortableHeader column="typical" label="Typical Impact" />
              <SortableHeader column="stress" label="Under Stress Impact" />
            </tr>
          </thead>
          <tbody>
            {sortedTableData.map((item) => (
              <tr key={item.id}>
                <td className={styles.tableCell}>
                  <div className={styles.categoryCell}>
                    {settings.showIcons && <span className={styles.icon}>{item.icon}</span>}
                    <div className={styles.categoryText}>
                      <span className={styles.categoryName}>{item.name}</span>
                      <p className={styles.categoryDescription}>{item.description}</p>
                    </div>
                  </div>
                </td>
                <td className={`${styles.tableCell} ${styles.impactCell}`}>
                  {item.typicalImpact > 0 && (
                    <div className={styles.impactBoxContainer}>
                      <div className={styles.impactBox} style={{ backgroundColor: item.color, color: darkenColor(item.color) }}>
                        {item.typicalImpact}
                      </div>
                      <div className={styles.supportNeedsText}>{getSupportNeedsText(item.typicalImpact)}</div>
                    </div>
                  )}
                </td>
                <td className={`${styles.tableCell} ${styles.impactCell}`}>
                  {item.stressedImpact > 0 && (
                    <div className={styles.impactBoxContainer}>
                      <div className={styles.impactBox} style={{ backgroundColor: `${item.color}80`, color: darkenColor(item.color, 0.2) }}>
                        {item.stressedImpact}
                      </div>
                      <div className={styles.supportNeedsText}>{getSupportNeedsText(item.stressedImpact)}</div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedBreakdownTable;