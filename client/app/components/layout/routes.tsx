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
        icon: <IconHome size={28} />,
    },
    {
        name: "Messages",
        link: "/messages",
        icon: <IconMessage size={28} />,
        auth: true,
    },
    {
        name: "Matches",
        link: "/matches",
        icon: <IconClover size={28} />,
        auth: true,
    },
    {
        name: "Notifications",
        link: "/notifications",
        icon: <IconBell size={28} />,
        auth: true,
        indicator: true,
    },
    {
        name: "Profile",
        link: "/profile/@me",
        icon: <IconUserCircle size={28} />,
        auth: true,
    },
];

export const protectedRoutes = routes
    .filter((route) => route.auth === true)
    .map((route) => route.link);
export const publicRoutes = routes
    .filter((route) => route.auth === false)
    .map((route) => route.link);
