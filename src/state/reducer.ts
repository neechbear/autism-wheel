import { ApplicationState } from '../types';
import { Action } from './actions';

export const appReducer = (state: ApplicationState, action: Action): ApplicationState => {
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };
    case 'UPDATE_SELECTION':
      return {
        ...state,
        profile: {
          ...state.profile,
          selections: {
            ...state.profile.selections,
            [action.payload.categoryId]: action.payload,
          },
        },
      };
    case 'UPDATE_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    case 'SET_ENTIRE_STATE':
        // Basic validation to ensure we're not setting a completely invalid state
        if (action.payload && typeof action.payload === 'object' && 'version' in action.payload) {
            return {
                ...state, // Start with current state as a fallback for any missing properties
                ...action.payload
            };
        }
        return state; // Return current state if payload is invalid
    default:
      return state;
  }
};