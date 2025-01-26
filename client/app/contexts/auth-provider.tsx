import {
    authLogin,
    authLogout,
    authRegister,
    checkAuth,
    updateUser,
} from "~/lib/api";
import { createContext, useContext, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "~/lib/store";
import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { ILogin, IRegister, IUser } from "~/types/validation";
import { useNavigate } from "react-router";

export const AuthContext = createContext<IAuthContext | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useAtom(userAtom);
    const [loading, setLoading] = useState<boolean>(true);
    const [metadata, setMetadata] = useState<IMetadata | null>(null);
    const navigate = useNavigate();

    const login = async (data: ILogin): Promise<Partial<IProfile> | null> => {
        const result = await authLogin(data);

        if (!result.success) {
            setUser(null);
            return result.data;
            // return IProfile type with error to set the form errors (see components/auth/login.tsx)
        } else {
            setUser(result.data);
            return null;
        }
    };

    const register = async (
        data: IRegister
    ): Promise<Partial<IProfile> | null> => {
        const result = await authRegister(data);
        if (!result.success) {
            return result.data;
        }
        setUser(result.data);
        return null;
    };

    const logout = async () => {
        // TODO: might want to check if the logout was successful
        await authLogout();
        setUser(null);
    };

    const update = async (data: Partial<IUser>) => {
        const result = await updateUser(data);

        if (result.success) {
            setUser(result.data);
            return true;
        } else if (!result.success) {
            notifications.show({
                title: "Couldn't update user",
                message: "An error has occurred, please try again later.",
                color: "red",
            });
        }
        return false;
    };
    const checkUser = async () => {
        const data = await checkAuth();
        if (!data) {
            setUser(null);
            setMetadata(null);
        } else {
            setUser(data.user);
            setMetadata({ ...data });
        }
        setLoading(false);
        return data;
    };

    useEffect(() => {
        checkUser().then((data) => {
            if (data) {
                if (
                    !data.user.verified &&
                    !data.user.biography &&
                    !data.user.gender &&
                    !data.user.sexualOrientation &&
                    data.user.pictures?.length === 0
                ) {
                    navigate("/onboarding");
                }
            }
        });
    }, []);

    const logged = !!user;

    if (loading) {
        return (
            <>
                <LoadingOverlay visible={loading} />
            </>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                logged,
                login,
                logout,
                register,
                update,
                metadata,
                checkUser,
            }}
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
