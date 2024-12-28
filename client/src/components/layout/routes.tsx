import { IRoute } from "@/types/validation";
import {
    IconBell,
    IconClover,
    IconHome,
    IconMessage,
    IconUserCircle,
    // IconLogin,
    // IconSettingsUp,
} from "@tabler/icons-react";

export const routes: IRoute[] = [
    {
        name: "Home",
        link: "/",
        icon: <IconHome />,
    },
    {
        name: "Messages",
        link: "/messages",
        icon: <IconMessage />,
        auth: true,
    },
    {
        name: "Matches",
        link: "/matches",
        icon: <IconClover />,
        auth: true,
    },
    {
        name: "Notifications",
        link: "/notifications",
        icon: <IconBell />,
        auth: true,
    },
    {
        name: "Profile",
        link: "/profile/@me",
        icon: <IconUserCircle />,
        auth: true,
    },
    // {
    //     name: "Login",
    //     link: "/login",
    //     icon: <IconLogin />,
    //     auth: false,
    // },
    // {
    //     name: "Register",
    //     link: "/register",
    //     icon: <IconSettingsUp />,
    //     auth: false,
    // },
];

export const protectedRoutes = routes
    .filter((route) => route.auth === true)
    .map((route) => route.link);
export const publicRoutes = routes
    .filter((route) => route.auth === false)
    .map((route) => route.link);
