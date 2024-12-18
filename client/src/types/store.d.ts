import { IProfile } from "./auth";
import { TPreferences } from "./validation";

// add notifications
export interface AuthState {
    user: IProfile | null;
    logged: boolean;
    clear: () => void;
    update: (updates: Partial<IProfile>) => void;
    connect: (updates: Partial<IProfile>) => void;
}

export interface PreferencesState {
    preferences: TPreferences | null;
    step: number;
    clear: () => void;
    update: (updates: Partial<TPreferences>) => void;
    next: () => void;
    prev: () => void;
}

