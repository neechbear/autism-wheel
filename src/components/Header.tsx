// Header component following Single Responsibility Principle
// Displays application title and disclaimer information

import { HelpCircle } from 'lucide-react';
import styles from './Header.module.css';

type HeaderProps = {
  isLockedMode: boolean;
  hideIntro: boolean;
  onHelp?: () => void;
};

function Header({ isLockedMode, hideIntro, onHelp }: HeaderProps): JSX.Element {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isLockedMode ? "My Autism Wheel" : "Autism Wheel"}
      </h1>

      {!isLockedMode && !hideIntro && (
        <div className={styles.introContainer}>
          <div className={styles.introSection}>
            <p className={styles.introText}>
              Thank you for using{' '}
              <a
                href="https://www.myautisticprofile.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
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
                className={styles.link}
              >
                feedback@myautisticprofile.com
              </a>
              .
            </p>
          </div>

          <div className={styles.instructionsSection}>
            <p className={styles.instructionsText}>
              Click on one or two segments per slice, to indicate the typical day-to-day and under
              stress/elevated impact each category has on your life. Click{' '}
              <button
                onClick={onHelp}
                className={styles.helpLink}
              >
                the help button
                <HelpCircle className={styles.helpIcon} />
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