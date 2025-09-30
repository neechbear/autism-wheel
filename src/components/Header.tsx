// Header component following Single Responsibility Principle
// Displays application title and disclaimer information

import React from 'react';

type HeaderProps = {
  isLockedMode: boolean;
  hideIntro: boolean;
  onHelp?: () => void;
};

function Header({ isLockedMode, hideIntro, onHelp }: HeaderProps): JSX.Element {
  return (
    <div className="text-center">
      <h1 className="mb-2 text-4xl font-bold">
        {isLockedMode ? "My Autism Wheel" : "Autism Wheel"}
      </h1>

      {!isLockedMode && !hideIntro && (
        <div className="text-center">
          <div className="mb-6 max-w-3xl mx-auto space-y-4 print:hidden">
            <p className="text-left">
              Thank you for using{' '}
              <a
                href="https://www.myautisticprofile.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                my Autism Wheel
              </a>
              . I developed this tool as a personal project to help myself and others visualize and better
              communicate their own unique autistic profiles. I am not a medical professional, and this tool
              is not intended for diagnosis, treatment, or as a replacement for professional medical advice.
              Your feedback to improve this tool is welcomed at{' '}
              <a
                href="mailto:feedback@myautisticprofile.com?subject=Feedback%20on%20Autism%20Wheel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                feedback@myautisticprofile.com
              </a>
              .
            </p>
          </div>

          <div className="text-muted-foreground print:hidden max-w-3xl mx-auto">
            <p className="text-left text-blue-600 dark:text-blue-400">
              Click on one or two segments per slice, to indicate the typical day-to-day and under
              stress/elevated impact each category has on your life. Click{' '}
              <button
                onClick={onHelp}
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                the help button
              </button>
              {' '}for additional guidance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;