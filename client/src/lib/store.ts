import { create } from "zustand";
import { AuthState, PreferencesState } from "@/types/store";
import { TPreferences } from "@/types/validation";
import { Profile } from "@/types/auth";

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    clear: () => set({ user: null }),
    update: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } as Profile })),
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
