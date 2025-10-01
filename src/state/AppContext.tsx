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

// Global state management using Context API and useReducer
// Following the architectural requirements from copilot instructions

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type {
  ApplicationState,
  UserProfile,
  AppSettings,
  ViewType,
  ThemeType,
  NumberPositionType,
  LabelStyleType,
  BoundaryWeightType,
  SortColumnType,
  SortDirectionType,
  LabelData,
} from '../types';
import {
  DEFAULT_SLICE_LABELS,
  DEFAULT_SLICE_DESCRIPTIONS,
  DEFAULT_SLICE_ICONS,
  DEFAULT_SLICE_COLORS,
} from '../constants/defaults';
import { loadAndMigrateState } from './MigrateState';

// Action types for state updates
export type AppAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'UPDATE_SELECTION'; payload: { sliceIndex: string; values: number[] } }
  | { type: 'REMOVE_SELECTION'; payload: { sliceIndex: string } }
  | { type: 'SET_CATEGORIES'; payload: LabelData[] }
  | { type: 'SET_SLICE_LABELS'; payload: string[] }
  | { type: 'SET_SLICE_COLORS'; payload: string[] }
  | { type: 'SET_SLICE_ICONS'; payload: string[] }
  | { type: 'SET_SLICE_DESCRIPTIONS'; payload: string[] }
  | { type: 'UPDATE_SETTING'; payload: { key: keyof AppSettings; value: any } }
  | { type: 'SET_THEME'; payload: ThemeType }
  | { type: 'SET_NUMBER_POSITION'; payload: NumberPositionType }
  | { type: 'SET_LABEL_STYLE'; payload: LabelStyleType }
  | { type: 'SET_BOUNDARY_WEIGHT'; payload: BoundaryWeightType }
  | { type: 'SET_SORT_COLUMN'; payload: SortColumnType }
  | { type: 'SET_SORT_DIRECTION'; payload: SortDirectionType }
  | { type: 'SET_SHOW_ICONS'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: Partial<ApplicationState> }
  | { type: 'RESET_TO_DEFAULTS' };

// Default application state
const createDefaultState = (): ApplicationState => ({
  currentView: 'main',
  profile: {
    selections: {},
  },
  categories: DEFAULT_SLICE_LABELS.map((label, index) => ({
    id: `category-${index}`,
    name: label,
    description: DEFAULT_SLICE_DESCRIPTIONS[index],
    icon: DEFAULT_SLICE_ICONS[index],
    color: DEFAULT_SLICE_COLORS[index],
  })),
  settings: {
    showNumbers: true,
    showLabels: true,
    showIcons: true,
    theme: 'system',
    numberPosition: 'center',
    labelStyle: 'bold',
    boundaryWeight: 'bold',
    sortColumn: 'stress',
    sortDirection: 'desc',
  },
});

