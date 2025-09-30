// Detailed breakdown table component following Single Responsibility Principle
// Displays all categories with their data in a structured table format

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useAppContext } from '../state/AppContext';

function DetailedBreakdownTable(): JSX.Element {
  const { state } = useAppContext();
  const { categories, profile, settings } = state;

  const getASDLevel = (value: number): string => {
    if (value >= 1 && value <= 4) {
      return 'Occasional Support Needs';
    } else if (value >= 5 && value <= 7) {
      return 'Frequent Support Needs';
    } else if (value >= 8 && value <= 10) {
      return 'Consistent Support Needs';
    }
    return '';
  };

  const shouldShowNumbers = settings.numberPosition !== 'hide_all' && settings.numberPosition !== 'hide_segment';

  return (
    <div className="w-full max-w-3xl mx-auto overflow-x-auto print:overflow-visible">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Category</TableHead>
            {shouldShowNumbers && <TableHead className="text-center w-1/4">Typical Impact</TableHead>}
            {shouldShowNumbers && <TableHead className="text-center w-1/4">Under Stress Impact</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => {
            const selectionValues = profile.selections[index] || [];
            // For the table, we show the selection range or individual values
            const typicalImpact = selectionValues.length > 0 ? selectionValues[0] : 0;
            const stressedImpact = selectionValues.length > 1 ? selectionValues[1] : (selectionValues.length > 0 ? selectionValues[0] : 0);

            return (
              <TableRow key={category.id}>
                <TableCell className="align-top">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      {settings.showIcons && (
                        <span className="text-4xl flex-shrink-0 mt-0.5">{category.icon}</span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium break-words">{category.name}</div>
                        <div className="text-sm text-muted-foreground break-words whitespace-normal mt-1">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                {shouldShowNumbers && (
                  <TableCell className="align-top text-center">
                    {typicalImpact > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="inline-block px-3 py-1 rounded min-w-8 text-center text-white font-medium"
                            style={{ backgroundColor: category.color }}
                          >
                            {typicalImpact}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getASDLevel(typicalImpact)}
                        </div>
                      </div>
                    ) : null}
                  </TableCell>
                )}
                {shouldShowNumbers && (
                  <TableCell className="align-top text-center">
                    {stressedImpact > 0 && stressedImpact !== typicalImpact ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="inline-block px-3 py-1 rounded min-w-8 text-center"
                            style={{
                              backgroundColor: category.color + '80', // Add transparency for second selection
                              color: category.color
                            }}
                          >
                            {stressedImpact}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getASDLevel(stressedImpact)}
                        </div>
                      </div>
                    ) : null}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default DetailedBreakdownTable;