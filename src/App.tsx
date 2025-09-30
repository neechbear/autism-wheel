import { useEffect } from 'react';
import { AppProvider, useAppContext } from './state/AppContext';
import MainView from './views/MainView';
import HelpView from './views/HelpView';

// Main app component that renders the appropriate view
function AppContent() {
  const { state } = useAppContext();

  useEffect(() => {
    const lockedMeta = document.querySelector('meta[name="autism-wheel-locked-html-mode"]');
    if (lockedMeta) {
      document.title = 'My Autism Wheel';
    } else {
      document.title = 'Autism Wheel';
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.settings.theme]);

  // Render the appropriate view based on current state
  switch (state.currentView) {
    case 'help':
      return <HelpView />;
    case 'main':
    default:
      return <MainView />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}