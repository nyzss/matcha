import { useAuth } from "@/contexts/auth-provider";
import { userSchema } from "@/lib/validation";
import { IUser } from "@/types/validation";
import {
    Button,
    Flex,
    Modal,
    TagsInput,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconUser } from "@tabler/icons-react";
import React from "react";

export default function EditProfile() {
    const [opened, { open, close }] = useDisclosure();

    const { user } = useAuth();

    const form = useForm<Partial<IUser>>({
        mode: "uncontrolled",
        initialValues: {
            biography: user?.biography || "",
            username: user?.username || "",
            gender: user?.gender || "",
            tags: user?.tags || [],
            sexualPreference: user?.sexualOrientation || "",
            //add values easily here and in the form based on IUser
        },

        validate: zodResolver(userSchema),
    });

    const handleSubmit = (values: Partial<IUser>) => {
        console.log(values);
    };

    const handleCancel = () => {
        form.reset();
        close();
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title="Edit Profile"
                size={"xl"}
                centered
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Flex gap={"xl"} direction={"column"} mt={"sm"} p={"xl"}>
                        <TextInput
                            label="Username"
                            placeholder="Username"
                            key={form.key("username")}
                            leftSection={<IconUser size={18} />}
                            size="lg"
                            leftSectionPointerEvents="none"
                            {...form.getInputProps("username")}
                        />
                        <Textarea
                            label="Biography"
                            placeholder="Write something about yourself"
                            key={form.key("biography")}
                            size="lg"
                            {...form.getInputProps("biography")}
                        />
                        <TagsInput
                            label="Keywords of your interests"
                            placeholder="Skiing, reading..."
                            key={form.key("tags")}
                            size="lg"
                            {...form.getInputProps("tags")}
                        ></TagsInput>
                        <Flex direction={"column"} gap={"sm"}>
                            <Button size="lg" type="submit">
                                Save Changes
                            </Button>
                            <Button
                                variant="subtle"
                                size="lg"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </Flex>
                    </Flex>
                </form>
            </Modal>
            <Button ml={"auto"} variant="light" onClick={open}>
                Edit Profile
            </Button>
        </>
    );
}

// {
//     "username": "helloworld",
//     "gender": 1,
//     "biography": "hello this is my bio",
//     "sexualOrientation": 1,
//     "tags": ["reading", "climbing"]
// }
