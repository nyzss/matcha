import { LoadingOverlay } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAtom } from "jotai";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    authLogin,
    authLogout,
    authRegister,
    checkAuth,
    getNotificationsNumber,
    updateUser,
} from "~/lib/api";
import { userAtom } from "~/lib/store";
import type { ILogin, IRegister, IUser } from "~/types/validation";

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

    const updateNotifications = async () => {
        const notifications = await getNotificationsNumber();

        setMetadata((prev) => ({
            ...prev,
            privacy: prev?.privacy ?? { email: "" },
            notifications: notifications.total,
            views: prev?.views ?? 0,
            messages: prev?.messages ?? 0,
        }));
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

    const shouldOnboard =
        (!!user && user.pictures?.length === 0) || !user?.avatar;

    useEffect(() => {
        checkUser().then((data) => {
            if (data && (shouldOnboard || !data?.user.verified)) {
                navigate("/onboarding");
            }
        });
    }, []);

    // authEvent.subscribe((event) => {
    //     if (event.detail.authenticated === false) {
    //         checkUser();
    //     }
    // });

    // return () => {
    //     authEvent.unsubscribe();
    // };

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
                shouldOnboard,
                updateNotifications,
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
