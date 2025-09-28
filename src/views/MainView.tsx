import React from 'react';
import { useAppDispatch, useAppState } from '../state/AppContext';
import Header from '../components/Header';
import ViewOptions from '../components/ViewOptions';
import ActionToolbar from '../components/ActionToolbar';
import RadialDiagram from '../components/RadialDiagram';
import DetailedBreakdownTable from '../components/DetailedBreakdownTable';
import styles from './MainView.module.css';

const MainView: React.FC = () => {
    const dispatch = useAppDispatch();
    const { settings } = useAppState();

    const handleShowHelp = () => {
        dispatch({ type: 'SET_VIEW', payload: 'help' });
    };

    // In a real scenario, these would come from state or props
    const isLockedMode = false;
    const hideIntro = false;

    return (
        <div className={styles.container}>
            <Header isLockedMode={isLockedMode} hideIntro={hideIntro} />

            {!isLockedMode && (
                <div className={styles.intro}>
                    <p>
                        Click on one or two segments per slice, to indicate the typical day-to-day and under stress/elevated impact each category has on your life.
                        Click{' '}
                        <button onClick={handleShowHelp} className={styles.inlineLink}>
                            the help button
                        </button>
                        {' '}for additional guidance.
                    </p>
                </div>
            )}

            <div className={styles.diagramContainer}>
                <RadialDiagram />
            </div>

            {!isLockedMode && (
                <div className={styles.controlsContainer}>
                    <ViewOptions />
                    <ActionToolbar />
                </div>
            )}

            <div className={styles.breakdownContainer}>
                <DetailedBreakdownTable />
            </div>
        </div>
    );
};

export default MainView;