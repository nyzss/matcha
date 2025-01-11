import {
    Button,
    useMantineColorScheme,
    type BoxProps,
    type ButtonProps,
    type PolymorphicComponentProps,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ToggleTheme(props?: ButtonProps) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    return (
        <Button onClick={toggleColorScheme} variant="outline" {...props}>
            {colorScheme === "dark" ? <IconMoon /> : <IconSun />}
        </Button>
    );
}