// State reducer function
function appReducer(state: ApplicationState, action: AppAction): ApplicationState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    case 'UPDATE_SELECTION':
      return {
        ...state,
        profile: {
          ...state.profile,
          selections: {
            ...state.profile.selections,
            [parseInt(action.payload.sliceIndex)]: action.payload.values,
          },
        },
      };

    case 'REMOVE_SELECTION':
      const { [parseInt(action.payload.sliceIndex)]: removed, ...remainingSelections } = state.profile.selections;
      return {
        ...state,
        profile: {
          ...state.profile,
          selections: remainingSelections,
        },
      };

    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload.map((labelData, index) => ({
          id: labelData.id || `category-${index}`,
          name: labelData.label,
          description: labelData.description,
          icon: labelData.icon,
          color: labelData.color,
        })),
      };

    case 'SET_SLICE_LABELS':
      return {
        ...state,
        categories: state.categories.map((category, index) => ({
          ...category,
          name: action.payload[index] || category.name,
        })),
      };

    case 'SET_SLICE_COLORS':
      return {
        ...state,
        categories: state.categories.map((category, index) => ({
          ...category,
          color: action.payload[index] || category.color,
        })),
      };

    case 'SET_SLICE_ICONS':
      return {
        ...state,
        categories: state.categories.map((category, index) => ({
          ...category,
          icon: action.payload[index] || category.icon,
        })),
      };

    case 'SET_SLICE_DESCRIPTIONS':
      return {
        ...state,
        categories: state.categories.map((category, index) => ({
          ...category,
          description: action.payload[index] || category.description,
        })),
      };

    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_THEME':
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: action.payload,
        },
      };

    case 'SET_NUMBER_POSITION':
      return {
        ...state,
        settings: {
          ...state.settings,
          numberPosition: action.payload,
        },
      };

    case 'SET_LABEL_STYLE':
      return {
        ...state,
        settings: {
          ...state.settings,
          labelStyle: action.payload,
        },
      };

    case 'SET_BOUNDARY_WEIGHT':
      return {
        ...state,
        settings: {
          ...state.settings,
          boundaryWeight: action.payload,
        },
      };

    case 'SET_SORT_COLUMN':
      return {
        ...state,
        settings: {
          ...state.settings,
          sortColumn: action.payload,
        },
      };

    case 'SET_SORT_DIRECTION':
      return {
        ...state,
        settings: {
          ...state.settings,
          sortDirection: action.payload,
        },
      };

    case 'SET_SHOW_ICONS':
      return {
        ...state,
        settings: {
          ...state.settings,
          showIcons: action.payload,
        },
      };

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
        settings: {
          ...state.settings,
          ...action.payload.settings,
        },
      };

    case 'RESET_TO_DEFAULTS':
      return createDefaultState();

    default:
      return state;
  }
}

// Context creation
type AppContextType = {
  state: ApplicationState;
  dispatch: React.Dispatch<AppAction>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the app context
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Provider component
type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(appReducer, createDefaultState());

  // Load state with URL taking precedence over localStorage
  useEffect(() => {
    try {
      // First check for URL parameters (takes precedence)
      const urlParams = new URLSearchParams(window.location.search);
      const urlState = urlParams.get('state');

      if (urlState) {
        // URL state found - decode and load it
        const decodedState = loadAndMigrateState(urlState);
        if (decodedState) {
          dispatch({ type: 'LOAD_STATE', payload: decodedState });
          return; // Exit early, don't load localStorage
        }
      }

      // No URL state or failed to decode - try localStorage
      const savedState = localStorage.getItem('autism-wheel-state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.warn('Failed to load state:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('autism-wheel-state', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Export action creators for convenience
export const appActions = {
  setView: (view: ViewType): AppAction => ({ type: 'SET_VIEW', payload: view }),

  updateSelection: (sliceIndex: string, values: number[]): AppAction => ({
    type: 'UPDATE_SELECTION',
    payload: { sliceIndex, values },
  }),

  removeSelection: (sliceIndex: string): AppAction => ({
    type: 'REMOVE_SELECTION',
    payload: { sliceIndex },
  }),

  setCategories: (categories: LabelData[]): AppAction => ({
    type: 'SET_CATEGORIES',
    payload: categories,
  }),

  setTheme: (theme: ThemeType): AppAction => ({ type: 'SET_THEME', payload: theme }),

  setNumberPosition: (position: NumberPositionType): AppAction => ({
    type: 'SET_NUMBER_POSITION',
    payload: position,
  }),

  setLabelStyle: (style: LabelStyleType): AppAction => ({
    type: 'SET_LABEL_STYLE',
    payload: style,
  }),

  setBoundaryWeight: (weight: BoundaryWeightType): AppAction => ({
    type: 'SET_BOUNDARY_WEIGHT',
    payload: weight,
  }),

  setSortColumn: (column: SortColumnType): AppAction => ({
    type: 'SET_SORT_COLUMN',
    payload: column,
  }),

  setSortDirection: (direction: SortDirectionType): AppAction => ({
    type: 'SET_SORT_DIRECTION',
    payload: direction,
  }),

  setShowIcons: (show: boolean): AppAction => ({ type: 'SET_SHOW_ICONS', payload: show }),

  resetToDefaults: (): AppAction => ({ type: 'RESET_TO_DEFAULTS' }),
};