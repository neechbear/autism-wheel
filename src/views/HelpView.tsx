import React, { useEffect } from 'react';
import { useAppDispatch } from '../state/AppContext';
import styles from './HelpView.module.css';

// This is a basic Button component that we'll use until we create a shared one.
const Button: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className }) => (
  <button onClick={onClick} className={`${styles.button} ${className || ''}`}>
    {children}
  </button>
);


const HelpView: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleReturn = () => {
    dispatch({ type: 'SET_VIEW', payload: 'main' });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleReturn();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.returnButtonContainer}>
        <Button onClick={handleReturn}>Return to app</Button>
      </div>

      <h1 className={styles.title}>How to Use This Tool</h1>
      <p className={styles.paragraph}>
        To get started, watch this short video guide that walks you through creating your own autistic wheel profile.
        An alternative sensory wheel is available{' '}
        <a
          href={`${window.location.origin}${window.location.pathname}?state=N4IgzgpgNhDGAuBLA9gOzCAXKADFg2gLoA0IAjASSAEyWkDMdIALEwKxMBsTA7JQL6kwURLAgAZAIYAjaBkz4QAZWQBXVABMABAAoAgqo2J4yAE4BPAJQhSASVTwIp1JKhalEdJKRowu%2B46myGIADj6o1qRKiADmABbwugBqiGCqrpHKALbQbjoA8lAAZpIIZlY2IAAqkmCOugDiqnXe5ZlVarBxujUIiDCZAEKukqhiyRB1iNKqUJKmQ8ga5lp6AO7znpN%2BOgAKQSGmKKHh1lTCohAAwshQZvKKAMScnLBssLCVj7AAnBrSPFYpEeRVeRR4FGBRQAHD9YICvhpYNIcEVaMDoTw3mwil8fhBpD8iowoRBodDpBRziIxLZYL4CCBALwbgCEdypMwC5O%2BzAII7gHg%2F9mAYR32YBRHcqgGhySqAPg3ABy7gFgCQACZOzAG17ssAQmT86mXAAik1gRzCKHQjIAmmpTFp1IgAI6qCBaUyTEK%2BO0mLRgNSaAB0qy0dzWbvpDq0iE0om8ky05jUWlgoy0MS2plcUBWRX6gS00lKAGsYkF1NpUMhUnbRtoTDAk%2FUIAA3JzmDSSFbugtgb16LRxWLdMCBu0OoowBB%2BCAAD3gDpybs8YGMiBrxhWOji5hCTksxC0aziTjt9KyWTQWiLJb8my0IUkIaKsy0ZjvddM2%2BgWRDMU394LTgAtJB0HOF3gJcVydDctx3IMo1ULRX3iRJIAgbM71URI7kMTcQ0cdA7RbTQ%2FFdIoIGge0IBiWZww0T1KlNVRzRkfpFy0V011MMR5xw2IXCgPwiiCLJg3%2FDQ7Sg81pCWcx219ZB%2FV7Mw7RyUY%2FCgkiRBkFNj2QJBxkwpwuJjW0%2FBEbM7TidQE1MTd4C7Uw6g%2Fc1LxDSSu3iAM5JIwc4HgPwjCKNNYFmICSPpGJUFSN8mJ3SA3U41wwE3bdRG6WNUF9CBJHLZANMSNKkFQGILQcfotBKV8wB3DRNyLRINCOVBs3C9QkDcISVxqii7Ky4MhMKopzHCiBD3CPxGqKqyIBWWR9ztZBH2fKBXzyqjSBo80xxYxBPHGZAigiu0FzSVwtzMKBKJ9P1XKDNIYgTOolOjOIyxgJjVzDNwRDg8Kyy0fb0jcWAoBQjN9yKMx4DUiSfWcns%2BxjOMFJSkCnD%2FWckEA8x4ogu1pCOODfW7Ly71E5oVkveBAnQLRzyMd0jk8XL30JztV2QZGAMXDHd0jaNYISTM7TatYUtdHTsO%2B1JfrdJAslmRA8eM4q5jK8L3oSfDMsI4jPBiSQE0o6izWnf9UcYr6HVKcImMynzCIdBwAzptszuki75LSinlKqy43RyKBuMzFDKaDKrnpCV71Jmpw5pyU6Oyhl3YZSkMjFjepEZsmc2aAjmg33Q8UrAH2%2FaMu0WJvKd7xBpZA7tFxmhyt8OpAlmM%2BNrPwM55SecSYPPfGOogjyu8NDNPx7yyJtKb6Ot1IQpCxv4tR4CWkAVsNlH50Ygi5hrEfKc0Jix3gWiIxDLnaJgxe4kk87ZKDeG7ugzwACtkBWSRvvmDbtCMCBEjWYw4iL2DGANIEAnLdnjslGCbsmYsVZq3FYMB0rhVdO%2FB0%2FdRCOG%2FhtP%2BmMYxODBqfRw45j5niDOoWQ8w1IQEbszeBG9ArPkgtGPUkg6xaEPpOaAzYJxoHyoONhu8dBgJiJ6Tcj5myh1gCse8LYFiWxIjEVIGYxpMVqI4Zeq81pOA2mMaaO0QgrlnLGP6aAwYID3uWQ%2BpC7wpREm6eqqBr7O1vnaJOYZHB%2BGBqDLcACP6020P9TSXY8qWQGixbwpDNxfSAmuUeO0TCqC6OAlyriE7QLjGnehaNNzj0cflIJVkUE61HuaFWiREldGKkRNwDlUA3igLQp02T2bt2YdBLunVe4lyvClMeE9Z5aCEhAEIF50FpCDARGpsN5qaINjpZwh1kb6MzCMPRuSI45AcNE%2BeYBSaIEOmYXRYNwjOJkjDK6N0CbKQ1m4Fo0gnpfXpGYIwLgsEpOhm5TpA4hyJCyS3Bh6NYbNHCoNQ00VYDZlQNsYqfFvbJgvnWLZXkmnNyNoCzcSDXn5VQceIi2gQbmhFlFQ8SK6ZyxwqHVAoVB73iCJClB6tpkOjInMd5%2Btz7Y16QAcmGmMXwsAUDNEphsW2MLtptOEgbMSyxgECTdJeMQZz473zPoiu0%2F8rIxjQGmbq4xTabHUqVJ%2BhgEzFTMEqyGEC0lQPHqFQidRKZeIBlkWc0KQGbhmFkKl%2BVMKZWQNIJ%2Bnk4qMxBYPEwmVpZVPvBGvGZMnqEvGMIz0oj4pHHppbTKD1TDaHvIAk6KCQkxDVplO4zcUxgW2lhaciFwrDNGYcbYx8FEJkSO%2FWQZMnBrxWfYmVEkQBUFQKoLIshTC7BZnONAWAQBiAcE4SocxZBQCUEBGA06xInUqGJAs8xzAAHUID43XbcDQlQyrSTpAyTAE5bRCFBjcF1qBp3922Ge0GWpEAOj6FOzAIAhK9kqPPCAz7zB1AGiAfgQA`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          by clicking this link
        </a>.
      </p>

      <div className={styles.videoContainer}>
        <iframe
          className={styles.videoIframe}
          src="https://www.youtube.com/embed/OvuTHMzbzpQ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
        </iframe>
      </div>

      <h2 className={styles.subheading}>Understanding Support Needs (ASD Levels)</h2>
      <p className={styles.paragraph}>
        When filling out your profile, it might be helpful to think about your support needs. The official diagnostic
        framework (the DSM-5) uses three "levels" to describe the varying degrees of support an autistic person might
        benefit from. These levels are just a clinical starting point—they can't capture the full picture of who you are.
        Your autistic wheel profile will show that your needs can change depending on the environment, your energy levels, or
        the specific task you're doing.
        </p>
      <ul className={styles.list}>
        <li>
          <p><strong>Level 1: "Requiring Support"</strong></p>
          <p className={styles.listDescription}>You might navigate daily life with a degree of independence but find some situations challenging. For example, you may speak in full sentences but find back-and-forth conversation tiring or difficult to initiate. Unexpected changes to your routine or switching between tasks can be stressful and require extra energy to manage.</p>
        </li>
        <li>
          <p><strong>Level 2: "Requiring Substantial Support"</strong></p>
          <p className={styles.listDescription}>You may benefit from more consistent support to navigate social situations and daily tasks. Communication might involve simpler sentences or be focused on your deep passions and interests. Sticking to a routine is often very important, and changes can be quite distressing. These support needs are likely apparent to those around you.</p>
        </li>
        <li>
          <p><strong>Level 3: "Requiring Very Substantial Support"</strong></p>
          <p className={styles.listDescription}>You likely require significant, ongoing support in most areas of life. You may communicate in ways other than spoken language (for example, using a device or gestures) or use a few words. Having a predictable structure and coping with change can be a major challenge, and a lot of support is needed to navigate the demands of daily life.</p>
        </li>
      </ul>

      <p className={styles.paragraph}>
        For a clear, empathetic child-centric explanation with examples, visit the <a href="https://www.seattlechildrens.org/clinics/autism-center/the-autism-blog/autism-levels-support/" target="_blank" rel="noopener noreferrer" className={styles.link}>Seattle Children's Autism Center Blog</a>.
        To read the direct quotes from the DSM-5, see this page from <a href="https://www.autismspeaks.org/levels-of-autism" target="_blank" rel="noopener noreferrer" className={styles.link}>Autism Speaks</a>.
      </p>

      <h2 className={`${styles.subheading} ${styles.resourceTitle}`}>Further Reading & Resources 📚</h2>
      <p className={styles.paragraph}>If you want to explore more before completing your profile, here are some excellent resources.</p>

      <h3 className={styles.resourceSubheading}>Tools for Self-Exploration</h3>
      <p className={styles.paragraph}>These are screening questionnaires, not diagnostic tools. They can't confirm if you're autistic, but they can offer insights and help you understand your own traits.</p>
      <p><strong>The Autism-Spectrum Quotient (AQ)</strong>: Developed by Cambridge University, this is a widely used questionnaire to measure autistic traits.</p>
      <ul className={styles.list}>
        <li>Online Version with Analysis: <a href="https://embrace-autism.com/autism-spectrum-quotient/" target="_blank" rel="noopener noreferrer" className={styles.link}>Embrace Autism - AQ Test</a></li>
        <li>Another Online Version: <a href="https://psychology-tools.com/test/autism-spectrum-quotient" target="_blank" rel="noopener noreferrer" className={styles.link}>Prosper Health - AQ Test</a></li>
      </ul>

      <p><strong>The Ritvo Autism Asperger Diagnostic Scale–Revised (RAADS-R)</strong>: This scale was designed specifically with adults in mind, including those who may have gone undiagnosed because they have learned to "mask" their autistic traits.</p>
      <ul className={styles.list}>
        <li>Online Version: <a href="https://embrace-autism.com/raads-r/" target="_blank" rel="noopener noreferrer" className={styles.link}>Embrace Autism - RAADS-R Test</a></li>
        <li>Informational Page: <a href="https://www.keyautismservices.com/resources/raads-r-test-for-autism/" target="_blank" rel="noopener noreferrer" className={styles.link}>Key Autism Services - About the RAADS-R</a></li>
      </ul>

      <h3 className={styles.resourceSubheading}>Community & Advocacy</h3>
      <p className={styles.paragraph}>These organisations offer practical advice, community connection, and advocate for the autistic community.</p>
      <ul className={styles.list}>
        <li><a href="https://www.autism.org.uk/" target="_blank" rel="noopener noreferrer" className={styles.link}><strong>The National Autistic Society (UK)</strong></a>: The UK's leading charity for autistic people and their families. Their website is a vast library of information on education, employment, mental health, and local support services.</li>
        <li><a href="https://www.autismspeaks.org/" target="_blank" rel="noopener noreferrer" className={styles.link}><strong>Autism Speaks (US)</strong></a>: A large US-based organisation focused on funding research and providing resources, such as toolkits for navigating life after diagnosis and transitioning to adulthood.</li>
      </ul>

      <div className={styles.returnButtonContainer}>
        <Button onClick={handleReturn}>Return to app</Button>
      </div>
    </div>
  );
};

export default HelpView;