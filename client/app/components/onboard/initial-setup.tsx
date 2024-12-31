import {
    Modal,
    Button,
    Center,
    Flex,
    Group,
    PinInput,
    Select,
    Stack,
    Stepper,
    Text,
    Title,
    rem,
    Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import type { IPreferences } from "~/types/validation";
import {
    ACCEPTED_IMAGE_TYPES,
    GENDERS,
    MAX_FILE_SIZE,
    preferencesSchema,
    SEXUAL_PREFERENCES,
} from "~/lib/validation";
import { IconMail, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import { useAuth } from "~/contexts/auth-provider";

export default function InitialSetup() {
    const [opened, { open, close }] = useDisclosure(false);
    const [step, setStep] = useState(0);
    const { logged } = useAuth();
    const [pinValue, setPinValue] = useState<string>();
    const [pinError, setPinError] = useState<boolean>();

    const next = () => {
        setStep((prev) => prev + 1);
    };

    const prev = () => {
        setStep((p) => p - 1);
    };

    const form = useForm<IPreferences>({
        initialValues: {
            gender: "",
            sexualOrientation: "",
            biography: "",
            tags: [],
            pictures: [],
        },

        validate: zodResolver(preferencesSchema),
    });

    const handleSubmit = async (values: IPreferences) => {
        try {
            console.log(values);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEmailVerification = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        try {
            console.log("Verifying email with PIN: ", pinValue);
            setTimeout(() => {
                console.log("Email verified.");
            }, 1000);
        } catch {
            console.error("Failed to verify email.");
            setPinError(true);
        }
    };

    useEffect(() => {
        if (logged) {
            open();
        }
    }, []);

    return (
        <Modal
            title="Tell us about yourself.."
            opened={opened}
            onClose={close}
            size={"xl"}
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
            closeOnClickOutside={false}
            withCloseButton={false}
            closeOnEscape={false}
        >
            <Flex gap={"xl"} direction={"column"} h="500px">
                <Stepper active={step}>
                    <Stepper.Step label="First Step" description="Verify Email">
                        <Center py={"xl"}>
                            <form onSubmit={handleEmailVerification}>
                                <Flex
                                    justify={"center"}
                                    align={"center"}
                                    direction={"column"}
                                    gap={"lg"}
                                >
                                    <IconMail size={80} />
                                    <Title>Confirm your email address.</Title>
                                    <Text>
                                        To access Matcha we have to ensure your
                                        email address is valid.
                                    </Text>
                                    <PinInput
                                        oneTimeCode
                                        size="lg"
                                        length={5}
                                        type={"number"}
                                        error={pinError}
                                        value={pinValue}
                                        onChange={setPinValue}
                                    />
                                    <Button variant="light" type="submit">
                                        Validate
                                    </Button>
                                </Flex>
                            </form>
                        </Center>
                    </Stepper.Step>

                    <Stepper.Step
                        label="Second Step"
                        description="Gender & Preferences"
                    >
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack gap={"lg"} w={"100%"}>
                                <Select
                                    label="Gender"
                                    placeholder="Woman"
                                    data={GENDERS}
                                    key={form.key("gender")}
                                    {...form.getInputProps("gender")}
                                />
                                <Select
                                    label="Sexual Preference"
                                    placeholder="Woman"
                                    data={SEXUAL_PREFERENCES}
                                    key={form.key("sexualOrientation")}
                                    {...form.getInputProps("sexualOrientation")}
                                />
                            </Stack>
                        </form>
                    </Stepper.Step>

                    <Stepper.Step label="Third Step" description="About you">
                        <Textarea
                            label="Biography"
                            placeholder="Tell us about yourself in 2 sentences."
                            autosize
                            minRows={4}
                            maxRows={6}
                            size="xl"
                        />
                    </Stepper.Step>

                    <Stepper.Step label="Fourth Step" description="Pictures">
                        <Dropzone
                            onDrop={(files) => console.log(files)}
                            onReject={(files) => console.log(files)}
                            maxSize={MAX_FILE_SIZE}
                            accept={ACCEPTED_IMAGE_TYPES}
                        >
                            <Group
                                justify="center"
                                gap="xl"
                                mih={220}
                                style={{ pointerEvents: "none" }}
                            >
                                <Dropzone.Accept>
                                    <IconUpload
                                        style={{
                                            width: rem(52),
                                            height: rem(52),
                                        }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconX
                                        stroke={1.5}
                                        style={{
                                            width: rem(52),
                                            height: rem(52),
                                        }}
                                    ></IconX>
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconPhoto
                                        stroke={1.5}
                                        style={{
                                            width: rem(52),
                                            height: rem(52),
                                        }}
                                    />
                                </Dropzone.Idle>

                                <div>
                                    <Text size="xl" inline>
                                        Drag images here or click to select
                                        files
                                    </Text>
                                    <Text size="sm" c="dimmed" inline mt={7}>
                                        Attach a maximum of 5 images, the images
                                        should not exceed 8MB in size.
                                    </Text>
                                </div>
                            </Group>
                        </Dropzone>
                    </Stepper.Step>
                </Stepper>

                {false && (
                    <Group mt={"auto"}>
                        <Button onClick={prev}>Back</Button>
                        <Button
                            onClick={() => {
                                if (step === 3) {
                                    close();
                                } else {
                                    next();
                                }
                            }}
                        >
                            Next
                        </Button>
                    </Group>
                )}
            </Flex>
        </Modal>
    );
}
