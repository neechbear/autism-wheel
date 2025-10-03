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

// State migration module for handling legacy data formats
// Ensures backward compatibility for shared profile URLs as per copilot instructions

import LZString from 'lz-string';
import type { ApplicationState } from '../types';

// Current state version
const CURRENT_STATE_VERSION = 1;

// Legacy state interface for version 0 (unversioned)
interface LegacyState {
  selections?: Record<string, number[]>;
  sliceLabels?: string[];
  sliceColors?: string[];
  sliceIcons?: string[];
  sliceDescriptions?: string[];
  numberPosition?: string;
  labelStyle?: string;
  boundaryWeight?: string;
  showIcons?: boolean;
  sortColumn?: string;
  sortDirection?: string;
  theme?: string;
  // No version property indicates legacy state
}

// Versioned state interface
interface VersionedState extends ApplicationState {
  version: number;
}

/**
 * Migrates legacy state (version 0) to current format
 */
function migrateV0toV1(legacyState: LegacyState): ApplicationState {
  return {
    currentView: 'main',
    profile: {
      selections: legacyState.selections || {},
    },
    categories: (legacyState.sliceLabels || []).map((label, index) => ({
      id: `category-${index}`,
      name: label,
      description: legacyState.sliceDescriptions?.[index] || '',
      icon: legacyState.sliceIcons?.[index] || '😀',
      color: legacyState.sliceColors?.[index] || '#3B82F6',
    })),
    settings: {
      showNumbers: true,
      showLabels: true,
      showIcons: legacyState.showIcons !== undefined ? legacyState.showIcons : true,
      theme: (legacyState.theme as any) || 'system',
      numberPosition: (legacyState.numberPosition as any) || 'center',
      labelStyle: (legacyState.labelStyle as any) || 'bold',
      boundaryWeight: (legacyState.boundaryWeight as any) || 'bold',
      sortColumn: (legacyState.sortColumn as any) || 'stress',
      sortDirection: (legacyState.sortDirection as any) || 'desc',
      tooltipDisabled: false,
      tooltipDelayDuration: 700,
    },
  };
}

/**
 * Applies sequential migrations to bring state up to current version
 */
function applyMigrations(state: any, fromVersion: number): ApplicationState {
  let currentState = state;

  // Apply migrations sequentially
  for (let version = fromVersion; version < CURRENT_STATE_VERSION; version++) {
    switch (version) {
      case 0:
        currentState = migrateV0toV1(currentState);
        break;
      // Future migrations would go here:
      // case 1:
      //   currentState = migrateV1toV2(currentState);
      //   break;
      default:
        console.warn(`Unknown migration version: ${version}`);
        break;
    }
  }

  return currentState;
}

/**
 * Single entry point for loading and migrating state data
 * Handles all versions and ensures backward compatibility
 */
export function loadAndMigrateState(encodedState: string): ApplicationState | null {
  try {
    // Try to decode the state data
    let decodedData: any;

    // First, try Base64 decompression (current format)
    let decompressedString = LZString.decompressFromBase64(encodedState);
    if (decompressedString) {
      decodedData = JSON.parse(decompressedString);
    } else {
      // Fallback to URI-encoded component format
      decompressedString = LZString.decompressFromEncodedURIComponent(encodedState);
      if (decompressedString) {
        decodedData = JSON.parse(decompressedString);
      } else {
        // Final fallback: try direct base64 decode (very old format)
        try {
          const directDecoded = decodeURIComponent(escape(atob(encodedState)));
          decodedData = JSON.parse(directDecoded);
        } catch {
          console.error('Failed to decode state data');
          return null;
        }
      }
    }

    // Check for version property
    if (typeof decodedData.version === 'number') {
      // Versioned state - apply migrations if needed
      if (decodedData.version < CURRENT_STATE_VERSION) {
        return applyMigrations(decodedData, decodedData.version);
      } else if (decodedData.version === CURRENT_STATE_VERSION) {
        // Current version - return as-is
        return decodedData as ApplicationState;
      } else {
        console.warn(`Future state version detected: ${decodedData.version}`);
        return decodedData as ApplicationState;
      }
    } else {
      // Legacy state (no version property) - migrate from version 0
      return applyMigrations(decodedData, 0);
    }

  } catch (error) {
    console.error('Failed to load and migrate state:', error);
    return null;
  }
}

/**
 * Encodes current state for sharing/storage
 */
export function encodeState(state: ApplicationState): string {
  const versionedState: VersionedState = {
    ...state,
    version: CURRENT_STATE_VERSION,
  };

  const jsonString = JSON.stringify(versionedState);
  return LZString.compressToBase64(jsonString);
}

/**
 * Utility function to check if state needs migration
 */
export function isLegacyState(encodedState: string): boolean {
  try {
    let decodedData: any;
    let decompressedString = LZString.decompressFromBase64(encodedState);

    if (decompressedString) {
      decodedData = JSON.parse(decompressedString);
    } else {
      decompressedString = LZString.decompressFromEncodedURIComponent(encodedState);
      if (decompressedString) {
        decodedData = JSON.parse(decompressedString);
      } else {
        return true; // Assume legacy if we can't decode with modern methods
      }
    }

    return typeof decodedData.version !== 'number';
  } catch {
    return true; // Assume legacy on parse errors
  }
}