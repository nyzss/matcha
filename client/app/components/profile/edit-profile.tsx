import { useAuth } from "~/contexts/auth-provider";
import { GENDERS, userSchema } from "~/lib/validation";
import {
    Button,
    Flex,
    Modal,
    Select,
    TagsInput,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconUser } from "@tabler/icons-react";
import { useState } from "react";
import type { IUser } from "~/types/validation";
import { useQueryClient } from "@tanstack/react-query";

export default function EditProfile() {
    const queryClient = useQueryClient();

    const [opened, { open, close }] = useDisclosure();
    const { user, update } = useAuth();
    const [length, setLength] = useState<number>(user?.biography?.length || 0);

    const form = useForm<Partial<IUser>>({
        mode: "uncontrolled",
        initialValues: {
            biography: user?.biography || "",
            username: user?.username || "",
            gender: user?.gender || "",
            tags: user?.tags || [],
            sexualOrientation: user?.sexualOrientation || "",
            //add values easily here and in the form based on IUser
        },

        validate: zodResolver(userSchema),

        validateInputOnChange: ["biography"],
    });

    form.watch("biography", (bio) => setLength(bio.value?.length || 0));

    const handleSubmit = async (values: IUser) => {
        const success = await update(values);
        if (success) {
            queryClient.invalidateQueries({
                queryKey: ["profile", "@me"],
            });
            close();
        }
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
                    <Flex
                        gap={"md"}
                        direction={"column"}
                        mt={"sm"}
                        p={{
                            sm: "lg",
                        }}
                    >
                        <TextInput
                            label="Username (this will change your login)"
                            placeholder="Username"
                            key={form.key("username")}
                            leftSection={<IconUser size={18} />}
                            size="lg"
                            leftSectionPointerEvents="none"
                            {...form.getInputProps("username")}
                        />
                        <Flex direction={"column"} gap={"2"} mb={0}>
                            <Textarea
                                label="Biography"
                                placeholder="Write something about yourself"
                                key={form.key("biography")}
                                size="lg"
                                maxLength={255}
                                {...form.getInputProps("biography")}
                            />
                            <Text size="sm" ml={"auto"}>
                                {length} / 255
                            </Text>
                        </Flex>
                        <Select
                            label="Gender"
                            placeholder="Select your gender"
                            size="lg"
                            key={form.key("gender")}
                            data={GENDERS}
                            {...form.getInputProps("gender")}
                        />
                        <Select
                            label="Sexual Preferences"
                            placeholder="Select your sexual preferences"
                            size="lg"
                            key={form.key("sexualOrientation")}
                            data={GENDERS}
                            {...form.getInputProps("sexualOrientation")}
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
            <Button
                ml={{
                    sm: "auto",
                }}
                variant="light"
                onClick={open}
            >
                Edit Profile
            </Button>
        </>
    );
}

// {
//     //avatar: "Pas encore fait"
//     "username": "helloworld",
//     "gender": "Man",
//     "biography": "haha lmao",
//     "sexualOrientation": "Woman",
//     //picture: "Pas encore fait"
//     "tags": ["reading", "climbing"]
// }
