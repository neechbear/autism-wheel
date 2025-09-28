import React from 'react';
import styles from './Header.module.css';

type HeaderProps = {
  isLockedMode: boolean;
  hideIntro: boolean;
};

const Header: React.FC<HeaderProps> = ({ isLockedMode, hideIntro }) => {
  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.title}>{isLockedMode ? 'My Autism Wheel' : 'Autism Wheel'}</h1>
      {!hideIntro && !isLockedMode && (
        <div className={styles.introText}>
          <p>
            Thank you for using{' '}
            <a href="https://www.myautisticprofile.com/" target="_blank" rel="noopener noreferrer" className={styles.link}>
              my Autism Wheel
            </a>
            . I developed this tool as a personal project to help myself and others visualize and better communicate their own unique autistic profiles.
            I am not a medical professional, and this tool is not intended for diagnosis, treatment, or as a replacement for professional medical advice.
            Your feedback to improve this tool is welcomed at{' '}
            <a href="mailto:feedback@myautisticprofile.com?subject=Feedback%20on%20Autism%20Wheel" target="_blank" rel="noopener noreferrer" className={styles.link}>
              feedback@myautisticprofile.com
            </a>.
          </p>
        </div>
      )}
    </header>
  );
};

export default Header;