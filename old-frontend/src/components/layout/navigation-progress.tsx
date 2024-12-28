"use client";

import { useMantineTheme } from "@mantine/core";
import { AppProgressBar } from "next-nprogress-bar";

export default function RouterTransition() {
    const theme = useMantineTheme();

    return (
        <AppProgressBar
            height="4px"
            color={theme.primaryColor}
            options={{
                showSpinner: false,
                easing: "ease-out",
                speed: 100,
            }}
            shallowRouting
        />
    );
}
