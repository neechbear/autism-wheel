import React, { useEffect } from 'react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

interface TourProps {
  startTour: boolean;
  onTourComplete: () => void;
  isEditingLabels: boolean;
  handleEditLabels: () => void;
}

const tourOptions: Shepherd.Tour.TourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true
    },
    classes: 'shadow-md bg-background',
    scrollTo: { behavior: 'smooth', block: 'center' }
  },
  useModalOverlay: true
};

const steps = (
  isEditingLabels: boolean,
  handleEditLabels: () => void
): Shepherd.Step.StepOptions[] => [
  {
    id: 'intro',
    title: 'Welcome to the Autism Wheel!',
    text: 'This guided tour will walk you through the main features of the application. Let\'s get started!',
    buttons: [
      {
        text: 'Next',
        action() {
          this.next();
        }
      }
    ]
  },
  {
    id: 'diagram',
    title: 'The Interactive Diagram',
    text: 'This is the main circular diagram. Each slice represents a different category related to autism.',
    attachTo: {
      element: '#circular-diagram',
      on: 'top'
    },
    buttons: [
      {
        text: 'Back',
        action() {
          this.back();
        }
      },
      {
        text: 'Next',
        action() {
          this.next();
        }
      }
    ]
  },
  {
    id: 'click-typical',
    title: 'Selecting "Typical" Impact',
    text: 'To indicate the typical impact a category has on your life, simply click on a segment. The number represents the level of impact. For example, let\'s click on segment 4.',
    attachTo: {
      element: '#diagram-segment-to-click',
      on: 'right'
    },
    buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          }
        },
        {
          text: 'Next',
          action() {
            this.next();
          }
        }
      ]
  },
  {
    id: 'click-stress',
    title: 'Indicating "Under Stress" Impact',
    text: 'If you experience a more significant impact during times of stress, you can click a second, higher-numbered segment in the same slice. This will create a range.',
    attachTo: {
      element: '#circular-diagram',
      on: 'top'
    },
    buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          }
        },
        {
          text: 'Next',
          action() {
            this.next();
          }
        }
      ]
  },
  {
    id: 'deselect',
    title: 'Changing Your Selection',
    text: 'To change your mind, you can click on any of the colored segments to clear the selection for that slice. You can then re-select as you wish.',
    attachTo: {
      element: '#circular-diagram',
      on: 'top'
    },
    buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          }
        },
        {
          text: 'Next',
          action() {
            this.next();
          }
        }
      ]
  },
  {
    id: 'view-options',
    title: 'Customizing Your View',
    text: 'These dropdown menus allow you to customize the appearance of the diagram. You can change how boundaries, numbers, labels, and icons are displayed.',
    attachTo: {
      element: '#view-options',
      on: 'bottom'
    },
    buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          }
        },
        {
          text: 'Next',
          action() {
            this.next();
          }
        }
      ]
  },
  {
    id: 'action-buttons',
    title: 'Actions and Saving',
    text: 'This row of buttons provides several actions: copying a shareable link, printing, downloading the diagram as a standalone file, or saving it as an image (PNG, SVG, JPEG).',
    attachTo: {
      element: '#action-buttons',
      on: 'bottom'
    },
    buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          }
        },
        {
          text: 'Next',
          action() {
            this.next();
          }
        }
      ]
  },
  {
    id: 'edit-labels-button',
    title: 'Editing Categories',
    text: 'If the default categories don\'t fit your experience, you can change them. Click this button to enter "Edit Mode".',
    attachTo: {
      element: '#edit-labels-button',
      on: 'bottom'
    },
    beforeShow: () => {
      if (isEditingLabels) {
        handleEditLabels();
      }
    },
    buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          }
        },
        {
          text: 'Next',
          action() {
            handleEditLabels();
            this.next();
          }
        }
      ]
  },
  {
    id: 'edit-labels-view',
    title: 'Customizing Labels',
    text: 'In this view, you can change label names, icons, and colors. You can also add new labels, delete existing ones, or reorder them by dragging.',
    attachTo: {
      element: '#edit-labels-button',
      on: 'bottom'
    },
    beforeShow: () => {
      if (!isEditingLabels) {
        handleEditLabels();
      }
    },
    buttons: [
        {
          text: 'Back',
          action() {
            handleEditLabels();
            this.back();
          }
        },
        {
          text: 'Next',
          action() {
            this.next();
          }
        }
      ]
  },
  {
    id: 'save-revert-labels',
    title: 'Saving or Reverting',
    text: 'Once you are done editing, click "Save labels" to apply your changes. If you change your mind, you can "Revert changes" or go back to the "Default labels". Let\'s go back to the main view.',
    attachTo: {
      element: '#edit-labels-button',
      on: 'bottom'
    },
    buttons: [
        {
          text: 'Back',
          action() {
            this.back();
          }
        },
        {
          text: 'Next',
          action() {
            handleEditLabels();
            this.next();
          }
        }
      ]
  },
  {
    id: 'details-table',
    title: 'Detailed Breakdown',
    text: 'This table provides a detailed summary of your selections. You can click on the column headers to sort the table.',
    attachTo: {
      element: '#details-table',
      on: 'top'
    },
    beforeShow: () => {
      if (isEditingLabels) {
        handleEditLabels();
      }
    },
    buttons: [
        {
          text: 'Back',
          action() {
            handleEditLabels();
            this.back();
          }
        },
        {
          text: 'Finish',
          action() {
            this.complete();
          }
        }
      ]
  }
];

const Tour: React.FC<TourProps> = ({ startTour, onTourComplete, isEditingLabels, handleEditLabels }) => {
  useEffect(() => {
    if (startTour) {
      const tour = new Shepherd.Tour(tourOptions);

      tour.addSteps(steps(isEditingLabels, handleEditLabels));

      tour.on('complete', onTourComplete);
      tour.on('cancel', onTourComplete);

      tour.start();

      return () => {
        if (tour.isActive()) {
          tour.complete();
        }
      };
    }
  }, [startTour, onTourComplete, isEditingLabels, handleEditLabels]);

  return null;
};

export default Tour;
