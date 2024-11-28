import { TPreferences } from "./validation";

// add notifications
export interface UserState {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface AuthState {
    user: UserState | null;
    // setUser: (user: UserState) => void;
    clear: () => void;
    update: (updates: Partial<UserState>) => void;
}

export interface PreferencesState {
    preferences: TPreferences | null;
    step: number;
    clear: () => void;
    update: (updates: Partial<TPreferences>) => void;
    next: () => void;
    prev: () => void;
}
