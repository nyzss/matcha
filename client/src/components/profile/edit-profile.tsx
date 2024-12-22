import { useAuth } from "@/contexts/auth-provider";
import { userSchema } from "@/lib/validation";
import { IUser } from "@/types/validation";
import {
    Button,
    Flex,
    Modal,
    TagsInput,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconUser } from "@tabler/icons-react";
import { useState } from "react";

export default function EditProfile() {
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
            sexualPreference: user?.sexualOrientation || "",
            //add values easily here and in the form based on IUser
        },

        validate: zodResolver(userSchema),

        validateInputOnChange: ["biography"],
    });

    form.watch("biography", (bio) => setLength(bio.value?.length || 0));

    const handleSubmit = async (values: IUser) => {
        const success = await update(values);
        if (success) {
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
                        <Flex direction={"column"} gap={"2"}>
                            <Textarea
                                label="Biography"
                                placeholder="Write something about yourself"
                                key={form.key("biography")}
                                size="lg"
                                {...form.getInputProps("biography")}
                            />
                            <Text size="sm" ml={"auto"}>
                                {length} / 256
                            </Text>
                        </Flex>
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
//     //avatar: "Pas encore fait"
//     "username": "helloworld",
//     "gender": "Man",
//     "biography": "haha lmao",
//     "sexualOrientation": "Woman",
//     //picture: "Pas encore fait"
//     "tags": ["reading", "climbing"]
// }
