import { create } from "zustand";
import { AuthState, UserState } from "@/types/store";

export const useAuth = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set(() => ({ user })),
    clearUser: () => set((state) => ({ ...state, user: null })),
    updateUser: (updates) =>
        set((state) => ({ user: { ...state.user, ...updates } as UserState })),
}));
