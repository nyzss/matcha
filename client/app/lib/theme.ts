import {
    Button,
    Card,
    createTheme,
    Image,
    Input,
    Menu,
    Modal,
    NavLink,
    Notification,
    NumberInput,
    Paper,
    Select,
    TagsInput,
    Textarea,
    TextInput,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";

export const theme = createTheme({
    fontFamily: "Geist, serif",
    primaryColor: "grape",
    components: {
        Button: Button.extend({
            defaultProps: {
                radius: "md",
            },
        }),
        Paper: Paper.extend({
            defaultProps: {
                radius: "xs",
            },
        }),
        Card: Card.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        Input: Input.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        TextInput: TextInput.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        NumberInput: NumberInput.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        Textarea: Textarea.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        Select: Select.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        TagsInput: TagsInput.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        Image: Image.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        NavLink: NavLink.extend({
            styles: {
                root: {
                    borderRadius: "var(--mantine-radius-md)",
                },
            },
        }),
        Notification: Notification.extend({
            defaultProps: {
                radius: "lg",
                withBorder: true,
            },
        }),
        Dropzone: Dropzone.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        Modal: Modal.extend({
            defaultProps: {
                radius: "lg",
            },
        }),
        Menu: Menu.extend({
            defaultProps: {
                radius: "md",
            },
        }),
    },
});
