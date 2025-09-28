import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { ApplicationState } from '../types';
import { Action } from './actions';
import { appReducer } from './reducer';
import { initialState } from './initialState';

// Create the context for the state
const AppStateContext = createContext<ApplicationState | undefined>(undefined);

// Create the context for the dispatch function
const AppDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

// Create the provider component
type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// Custom hook to use the application state
export const useAppState = (): ApplicationState => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

// Custom hook to use the dispatch function
export const useAppDispatch = (): Dispatch<Action> => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
};