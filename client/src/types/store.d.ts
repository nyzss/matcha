import { TPreferences } from "./validation";

// add notifications
export interface AuthState {
    user: Profile | null;
    clear: () => void;
    update: (updates: Partial<Profile>) => void;
}

export interface PreferencesState {
    preferences: TPreferences | null;
    step: number;
    clear: () => void;
    update: (updates: Partial<TPreferences>) => void;
    next: () => void;
    prev: () => void;
}
