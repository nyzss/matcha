import { create } from "zustand";
import { AuthState, PreferencesState } from "@/types/store";
import { TPreferences } from "@/types/validation";
import { IProfile } from "@/types/auth";

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    logged: false,
    clear: () => set({ user: null, logged: false }),
    update: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } as IProfile })),
    connect: (updates) =>
        set((state) => ({
            logged: true,
            user: { ...state.user, ...updates } as IProfile,
        })),
}));

export const usePreferencesStore = create<PreferencesState>((set) => ({
    preferences: null,
    step: 0,
    clear: () => set(() => ({ preferences: null, step: 0 })),
    update: (updates) =>
        set((state) => ({
            preferences: { ...state.preferences, ...updates } as TPreferences,
        })),
    next: () =>
        set((state) => {
            const s = state.step !== 5 ? state.step + 1 : 5;
            return { step: s };
        }),
    prev: () =>
        set((state) => {
            const s = state.step !== 0 ? state.step - 1 : 0;
            return { step: s };
        }),
}));

