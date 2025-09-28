import { View, UserSelection, ProfileCategory, AppSettings } from '../types';

export type Action =
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'UPDATE_SELECTION'; payload: UserSelection }
  | { type: 'UPDATE_CATEGORIES'; payload: ProfileCategory[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_ENTIRE_STATE'; payload: any }; // Used for loading from storage/URL