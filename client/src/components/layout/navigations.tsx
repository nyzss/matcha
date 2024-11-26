import { IRoute } from "../types";
import {
    IconBell,
    IconClover,
    IconHome,
    IconMessage,
    IconUserCircle,
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
        link: "/profile",
        icon: <IconUserCircle />,
        auth: true,
    },
];
