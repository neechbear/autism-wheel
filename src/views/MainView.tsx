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

// Main view component following Single Responsibility Principle
// Composes all main interface components into the primary application view

import clsx from 'clsx';
import styles from './MainView.module.css';
import Header from '../components/Header';
import RadialDiagram from '../components/RadialDiagram';
import ViewOptions from '../components/ViewOptions';
import ActionToolbar from '../components/ActionToolbar';
import DetailedBreakdownTable from '../components/DetailedBreakdownTable';
import { useAppContext, appActions } from '../state/AppContext';
import { Button } from '../components/ui/button';
import { isLockedHtmlMode } from '../utils';

function MainView(): JSX.Element {
  const { state, dispatch } = useAppContext();
  const isLocked = isLockedHtmlMode();

  const handleEditCategories = () => {
    dispatch(appActions.setView('edit'));
  };

  const handleHelp = () => {
    // Scroll to top when navigating to help
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(appActions.setView('help'));
  };

  const handleSegmentClick = (sliceIndex: number, ringIndex: number) => {
    const currentSelections = state.profile.selections[sliceIndex] || [];
    const segmentNumber = ringIndex + 1; // Convert to 1-based numbering

    if (currentSelections.length === 0) {
      // No current selections, add this one
      dispatch(appActions.updateSelection(sliceIndex.toString(), [segmentNumber]));
    } else if (currentSelections.length === 1) {
      const [firstSelection] = currentSelections;

      if (segmentNumber <= firstSelection) {
        // Clicked on a dark-colored segment, clear all selections
        dispatch(appActions.removeSelection(sliceIndex.toString()));
      } else {
        // Clicked on an uncolored segment, add as second selection
        const newSelections = [firstSelection, segmentNumber].sort((a, b) => a - b);
        dispatch(appActions.updateSelection(sliceIndex.toString(), newSelections));
      }
    } else if (currentSelections.length === 2) {
      const [first, second] = currentSelections;

      if (segmentNumber <= first) {
        // Clicked on a dark-colored segment, clear all selections
        dispatch(appActions.removeSelection(sliceIndex.toString()));
      } else if (segmentNumber === second) {
        // Clicked on the second selection, remove it
        dispatch(appActions.updateSelection(sliceIndex.toString(), [first]));
      } else if (segmentNumber > second) {
        // Clicked beyond both selections, replace the second selection
        dispatch(appActions.updateSelection(sliceIndex.toString(), [first, segmentNumber]));
      } else {
        // Clicked between the two selections, replace the second selection
        dispatch(appActions.updateSelection(sliceIndex.toString(), [first, segmentNumber]));
      }
    }
  };

  return (
    <div className="view-container">
      <div className="view-content">
        {/* Header section */}
        <Header isLockedMode={false} hideIntro={false} onHelp={handleHelp} />

        {/* Action toolbar */}
        <div className={clsx(styles.actionToolbar, styles.printHidden)}>
          <ActionToolbar />

          {!isLocked && (
            <Button
              onClick={handleEditCategories}
              className={clsx(styles.button, styles.blueButton)}
              data-testid="edit-categories-button"
            >
              Edit Categories
            </Button>
          )}
        </div>

        {/* View options */}
        {!isLocked && <ViewOptions />}

        {/* Main diagram section */}
        <div className={styles.diagramContainer}>
          <RadialDiagram onSegmentClick={handleSegmentClick} />
        </div>

        {/* Detailed breakdown table */}
        <div className={styles.detailedBreakdownSection}>
          <DetailedBreakdownTable />
        </div>
      </div>
    </div>
  );
}

export default MainView;