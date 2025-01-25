import {
    Avatar,
    Button,
    FileInput,
    Flex,
    Select,
    TagsInput,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconUser } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "~/contexts/auth-provider";
import { getImage } from "~/lib/api";
import { GENDERS, userSchema } from "~/lib/validation";
import type { IUser } from "~/types/validation";

export default function EditProfile() {
    const queryClient = useQueryClient();

    const { user, update } = useAuth();
    const [avatarSrc, setAvatarSrc] = useState<string>(
        getImage(user?.avatar) || ""
    );
    const [picturesSrc, setPicturesSrc] = useState<string[]>(
        user?.pictures?.map((pic) => getImage(pic) || "") || []
    );

    const [length, setLength] = useState<number>(user?.biography?.length || 0);

    const form = useForm<Partial<IUser>>({
        mode: "uncontrolled",
        initialValues: {
            biography: user?.biography || "",
            username: user?.username || "",
            gender: user?.gender || "",
            tags: user?.tags || [],
            sexualOrientation: user?.sexualOrientation || "",
            // avatar: ,
            pictures: [],
            //add values easily here and in the form based on IUser
        },

        validate: zodResolver(userSchema),

        validateInputOnChange: ["biography"],

        onValuesChange(values) {
            if (values.avatar) {
                setAvatarSrc(URL.createObjectURL(values.avatar));
            }

            if (values.pictures) {
                values.pictures.forEach((pic) => {
                    setPicturesSrc((prev) => [
                        ...prev,
                        URL.createObjectURL(pic),
                    ]);
                });
            }
        },
    });

    form.watch("biography", (bio) => setLength(bio.value?.length || 0));

    const handleSubmit = async (values: IUser) => {
        console.log("SUBMITED", values);
        const success = await update(values);
        if (success) {
            queryClient.invalidateQueries({
                queryKey: ["profile", "@me"],
            });
            notifications.show({
                title: "Profile updated",
                message: "Your profile has been successfully updated",
                color: "green",
            });
        }
    };

    const handleCancel = () => {
        form.reset();
        // close();
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Flex
                gap={"md"}
                direction={"column"}
                mt={"sm"}
                p={{
                    sm: "lg",
                }}
            >
                <Flex align={"center"} justify={"space-between"}>
                    <Avatar
                        color="initials"
                        name={`${user?.firstName} ${user?.lastName}`}
                        size={100}
                        mt={8}
                        src={avatarSrc}
                    />
                    <FileInput
                        multiple={false}
                        leftSection={<IconPlus size={40} />}
                        leftSectionWidth={50}
                        radius={"xl"}
                        placeholder="Avatar"
                        size="xl"
                        leftSectionPointerEvents="none"
                        accept={IMAGE_MIME_TYPE.join(",")}
                        {...form.getInputProps("avatar")}
                    />
                </Flex>

                <TextInput
                    label="Username (this will change your login)"
                    placeholder="Username"
                    key={form.key("username")}
                    leftSection={<IconUser size={18} />}
                    size="md"
                    leftSectionPointerEvents="none"
                    {...form.getInputProps("username")}
                />
                <Flex direction={"column"} gap={"2"}>
                    <Textarea
                        label="Biography"
                        placeholder="Write something about yourself"
                        key={form.key("biography")}
                        size="md"
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
                    size="md"
                    key={form.key("gender")}
                    data={GENDERS}
                    {...form.getInputProps("gender")}
                />
                <Select
                    label="Sexual Preferences"
                    placeholder="Select your sexual preferences"
                    size="md"
                    key={form.key("sexualOrientation")}
                    data={GENDERS}
                    {...form.getInputProps("sexualOrientation")}
                />
                <TagsInput
                    label="Keywords of your interests"
                    placeholder="Skiing, reading..."
                    key={form.key("tags")}
                    size="md"
                    {...form.getInputProps("tags")}
                />
                <Flex gap={"sm"}>
                    <Button size="md" type="submit" disabled={!form.isDirty()}>
                        Save Changes
                    </Button>
                    <Button variant="subtle" size="md" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Flex>
            </Flex>
        </form>
    );
}
