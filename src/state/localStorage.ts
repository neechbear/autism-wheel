import { ApplicationState } from '../types';

const LOCAL_STORAGE_KEY = 'autism-wheel-app-state';

/**
 * Loads the application state from localStorage.
 *
 * @returns The loaded ApplicationState, or null if no state is found or an error occurs.
 */
export const loadStateFromLocalStorage = (): ApplicationState | null => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }

    const state = JSON.parse(serializedState);

    // TODO: Implement state migration logic here in the future.
    // For now, we perform a basic validation to ensure it's a plausible state object.
    if (state && typeof state === 'object' && 'version' in state && 'profile' in state) {
      return state as ApplicationState;
    }

    return null;
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    // If an error occurs (e.g., corrupted data), we return null to allow the app to start with a fresh state.
    return null;
  }
};

/**
 * Saves the application state to localStorage.
 *
 * @param state The ApplicationState to save.
 */
export const saveStateToLocalStorage = (state: ApplicationState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
};