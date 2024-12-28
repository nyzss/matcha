import { IProfile } from "./auth";
import { IPreferences } from "./validation";

// add notifications
export interface AuthState {
    user: IProfile | null;
    logged: boolean;
    clear: () => void;
    update: (updates: Partial<IProfile>) => void;
    connect: (updates: Partial<IProfile>) => void;
}

export interface PreferencesState {
    preferences: IPreferences | null;
    step: number;
    clear: () => void;
    update: (updates: Partial<IPreferences>) => void;
    next: () => void;
    prev: () => void;
}

