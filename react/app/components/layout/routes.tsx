import {
    IconBell,
    IconClover,
    IconHome,
    IconMessage,
    IconUserCircle,
    // IconLogin,
    // IconSettingsUp,
} from "@tabler/icons-react";
import type { IRoute } from "~/types/validation";

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
];

export const protectedRoutes = routes
    .filter((route) => route.auth === true)
    .map((route) => route.link);
export const publicRoutes = routes
    .filter((route) => route.auth === false)
    .map((route) => route.link);
