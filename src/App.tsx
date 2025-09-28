import { useEffect } from 'react';
import { useAppState, useAppDispatch } from './state/AppContext';
import { loadStateFromLocalStorage, saveStateToLocalStorage } from './state/localStorage';
import MainView from './views/MainView';
import EditCategoriesView from './views/EditCategoriesView';
import HelpView from './views/HelpView';
import { initialState } from './state/initialState';
import LZString from 'lz-string';

const App = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { currentView, settings } = state;

  // Effect to initialize state from localStorage or URL on first load
  useEffect(() => {
    const loadedStateFromStorage = loadStateFromLocalStorage();
    const urlParams = new URLSearchParams(window.location.search);
    const encodedStateFromURL = urlParams.get('state');

    let stateToLoad = initialState;

    if (encodedStateFromURL) {
        try {
            const decompressedString = LZString.decompressFromBase64(encodedStateFromURL);
            if (decompressedString) {
                const decodedState = JSON.parse(decompressedString);
                // Basic validation
                if (decodedState && decodedState.version) {
                    stateToLoad = decodedState;
                }
            }
        } catch (error) {
            console.error("Failed to decode state from URL, using default.", error);
        }
    } else if (loadedStateFromStorage) {
        stateToLoad = loadedStateFromStorage;
    }

    dispatch({ type: 'SET_ENTIRE_STATE', payload: stateToLoad });
  }, [dispatch]);

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    // We don't save the initial default state until it's been modified.
    if (state !== initialState) {
      saveStateToLocalStorage(state);
    }
  }, [state]);

  // Effect to manage the theme on the document body
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
  }, [settings.theme]);

  // Effect to set the document title
  useEffect(() => {
    document.title = 'Autism Wheel';
  }, []);


  const renderView = () => {
    switch (currentView) {
      case 'edit':
        return <EditCategoriesView />;
      case 'help':
        return <HelpView />;
      case 'main':
      default:
        return <MainView />;
    }
  };

  return <div className="app-container">{renderView()}</div>;
};

export default App;