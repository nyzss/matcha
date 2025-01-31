import {
    Avatar,
    Button,
    Card,
    Divider,
    Flex,
    Image,
    Select,
    TagsInput,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPhoto, IconUser, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/auth-provider";
import { getImage } from "~/lib/api";
import { GENDERS, SEXUAL_PREFERENCES, userSchema } from "~/lib/validation";
import type { IUser } from "~/types/validation";

export default function EditProfile({
    callback,
    onboarding,
}: {
    callback?: () => void;
    onboarding?: boolean;
}) {
    const queryClient = useQueryClient();

    const { user, update, checkUser } = useAuth();
    const [avatarSrc, setAvatarSrc] = useState<string>(
        getImage(user?.avatar) || ""
    );

    const [length, setLength] = useState<number>(user?.biography?.length || 0);

    const form = useForm<Partial<IUser>>({
        mode: "uncontrolled",
        initialValues: {
            biography: user?.biography || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            gender: user?.gender || "",
            tags: user?.tags || [],
            sexualOrientation: user?.sexualOrientation || "",
            pictures: [],
        },

        validate: zodResolver(userSchema),

        validateInputOnChange: ["biography"],
    });

    form.watch("biography", (bio) => setLength(bio.value?.length || 0));
    form.watch(
        "avatar",
        ({ value }) => value && setAvatarSrc(URL.createObjectURL(value))
    );

    useEffect(() => {
        if (Object.entries(form.errors).length > 0) {
            const message = Object.values(form.errors).join(", ");
            notifications.show({
                title: "Couldn't update profile",
                message: message,
                color: "red",
            });
        }
    }, [form.errors]);

    const handleSubmit = form.onSubmit(async (values: IUser) => {
        const success = await update(values);
        if (success) {
            checkUser();
            queryClient.invalidateQueries({
                queryKey: ["profile", "@me"],
            });
            notifications.show({
                title: "Profile updated",
                message: "Your profile has been successfully updated",
                color: "teal",
            });

            form.resetDirty();
            if (callback) {
                callback();
            }
        }
    });

    const handleCancel = () => {
        form.reset();
        // close();
    };

    useEffect(() => {
        Promise.all(
            user?.pictures?.map(async (pic) => {
                const res = await fetch(getImage(pic) || "");
                if (res.ok) {
                    return await res.blob();
                }
                return undefined;
            }) || []
        ).then((blobs) => {
            form.setFieldValue(
                "pictures",
                blobs
                    .filter((blob) => blob !== undefined)
                    .map(
                        (blob, index) =>
                            new File([blob], "pic" + index, {
                                type: blob.type,
                            })
                    )
            );
        });
    }, [user]);

    return (
        <form onSubmit={handleSubmit}>
            <Flex gap={"md"} direction={"column"} mt={"sm"}>
                <Flex align={"center"} justify={"space-between"}>
                    <Dropzone
                        accept={IMAGE_MIME_TYPE}
                        multiple={false}
                        onDrop={(files) =>
                            form.setFieldValue("avatar", files[0])
                        }
                        {...form.getInputProps("avatar")}
                    >
                        <Flex align={"center"} justify={"center"} gap={"sm"}>
                            <IconUser size={35} />
                            <Text fw={"bold"}>Upload Avatar</Text>
                        </Flex>
                    </Dropzone>
                    <Flex align={"center"} gap={"sm"}>
                        <Text c={"dimmed"}>Preview</Text>
                        <Avatar
                            color="initials"
                            name={`${user?.firstName} ${user?.lastName}`}
                            size={100}
                            mt={8}
                            src={avatarSrc}
                        />
                    </Flex>
                </Flex>

                <TextInput
                    label="First Name"
                    placeholder={user?.firstName || "First Name"}
                    key={form.key("firstName")}
                    leftSection={<IconUser size={18} />}
                    size="md"
                    leftSectionPointerEvents="none"
                    {...form.getInputProps("firstName")}
                />
                <TextInput
                    label="Last Name"
                    placeholder={user?.lastName || "Last Name"}
                    key={form.key("lastName")}
                    leftSection={<IconUser size={18} />}
                    size="md"
                    leftSectionPointerEvents="none"
                    {...form.getInputProps("lastName")}
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
                    data={SEXUAL_PREFERENCES}
                    {...form.getInputProps("sexualOrientation")}
                />
                <TagsInput
                    label="Keywords of your interests"
                    placeholder="Skiing, reading..."
                    key={form.key("tags")}
                    size="md"
                    {...form.getInputProps("tags")}
                />
                <Divider label="Pictures" my={"md"} />
                <Flex gap={"sm"} direction={"column"}>
                    <Dropzone
                        accept={IMAGE_MIME_TYPE}
                        onDrop={(files) =>
                            form.setFieldValue("pictures", [
                                ...(form.getValues().pictures || []),
                                ...files,
                            ])
                        }
                        {...form.getInputProps("pictures")}
                    >
                        <Flex align={"center"} justify={"center"} gap={"sm"}>
                            <IconPhoto size={45} />
                            <Flex direction={"column"}>
                                <Text fw={"bold"}>Upload Pictures</Text>
                                <Text size="xs" c={"dimmed"}>
                                    You can upload up to 5 pictures
                                </Text>
                            </Flex>
                        </Flex>
                    </Dropzone>
                    <Card>
                        <Flex direction={"row"} gap={"sm"} wrap={"wrap"}>
                            {form
                                .getValues()
                                .pictures?.map((pic) =>
                                    URL.createObjectURL(pic)
                                )
                                .map((src, index) => (
                                    <Flex
                                        direction={"column"}
                                        key={index}
                                        gap={"sm"}
                                        // h={"100%"}
                                    >
                                        <Image
                                            src={src}
                                            w={"100%"}
                                            h={"300"}
                                            fit="cover"
                                        />
                                        <Button
                                            color="red"
                                            leftSection={<IconX />}
                                            variant="light"
                                            onClick={() => {
                                                form.setFieldValue(
                                                    "pictures",
                                                    form
                                                        .getValues()
                                                        .pictures?.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        )
                                                );
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Flex>
                                ))}
                        </Flex>
                    </Card>
                </Flex>

                <Flex gap={"sm"} justify={"flex-end"}>
                    {!onboarding && (
                        <Button
                            variant="subtle"
                            size="md"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button size="md" type="submit" disabled={!form.isDirty()}>
                        {onboarding ? "Proceed" : "Save changes"}
                    </Button>
                </Flex>
            </Flex>
        </form>
    );
}
