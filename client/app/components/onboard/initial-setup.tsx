import {
    Button,
    Center,
    Flex,
    Group,
    PinInput,
    rem,
    Select,
    Stack,
    Stepper,
    TagsInput,
    Text,
    Textarea,
    Title,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { IconMail, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/auth-provider";
import {
    ACCEPTED_IMAGE_TYPES,
    GENDERS,
    MAX_FILE_SIZE,
    preferencesSchema,
    SEXUAL_PREFERENCES,
} from "~/lib/validation";
import type { IPreferences } from "~/types/validation";

export default function InitialSetup() {
    const [step, setStep] = useState(0);
    const { user } = useAuth();
    const [pinValue, setPinValue] = useState<string>();
    const [pinError, setPinError] = useState<boolean>();

    const next = () => {
        if (step === 3) {
            console.log("finished");
        }
        setStep((prev) => prev + 1);
    };

    const prev = () => {
        if (step === 0) return;
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
        if (user?.verified) {
            setStep(1);
        }
    }, [user]);

    return (
        <Flex gap={"xl"} direction={"column"}>
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
                                <Text>We've sent you a mail</Text>
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
                        <Stack gap={"lg"} w={"100%"} p={"lg"}>
                            <Select
                                label="Gender"
                                placeholder="Woman"
                                data={GENDERS}
                                key={form.key("gender")}
                                size="lg"
                                {...form.getInputProps("gender")}
                            />
                            <Select
                                label="Sexual Preference"
                                placeholder="Woman"
                                size="lg"
                                data={SEXUAL_PREFERENCES}
                                key={form.key("sexualOrientation")}
                                {...form.getInputProps("sexualOrientation")}
                            />
                        </Stack>
                    </form>
                </Stepper.Step>

                <Stepper.Step label="Third Step" description="About you">
                    <Flex p={"lg"} direction={"column"} gap={"md"}>
                        <Textarea
                            label="Biography"
                            placeholder="Tell us about yourself in 2 sentences."
                            autosize
                            minRows={4}
                            maxRows={6}
                            size="lg"
                        />
                        <TagsInput
                            label="Your interests"
                            placeholder="Add your interests"
                            maxTags={10}
                            defaultValue={["reading"]}
                            size="lg"
                        />
                    </Flex>
                </Stepper.Step>

                <Stepper.Step label="Fourth Step" description="Pictures">
                    <Flex p={"lg"} direction={"column"} gap={"md"}>
                        <Dropzone
                            onDrop={(files) => console.log(files)}
                            onReject={(files) => console.log(files)}
                            maxSize={MAX_FILE_SIZE}
                            accept={ACCEPTED_IMAGE_TYPES}
                        >
                            <Group
                                justify="center"
                                gap="xl"
                                mih={120}
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
                        <Button mt={"auto"} mx={"auto"}>
                            Upload
                        </Button>
                    </Flex>
                </Stepper.Step>
            </Stepper>

            {true && (
                <Group mt={"auto"}>
                    <Button onClick={prev}>Back</Button>
                    <Button onClick={next}>Next</Button>
                </Group>
            )}
        </Flex>
    );
}
