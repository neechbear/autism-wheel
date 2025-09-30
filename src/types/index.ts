// Core data model definitions for the Autism Wheel application
// These interfaces define the shape of data model objects according to copilot instructions

export interface ProfileCategory {
  id: string; // UUID
  name: string;
  description: string;
  icon: string; // emoji or SVG data URL
  color: string; // hex code
}

export interface UserSelection {
  categoryId: string;
  typicalImpact: number; // 0-10 scale
  stressedImpact: number; // 0-10 scale
}

export interface UserProfile {
  selections: Selection; // sliceIndex -> array of selected segment numbers
}

export interface ApplicationState {
  currentView: ViewType;
  profile: UserProfile;
  categories: ProfileCategory[];
  settings: AppSettings;
}

export interface AppSettings {
  showNumbers: boolean;
  showLabels: boolean;
  showIcons: boolean;
  theme: ThemeType;
  numberPosition: NumberPositionType;
  labelStyle: LabelStyleType;
  boundaryWeight: BoundaryWeightType;
  sortColumn: SortColumnType;
  sortDirection: SortDirectionType;
}

// Type aliases for union types and component props
export type ViewType = 'main' | 'edit' | 'help';
export type ThemeType = 'system' | 'light' | 'dark';
export type NumberPositionType = 'left' | 'center' | 'right' | 'hide_segment' | 'hide_all';
export type LabelStyleType = 'normal' | 'bold' | 'hidden';
export type BoundaryWeightType = 'normal' | 'bold' | 'hidden';
export type SortColumnType = 'category' | 'typical' | 'stress' | null;
export type SortDirectionType = 'asc' | 'desc';

// Legacy types for backward compatibility during refactoring
export interface Selection {
  [sliceIndex: number]: number[];
}

export interface LabelData {
  id: string;
  label: string;
  color: string;
  icon: string;
  description: string;
  originalIndex: number;
}

// Component prop types
export type ConditionalTooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  delayDuration?: number;
};

export type HelpContentProps = {
  onReturn: () => void;
};

export type EmojiPickerProps = {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
};

export type DraggableLabelRowProps = {
  labelData: LabelData;
  index: number;
  editingLabels: LabelData[];
  setEditingLabels: (labels: LabelData[]) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
};

// Export format types
export type ExportFormat = 'png' | 'svg' | 'jpeg' | 'html' | 'locked_html';

// Constants and enums
export const ItemTypes = {
  LABEL_ROW: 'labelRow',
} as const;

export const TOTAL_RINGS = 10;
export const TOTAL_SLICES = 10;
export const CENTER_X = 375;
export const CENTER_Y = 375;
export const MIN_RADIUS = 55;
export const MAX_RADIUS = 265;
export const RING_WIDTH = (MAX_RADIUS - MIN_RADIUS) / TOTAL_RINGS;