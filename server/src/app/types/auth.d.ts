export interface RegisterForm {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface LoginForm {
    username: string;
    password: string;
}

export interface AuthResult {
    user: {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
    };
    accessToken: string;
    refreshToken: string;
}
