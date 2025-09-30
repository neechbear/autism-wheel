// Help view component following Single Responsibility Principle
// Contains all help content, tutorial video, and return functionality

import React, { useEffect } from 'react';
import styles from './HelpView.module.css';
import { Button } from '../components/ui/button';
import { useAppContext, appActions } from '../state/AppContext';

function HelpView(): JSX.Element {
  const { dispatch } = useAppContext();

  const handleReturn = () => {
    dispatch(appActions.setView('main'));
  };

  // Add escape key listener to return to main view
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleReturn();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Get current URL without query parameters for the sensory wheel link
  const getCurrentUrl = () => {
    return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  };

  const sensoryWheelUrl = `${getCurrentUrl()}?state=N4IgzgpgNhDGAuBLA9gOzCAXKADFg2gLoA0IAjASSAEyWkDMdIALEwKxMBsTA7JQL6kwURLAgAZAIYAjaBkz4QAZWQBXVABMABAAoAgqo2J4yAE4BPAJQhSASVTwIp1JKhalEdJKRowu%2B46myGIADj6o1qRKiADmABbwugBqiGCqrpHKALbQbjoA8lAAZpIIZlY2IAAqkmCOugDiqnXe5ZlVarBxujUIiDCZAEKukqhiyRB1iNKqUJKmQ8ga5lp6AO7znpN%2BOgAKQSGmKKHh1lTCohAAwshQZvKKAMScnLBssLCVj7AAnBrSPFYpEeRVeRR4FGBRQAHD9YICvhpYNIcEVaMDoTw3mwil8fhBpD8iowoRBodDpBRziIxLZYL4CCBALwbgCEdypMwC5O%2BzAII7gHg%2F9mAYR32YBRHcqgGhySqAPg3ABy7gFgCQACZOzAG17ssAQmT86mXAAik1gRzCKHQjIAmmpTFp1IgAI6qCBaUyTEK%2BO0mLRgNSaAB0qy0dzWbvpDq0iE0om8ky05jUWlgoy0MS2plcUBWRX6gS00lKAGsYkF1NpUMhUnbRtoTDAk%2FUIAA3JzmDSSFbugtgb16LRxWLdMCBu0OoowBB%2BCAAD3gDpybs8YGMiBrxhWOji5hCTksxC0aziTjt9KyWTQWiLJb8my0IUkIaKsy0ZjvddM2%2BgWRDMU394LTgAtJB0HOF3gJcVydDctx3IMo1ULRX3iRJIAgbM71URI7kMTcQ0cdA7RbTQ%2FFdIoIGge0IBiWZww0T1KlNVRzRkfpFy0V011MMR5xw2IXCgPwiiCLJg3%2FDQ7Sg81pCWcx219ZB%2FV7Mw7RyUY%2FCgkiRBkFNj2QJBxkwpwuJjW0%2FBEbM7TidQE1MTd4C7Uw6g%2Fc1LxDSSu3iAM5JIwc4HgPwjCKNNYFmICSPpGJUFSN8mJ3SA3U41wwE3bdRG6WNUF9CBJHLZANMSNKkFQGILQcfotBKV8wB3DRNyLRINCOVBs3C9QkDcISVxqii7Ky4MhMKopzHCiBD3CPxGqKqyIBWWR9ztZBH2fKBXzyqjSBo80xxYxBPHGZAigiu0FzSVwtzMKBKJ9P1XKDNIYgTOolOjOIyxgJjVzDNwRDg8Kyy0fb0jcWAoBQjN9yKMx4DUiSfWcns%2BxjOMFJSkCnD%2FWckEA8x4ogu1pCOODfW7Ly71E5oVkveBAnQLRzyMd0jk8XL30JztV2QZGAMXDHd0jaNYISTM7TatYUtdHTsO%2B1JfrdJAslmRA8eM4q5jK8L3oSfDMsI4jPBiSQE0o6izWnf9UcYr6HVKcImMynzCIdBwAzptszuki75LSinlKqy43RyKBuMzFDKaDKrnpCV71Jmpw5pyU6Oyhl3YZSkMjFjepEZsmc2aAjmg33Q8UrAH2%2FaMu0WJvKd7xBpZA7tFxmhyt8OpAlmM%2BNrPwM55SecSYPPfGOogjyu8NDNPx7yyJtKb6Ot1IQpCxv4tR4CWkAVsNlH50Ygi5hrEfKc0Jix3gWiIxDLnaJgxe4kk87ZKDeG7ugzwACtkBWSRvvmDbtCMCBEjWYw4iL2DGANIEAnLdnjslGCbsmYsVZq3FYMB0rhVdO%2FB0%2FdRCOG%2FhtP%2BmMYxODBqfRw45j5niDOoWQ8w1IQEbszeBG9ArPkgtGPUkg6xaEPpOaAzYJxoHyoONhu8dBgJiJ6Tcj5myh1gCse8LYFiWxIjEVIGYxpMVqI4Zeq81pOA2mMaaO0QgrlnLGP6aAwYID3uWQ%2BpC7wpREm6eqqBr7O1vnaJOYZHB%2BGBqDLcACP6020P9TSXY8qWQGixbwpDNxfSAmuUeO0TCqC6OAlyriE7QLjGnehaNNzj0cflIJVkUE61HuaFWiREldGKkRNwDlUA3igLQp02T2bt2YdBLunVe4lyvClMeE9Z5aCEhAEIF50FpCDARGpsN5qaINjpZwh1kb6MzCMPRuSI45AcNE%2BeYBSaIEOmYXRYNwjOJkjDK6N0CbKQ1m4Fo0gnpfXpGYIwLgsEpOhm5TpA4hyJCyS3Bh6NYbNHCoNQ00VYDZlQNsYqfFvbJgvnWLZXkmnNyNoCzcSDXn5VQceIi2gQbmhFlFQ8SK6ZyxwqHVAoVB73iCJClB6tpkOjInMd5%2Btz7Y16QAcmGmMXwsAUDNEphsW2MLtptOEgbMSyxgECTdJeMQZz473zPoiu0%2F8rIxjQGmbq4xTabHUqVJ%2BhgEzFTMEqyGEC0lQPHqFQidRKZeIBlkWc0KQGbhmFkKl%2BVMKZWQNIJ%2Bnk4qMxBYPEwmVpZVPvBGvGZMnqEvGMIz0oj4pHHppbTKD1TDaHvIAk6KCQkxDVplO4zcUxgW2lhaciFwrDNGYcbYx8FEJkSO%2FWQZMnBrxWfYmVEkQBUFQKoLIshTC7BZnONAWAQBiAcE4SocxZBQCUEBGA06xInUqGJAs8xzAAHUID43XbcDQlQyrSTpAyTAE5bRCFBjcF1qBp3922Ge0GWpEAOj6FOzAIAhK9kqPPCAz7zB1AGiAfgQA`;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Main title - same as main page */}
        <h1 className={styles.title}>Autism Wheel</h1>

        {/* Top return button */}
        <div className={styles.buttonContainer}>
          <Button
            onClick={handleReturn}
            className={styles.returnButton}
          >
            Return to app
          </Button>
        </div>

        {/* Secondary heading */}
        <h2 className={styles.secondaryTitle}>How to Use This Tool</h2>

        {/* Introduction text */}
        <div className={styles.textSection}>
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

        {/* Getting started text */}
        <div className={styles.textSection}>
          <p className={styles.introText}>
            To get started, watch this short video guide that walks you through creating your own autistic wheel profile. An alternative sensory wheel is available by{' '}
            <a
              href={sensoryWheelUrl}
              className={styles.link}
            >
              clicking this link
            </a>
            .
          </p>
        </div>

        {/* YouTube video embed */}
        <div className={styles.videoContainer}>
          <div className={styles.videoWrapper}>
            <iframe
              src="https://www.youtube.com/embed/q6GuRmvEKZw"
              title="How to Use the Autism Wheel - Tutorial Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className={styles.video}
            ></iframe>
          </div>
        </div>

        {/* Support Needs section */}
        <h2 className={styles.secondaryTitle}>Understanding Support Needs (ASD Levels)</h2>

        <div className={styles.textSection}>
          <p className={styles.introText}>
            When filling out your profile, it might be helpful to think about your support needs. The official diagnostic framework (the DSM-5) uses three "levels" to describe the varying degrees of support an autistic person might benefit from. These levels are just a clinical starting point—they can't capture the full picture of who you are. Your autistic wheel profile will show that your needs can change depending on the environment, your energy levels, or the specific task you're doing.
          </p>

          <ul className={styles.supportLevelsList}>
            <li className={styles.supportLevel}>
              <strong className={styles.levelTitle}>Level 1: "Requiring Support"</strong>
              <span className={styles.levelDescription}>
                You might navigate daily life with a degree of independence but find some situations challenging. For example, you may speak in full sentences but find back-and-forth conversation tiring or difficult to initiate. Unexpected changes to your routine or switching between tasks can be stressful and require extra energy to manage.
              </span>
            </li>
            <li className={styles.supportLevel}>
              <strong className={styles.levelTitle}>Level 2: "Requiring Substantial Support"</strong>
              <span className={styles.levelDescription}>
                You may benefit from more consistent support to navigate social situations and daily tasks. Communication might involve simpler sentences or be focused on your deep passions and interests. Sticking to a routine is often very important, and changes can be quite distressing. These support needs are likely apparent to those around you.
              </span>
            </li>
            <li className={styles.supportLevel}>
              <strong className={styles.levelTitle}>Level 3: "Requiring Very Substantial Support"</strong>
              <span className={styles.levelDescription}>
                You likely require significant, ongoing support in most areas of life. You may communicate in ways other than spoken language (for example, using a device or gestures) or use a few words. Having a predictable structure and coping with change can be a major challenge, and a lot of support is needed to navigate the demands of daily life.
              </span>
            </li>
          </ul>
        </div>

        {/* Bottom return button */}
        <div className={styles.buttonContainer}>
          <Button
            onClick={handleReturn}
            className={styles.returnButton}
          >
            Return to app
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HelpView;