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
import { getTooltipConfig, isFileScheme, getStateFromMetaTag } from '../utils';

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
  | { type: 'UPDATE_TOOLTIP_SETTINGS'; payload: { disabled: boolean; delayDuration: number } }
  | { type: 'RESET_TO_DEFAULTS' };

// Default application state
const createDefaultState = (): ApplicationState => {
  const tooltipConfig = getTooltipConfig();

  return {
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
      tooltipDisabled: tooltipConfig.disabled,
      tooltipDelayDuration: tooltipConfig.delayDuration,
    },
  };
};

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

    case 'UPDATE_TOOLTIP_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          tooltipDisabled: action.payload.disabled,
          tooltipDelayDuration: action.payload.delayDuration,
        },
      };

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

  // Load state with proper order of precedence as per copilot instructions
  useEffect(() => {
    try {
      // 1. First check for URL parameters (highest priority)
      const urlParams = new URLSearchParams(window.location.search);
      const urlState = urlParams.get('state');

      if (urlState) {
        const decodedState = loadAndMigrateState(urlState);
        if (decodedState) {
          dispatch({ type: 'LOAD_STATE', payload: decodedState });
          return;
        }
      }

      // 2. Meta Tag (Offline Context) - file:// scheme
      if (isFileScheme()) {
        const metaState = getStateFromMetaTag();
        if (metaState) {
          const decodedState = loadAndMigrateState(metaState);
          if (decodedState) {
            dispatch({ type: 'LOAD_STATE', payload: decodedState });
            return;
          }
        }
      }

      // 3. Local Browser Storage
      const savedState = localStorage.getItem('autism-wheel-state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
        return;
      }

      // 4. Meta Tag (Web Context) - http:// or https:// scheme
      if (!isFileScheme()) {
        const metaState = getStateFromMetaTag();
        if (metaState) {
          const decodedState = loadAndMigrateState(metaState);
          if (decodedState) {
            dispatch({ type: 'LOAD_STATE', payload: decodedState });
            return;
          }
        }
      }

      // 5. Default State (lowest priority) - will use createDefaultState() from useReducer
      // No action needed, the reducer was initialized with default state
    } catch (error) {
      console.warn('Failed to load state:', error);
    }
  }, []);

  // Apply tooltip settings from URL parameters after any state loading
  useEffect(() => {
    const tooltipConfig = getTooltipConfig();
    dispatch({
      type: 'UPDATE_TOOLTIP_SETTINGS',
      payload: {
        disabled: tooltipConfig.disabled,
        delayDuration: tooltipConfig.delayDuration
      }
    });
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