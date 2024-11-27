export interface UserState {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    // notifications:
}

export interface AuthState {
    user: UserState | null;
    setUser: (user: UserState) => void;
    clearUser: () => void;
    updateUser: (updates: Partial<UserState>) => void;
}
