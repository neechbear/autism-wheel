// Help view component following Single Responsibility Principle
// Contains all help content, tutorial video, and return functionality

import React, { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { useAppContext, appActions } from '../state/AppContext';

// YouTube icon component
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path
        fill="#FF0000"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      />
      <path fill="#FFFFFF" d="M9.545 15.568 15.818 12 9.545 8.432v7.136z" />
    </svg>
  );
}

function HelpContent(): JSX.Element {
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Return Button */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleReturn}
          className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Return to Main Page
        </Button>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Using the Autism Wheel</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          The Autism Wheel is a visual tool designed to help autistic individuals create, visualize, and share their unique autism profile.
        </p>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Note</h2>
        <p className="text-yellow-700 dark:text-yellow-300">
          This tool is for personal reflection and communication only. It is not a diagnostic tool and should not be used for medical or clinical purposes.
        </p>
      </div>

      {/* Tutorial Video */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Video Tutorial</h2>
        <div className="aspect-video w-full max-w-3xl mx-auto">
          <iframe
            src="https://www.youtube.com/embed/hF2lR28tJFo"
            title="Autism Wheel Tutorial Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
        <div className="flex justify-center">
          <a
            href="https://www.youtube.com/watch?v=hF2lR28tJFo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          >
            <YouTubeIcon className="w-6 h-6" />
            Watch on YouTube
          </a>
        </div>
      </div>

      {/* How to Use */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">How to Use the Autism Wheel</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-medium">1. Understanding the Wheel</h3>
            <p>The wheel is divided into different categories representing various aspects of autism. Click on the segments to indicate how much each area impacts your daily life on a scale from 1-10.</p>
          </div>

          <div className="border rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-medium">2. Making Your Selections</h3>
            <p>For each category, you can make two types of selections:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Typical Impact:</strong> How this area affects you in your day-to-day life</li>
              <li><strong>Stressed Impact:</strong> How this area affects you when you're under stress or overwhelmed</li>
            </ul>
            <p className="text-sm text-muted-foreground">Click once for typical impact, twice for stressed impact, and three times to clear your selection.</p>
          </div>

          <div className="border rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-medium">3. Customizing Categories</h3>
            <p>Use the "Edit Categories" button to personalize your wheel:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Change category names and descriptions</li>
              <li>Modify colors and icons</li>
              <li>Reorder categories by dragging</li>
              <li>Add new categories or remove existing ones</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-medium">4. Sharing Your Profile</h3>
            <p>Use the "Copy Link" button to generate a shareable URL containing your complete profile. This link preserves all your selections and customizations.</p>
          </div>

          <div className="border rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-medium">5. Saving and Exporting</h3>
            <p>The "Save Diagram" menu offers multiple export options:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>PNG:</strong> High-quality image for social media or documents</li>
              <li><strong>SVG:</strong> Scalable vector graphic for professional printing</li>
              <li><strong>HTML:</strong> Complete interactive file for offline use</li>
              <li><strong>Locked HTML:</strong> Non-editable version for sharing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Understanding Autism Levels */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Understanding Autism Support Levels</h2>
        <p className="text-muted-foreground">
          The DSM-5 describes three levels of support needs for autistic individuals. These levels reflect the amount of support a person may need, not their abilities or worth.
        </p>

        <div className="space-y-4">
          <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-medium text-green-800 dark:text-green-200">Level 1: Requiring Support</h3>
            <p className="text-green-700 dark:text-green-300">
              Individuals who need some support for social communication and may have difficulty initiating social interactions. They might struggle with organization, planning, and may be inflexible about routines. Many people at this level can live independently with occasional support.
            </p>
          </div>

          <div className="border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-medium text-yellow-800 dark:text-yellow-200">Level 2: Requiring Substantial Support</h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              Individuals who need more substantial support for social communication and behavior. They may have limited ability to initiate social interactions and may have difficulty coping with change. Daily living skills may require ongoing support.
            </p>
          </div>

          <div className="border border-red-200 dark:border-red-700 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-medium text-red-800 dark:text-red-200">Level 3: Requiring Very Substantial Support</h3>
            <p className="text-red-700 dark:text-red-300">
              Individuals who need very substantial support across all areas. They may have severe challenges with social communication and may exhibit very inflexible behavior that significantly interferes with daily functioning. Extensive support is needed for daily living skills.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <p className="text-blue-800 dark:text-blue-200">
            <strong>Remember:</strong> Support needs can vary by situation and can change over time. These levels are meant to describe support needs, not define a person's potential or value. Many autistic individuals have areas of both strength and challenge.
          </p>
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Helpful Resources</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 space-y-3">
            <h3 className="text-lg font-medium">Autism Organizations</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://autisticadvocacy.org/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  Autistic Self Advocacy Network (ASAN)
                </a>
              </li>
              <li>
                <a href="https://www.autism.org.uk/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  National Autistic Society (UK)
                </a>
              </li>
              <li>
                <a href="https://www.autismcanada.org/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  Autism Canada
                </a>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-6 space-y-3">
            <h3 className="text-lg font-medium">Research & Information</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.autismresearchcentre.com/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  Autism Research Centre (Cambridge)
                </a>
              </li>
              <li>
                <a href="https://www.ncbi.nlm.nih.gov/books/NBK532562/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  NIMH Autism Spectrum Disorder Information
                </a>
              </li>
              <li>
                <a href="https://www.cdc.gov/autism/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  CDC Autism Information
                </a>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-6 space-y-3">
            <h3 className="text-lg font-medium">Support Communities</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.reddit.com/r/autism/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  r/autism (Reddit Community)
                </a>
              </li>
              <li>
                <a href="https://www.reddit.com/r/aspergirls/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  r/aspergirls (Reddit Community)
                </a>
              </li>
              <li>
                <a href="https://autisticnotweird.com/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  Autistic Not Weird
                </a>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-6 space-y-3">
            <h3 className="text-lg font-medium">Professional Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.psychologytoday.com/us/therapists/autism" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  Find Autism-Informed Therapists
                </a>
              </li>
              <li>
                <a href="https://www.autismspecialistgroup.com/" target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 dark:text-blue-400 hover:underline">
                  Autism Specialist Group
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* About This Tool */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">About This Tool</h2>
        <div className="border rounded-lg p-6 space-y-3">
          <p>
            The Autism Wheel was created as a personal tool to help autistic individuals visualize and communicate their unique profiles.
            It's inspired by the understanding that autism presents differently in each person.
          </p>
          <p>
            This tool respects the principles of neurodiversity and aims to provide a non-pathologizing way to explore and share your autistic experience.
            Remember, there is no "right" or "wrong" way to be autistic.
          </p>
          <p>
            <strong>Privacy:</strong> All data is stored locally in your browser. No personal information is collected or transmitted to external servers.
          </p>
        </div>
      </div>

      {/* Return Button */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={handleReturn}
          className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Return to Main Page
        </Button>
      </div>
    </div>
  );
}

// Main export for the view
export default function HelpView(): JSX.Element {
  return <HelpContent />;
}