import { useTour, StepType } from '@reactour/tour';
import React, { useEffect } from 'react';

export const steps: StepType[] = [
    {
        selector: '[data-tour="main-diagram"]',
        content: 'This is the main interactive diagram. You can click on the segments to select them.',
    },
    {
        selector: '[data-tour="main-diagram"]',
        content: 'Click one of the segments in the first slice of the diagram to indicate the impact that this category has on your life under typical day-to-day circumstances.',
    },
    {
        selector: '[data-tour="main-diagram"]',
        content: 'If you sometimes experience more severe impacts of that category (for example during times of stress or overwhelmed), then you can click a second segment in the same slice to indicate this.',
    },
    {
        selector: '[data-tour="main-diagram"]',
        content: 'If you want to change your selected values inside a slice, you can click any of the highlighted "typical/normal" or "under stress" segments to cancel that selection, at which point you can reselect what you want.',
    },
    {
        selector: '[data-tour="view-options"]',
        content: 'These are the view options. You can use them to hide the emojis, show the numbers, or change the boldness of various things.',
    },
    {
        selector: '[data-tour="action-buttons"]',
        content: 'These buttons allow you to download, print, copy a shareable link, and save the diagram.',
    },
    {
        selector: '[data-tour="edit-labels-button"]',
        content: 'This button allows you to change the label names/categories.',
        action: () => {
            const editButton = document.querySelector('[data-tour="edit-labels-button"]');
            if (editButton instanceof HTMLElement) {
                editButton.click();
            }
        }
    },
    {
        selector: '[data-tour="edit-labels-button"]',
        content: 'Customizing the label categories is optional. You can save your changes, or revert any changes and completely reset to the original default if necessary.',
        action: () => {
            const saveButton = document.querySelector('[data-tour="edit-labels-button"]');
            if (saveButton instanceof HTMLElement) {
                saveButton.click();
            }
        }
    },
    {
        selector: '[data-tour="details-table"]',
        content: 'This table shows a detailed breakdown of your selections. You can also change the column sort order if you want.',
    },
];

export default function Tour({ children }) {
    const { setIsOpen, setSteps } = useTour();

    useEffect(() => {
        const tourCompleted = localStorage.getItem('tourCompleted');
        const isDownloaded = (window as any).__PRELOADED_STATE__;

        if (!tourCompleted && !isDownloaded) {
            setSteps(steps);
            setIsOpen(true);
            localStorage.setItem('tourCompleted', 'true');
        }
    }, [setIsOpen, setSteps]);

    return <>{children}</>;
}
