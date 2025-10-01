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

// Help view component following Single Responsibility Principle
// Contains all help content, tutorial video, and return functionality

import React, { useEffect } from 'react';
import { useAppContext } from '../state/AppContext';
import { Button } from '../components/ui/button'; // Add this import
import styles from './HelpView.module.css';

type HelpViewProps = {
  // Define any props if needed, or leave empty for now
};

const HelpView: React.FC<HelpViewProps> = () => {
  const { dispatch } = useAppContext();

  const handleReturn = () => {
    dispatch({ type: 'SET_VIEW', payload: 'main' });
  };

  // Add escape key listener to return to main view
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleReturn();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Get current URL without query parameters for the sensory wheel link
  const getCurrentUrl = () => {
    return window.location.origin + window.location.pathname;
  };

  const sensoryWheelUrl = `${getCurrentUrl()}?state=N4IgzgpgNhDGAuBLA9gOzCAXKADFg2gLoA0IAjASSAEyWkDMdIALEwKxMBsTA7JQL6kwURLAgAZAIYAjaBkz4QAZWQBXVABMABAAoAgqo2J4yAE4BPAJQhSASVTwIp1JKhalEdJKRowu%2B46myGIADj6o1qRKiADmABbwugBqiGCqrpHKALbQbjoA8lAAZpIIZlY2IAAqkmCOugDiqnXe5ZlVarBxujUIiDCZAEKukqhiyRB1iNKqUJKmQ8ga5lp6AO7znpN%2BOgAKQSGmKKHh1lTCohAAwshQZvKKAMScnLBssLCVj7AAnBrSPFYpEeRVeRR4FGBRQAHD9YICvhpYNIcEVaMDoTw3mwil8fhBpD8iowoRBodDpBRziIxLZYL4CCBALwbgCEdypMwC5O%2BzAII7gHg%2F9mAYR32YBRHcqgGhySqAPg3ABy7gFgCQACZOzAG17ssAQmT86mXAAik1gRzCKHQjIAmmpTFp1IgAI6qCBaUyTEK%2BO0mLRgNSaAB0qy0dzWbvpDq0iE0om8ky05jUWlgoy0MS2plcUBWRX6gS00lKAGsYkF1NpUMhUnbRtoTDAk%2FUIAA3JzmDSSFbugtgb16LRxWLdMCBu0OoowBB%2BCAAD3gDpybs8YGMiBrxhWOji5hCTksxC0aziTjt9KyWTQWiLJb8my0IUkIaKsy0ZjvddM2%2BgWRDMU394LTgAtJB0HOF3gJcVydDctx3IMo1ULRX3iRJIAgbM71URI7kMTcQ0cdA7RbTQ%2FFdIoIGge0IBiWZww0T1KlNVRzRkfpFy0V011MMR5xw2IXCgPwiiCLJg3%2FDQ7Sg81pCWcx219ZB%2FV7Mw7RyUY%2FCgkiRBkFNj2QJBxkwpwuJjW0%2FBEbM7TidQE1MTd4C7Uw6g%2Fc1LxDSSu3iAM5JIwc4HgPwjCKNNYFmICSPpGJUFSN8mJ3SA3U41wwE3bdRG6WNUF9CBJHLZANMSNKkFQGILQcfotBKV8wB3DRNyLRINCOVBs3C9QkDcISVxqii7Ky4MhMKopzHCiBD3CPxGqKqyIBWWR9ztZBH2fKBXzyqjSBo80xxYxBPHGZAigiu0FzSVwtzMKBKJ9P1XKDNIYgTOolOjOIyxgJjVzDNwRDg8Kyy0fb0jcWAoBQjN9yKMx4DUiSfWcns%2BxjOMFJSkCnD%2FWckEA8x4ogu1pCOODfW7Ly71E5oVkveBAnQLRzyMd0jk8XL30JztV2QZGAMXDHd0jaNYISTM7TatYUtdHTsO%2B1JfrdJAslmRA8eM4q5jK8L3oSfDMsI4jPBiSQE0o6izWnf9UcYr6HVKcImMynzCIdBwAzptszuki75LSinlKqy43RyKBuMzFDKaDKrnpCV71Jmpw5pyU6Oyhl3YZSkMjFjepEZsmc2aAjmg33Q8UrAH2%2FaMu0WJvKd7xBpZA7tFxmhyt8OpAlmM%2BNrPwM55SecSYPPfGOogjyu8NDNPx7yyJtKb6Ot1IQpCxv4tR4CWkAVsNlH50Ygi5hrEfKc0Jix3gWiIxDLnaJgxe4kk87ZKDeG7ugzwACtkBWSRvvmDbtCMCBEjWYw4iL2DGANIEAnLdnjslGCbsmYsVZq3FYMB0rhVdO%2FB0%2FdRCOG%2FhtP%2BmMYxODBqfRw45j5niDOoWQ8w1IQEbszeBG9ArPkgtGPUkg6xaEPpOaAzYJxoHyoONhu8dBgJiJ6Tcj5myh1gCse8LYFiWxIjEVIGYxpMVqI4Zeq81pOA2mMaaO0QgrlnLGP6aAwYID3uWQ%2BpC7wpREm6eqqBr7O1vnaJOYZHB%2BGBqDLcACP6020P9TSXY8qWQGixbwpDNxfSAmuUeO0TCqC6OAlyriE7QLjGnehaNNzj0cflIJVkUE61HuaFWiREldGKkRNwDlUA3igLQp02T2bt2YdBLunVe4lyvClMeE9Z5aCEhAEIF50FpCDARGpsN5qaINjpZwh1kb6MzCMPRuSI45AcNE%2BeYBSaIEOmYXRYNwjOJkjDK6N0CbKQ1m4Fo0gnpfXpGYIwLgsEpOhm5TpA4hyJCyS3Bh6NYbNHCoNQ00VYDZlQNsYqfFvbJgvnWLZXkmnNyNoCzcSDXn5VQceIi2gQbmhFlFQ8SK6ZyxwqHVAoVB73iCJClB6tpkOjInMd5%2Btz7Y16QAcmGmMXwsAUDNEphsW2MLtptOEgbMSyxgECTdJeMQZz473zPoiu0%2F8rIxjQGmbq4xTabHUqVJ%2BhgEzFTMEqyGEC0lQPHqFQidRKZeIBlkWc0KQGbhmFkKl%2BVMKZWQNIJ%2Bnk4qMxBYPEwmVpZVPvBGvGZMnqEvGMIz0oj4pHHppbTKD1TDaHvIAk6KCQkxDVplO4zcUxgW2lhaciFwrDNGYcbYx8FEJkSO%2FWQZMnBrxWfYmVEkQBUFQKoLIshTC7BZnONAWAQBiAcE4SocxZBQCUEBGA06xInUqGJAs8xzAAHUID43XbcDQlQyrSTpAyTAE5bRCFBjcF1qBp3922Ge0GWpEAOj6FOzAIAhK9kqPPCAz7zB1AGiAfgQA`;

  return (
    <div className="view-container">
      <div className="view-content">
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

          <p className={styles.introText}>
            For a clear, empathetic child-centric explanation with examples, visit the{' '}
            <a
              href="https://www.seattlechildrens.org/clinics/autism-center/the-autism-blog/autism-levels-support/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Seattle Children's Autism Center Blog
            </a>
            .
          </p>
        </div>

        {/* Further Reading section */}
        <h2 className={styles.secondaryTitle}>Further Reading & Resources 📚</h2>

        <div className={styles.textSection}>
          <p className={styles.introText}>
            If you want to explore more before completing your profile, here are some excellent resources.
          </p>

          <h3 className={styles.tertiaryTitle}>Tools for Self-Exploration</h3>

          <p className={styles.introText}>
            These are screening questionnaires, not diagnostic tools. They can't confirm if you're autistic, but they can offer insights and help you understand your own traits.
          </p>

          <p className={styles.introText}>
            <span className={styles.boldText}>The Autism-Spectrum Quotient (AQ):</span> Developed by Cambridge University, this is a widely used questionnaire to measure autistic traits.
          </p>

          <ul className={styles.resourcesList}>
            <li>
              Online Version with Analysis:{' '}
              <a
                href="https://embrace-autism.com/autism-spectrum-quotient/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Embrace Autism - AQ Test
              </a>
            </li>
            <li>
              Another Online Version:{' '}
              <a
                href="https://psychology-tools.com/test/autism-spectrum-quotient"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Prosper Health - AQ Test
              </a>
            </li>
          </ul>

          <p className={styles.introText}>
            <span className={styles.boldText}>The Ritvo Autism Asperger Diagnostic Scale–Revised (RAADS-R):</span> This scale was designed specifically with adults in mind, including those who may have gone undiagnosed because they have learned to "mask" their autistic traits.
          </p>

          <ul className={styles.resourcesList}>
            <li>
              Online Version:{' '}
              <a
                href="https://embrace-autism.com/raads-r/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Embrace Autism - RAADS-R Test
              </a>
            </li>
            <li>
              Informational Page:{' '}
              <a
                href="https://www.keyautismservices.com/resources/raads-r-test-for-autism/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Key Autism Services - About the RAADS-R
              </a>
            </li>
          </ul>

          <h3 className={styles.tertiaryTitle}>Community & Advocacy</h3>

          <p className={styles.introText}>
            These organisations offer practical advice, community connection, and advocate for the autistic community.
          </p>

          <ul className={styles.resourcesList}>
            <li>
              <a
                href="https://www.autism.org.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.boldText}>The National Autistic Society (UK)</span>
              </a>
              <span className={styles.boldText}>:</span>{' '}
              The UK's most established and largest charity dedicated to autism. It functions as a comprehensive resource hub for autistic people, their families, and professionals. Its strengths lie in providing a vast library of practical information, guidance on navigating systems (like education and health), and connecting people to local services.
            </li>
            <li>
              <a
                href="https://www.s4nd.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.boldText}>The Society for Neurodiversity (S4Nd) (UK)</span>
              </a>
              <span className={styles.boldText}>:</span>{' '}
              This UK organisation is distinguished by being run by and for a wide range of neurodivergent people (not limited to autism). Its primary focus is on building a supportive peer-led community, offering connection and resources grounded in shared lived experience.
            </li>
            <li>
              <a
                href="https://autisticadvocacy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.boldText}>Autistic Self Advocacy Network (ASAN) (US)</span>
              </a>
              <span className={styles.boldText}>:</span>{' '}
              A US-based non-profit run by and for autistic people. ASAN's core mission is political and rights-based advocacy, centered on the principle of "Nothing About Us Without Us." They focus on influencing public policy and ensuring autistic voices are central to conversations about disability rights.
            </li>
            <li>
              <a
                href="https://autismsociety.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.boldText}>Autism Society (US)</span>
              </a>
              <span className={styles.boldText}>:</span>{' '}
              As one of the oldest and largest US autism organisations, its key differentiator is its extensive network of local affiliates. It provides on-the-ground support, information, and services directly to autistic individuals and their families within their own communities.
            </li>
            <li>
              <a
                href="https://awnnetwork.org/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.boldText}>Autistic Women & Nonbinary Network (AWN) (US)</span>
              </a>
              <span className={styles.boldText}>:</span>{' '}
              A US-based organization with focusing is on creating a supportive community specifically for autistic women, girls, nonbinary people, and other marginalised genders. It addresses the distinct experiences of this demographic, such as late diagnosis, social masking, and the intersection of autism with gender identity.
            </li>
          </ul>

          <h3 className={styles.tertiaryTitle}>Key UK & US Health Information</h3>

          <p className={styles.introText}>
            These government and public health bodies provide reliable, evidence-based information on autism diagnosis and support.
          </p>

          <ul className={styles.resourcesList}>
            <li>
              <a
                href="https://www.nhs.uk/conditions/autism/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.boldText}>The UK National Health Service (NHS)</span>
              </a>
              <span className={styles.boldText}>:</span>{' '}
              The official source for understanding autism in the UK, including the steps for seeking an assessment and finding support.
            </li>
            <li>
              <a
                href="https://www.cdc.gov/autism/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.boldText}>The US Centers for Disease Control and Prevention (CDC)</span>
              </a>
              <span className={styles.boldText}>:</span>{' '}
              Provides detailed summaries of official diagnostic criteria, data, and links to current research.
            </li>
          </ul>

          <h3 className={styles.tertiaryTitle}>Other Reputable Sources</h3>

          <ul className={styles.resourcesList}>
            <li>
              <a
                href="https://embrace-autism.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.boldText}>Embrace Autism</span>
              </a>
              <span className={styles.boldText}>:</span>{' '}
              A fantastic resource hub run by a registered psychologist and an autistic advocate. It provides free online versions of the screening tools listed above, along with detailed articles explaining their scoring, history, and validity, all backed by research.
            </li>
            <li>
              <a
                href="https://www.clara.psychol.cam.ac.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.boldText}>The Autism Research Centre (Cambridge University)</span>
              </a>
              <span className={styles.boldText}>:</span>{' '}
              The academic centre where the AQ test was developed. Their work forms the scientific foundation for many of the tools and understanding we use today.
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