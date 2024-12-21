"use client";

import { authLogin, authLogout, authRegister, checkAuth } from "@/lib/api";
import { IProfile } from "@/types/auth";
import { IAuthContext } from "@/types/contexts";
import { ILogin, IRegister } from "@/types/validation";
import { createContext, useContext, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/store";

export const AuthContext = createContext<IAuthContext | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useAtom(userAtom);

    const login = async (data: ILogin): Promise<Partial<IProfile> | null> => {
        const result = await authLogin(data);

        console.log("triggered login", result, !!result);
        if (result === null) {
            setUser(null);
            // return IProfile type with error to set the form errors (see components/auth/login.tsx)
            return {
                username: "Invalid username or password",
            };
        } else {
            setUser(result);
        }
        return null;
    };

    const register = async (
        data: IRegister
    ): Promise<Partial<IProfile> | null> => {
        const result = await authRegister(data);
        if (result) {
            return result;
        }
        return null;
    };

    const logout = async () => {
        // TODO: might want to check if the logout was successful
        await authLogout();
        setUser(null);
    };

    useEffect(() => {
        const checkUser = async () => {
            const user = await checkAuth();
            if (!user) {
                setUser(null);
            } else {
                setUser(user);
            }
        };
        checkUser();
    }, [setUser]);

    return (
        <AuthContext.Provider
            value={{ user, logged: !!user, login, logout, register }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;

