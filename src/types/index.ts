/**
 * Defines a single customizable category on the wheel.
 */
export interface ProfileCategory {
  id: string; // UUID
  name: string;
  description: string;
  icon: string; // Emoji or SVG data URL
  color: string; // Hex code
}

/**
 * Represents a user's selected impact values for one category.
 */
export type UserSelection = {
  categoryId: string;
  // typicalImpact and stressedImpact are numbers from 1-10, where 0 means unselected.
  typicalImpact: number;
  stressedImpact: number;
};

/**
 * The complete user profile, containing all selections.
 */
export interface UserProfile {
  selections: Record<string, UserSelection>; // Storing selections by categoryId for efficient lookup
}

/**
 * Defines the possible views the application can be in.
 */
export type View = 'main' | 'edit' | 'help';

/**
 * User-configurable display settings.
 */
export type AppSettings = {
  showNumbers: boolean;
  showLabels: boolean;
  showIcons: boolean;
  theme: 'dark' | 'light' | 'system';
};

/**
 * The global state for the entire application.
 */
export interface ApplicationState {
  version: number;
  currentView: View;
  profile: UserProfile;
  categories: ProfileCategory[];
  settings: AppSettings;
}