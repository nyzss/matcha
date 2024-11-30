"use client";

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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useMemo } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { TPreferences } from "@/types/validation";
import {
    GENDERS,
    preferencesSchema,
    SEXUAL_PREFERENCES,
} from "@/lib/validation";
import { IconMail } from "@tabler/icons-react";
import { usePreferencesStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";

export default function InitialSetup() {
    const [opened, { open, close }] = useDisclosure(false);

    const { step, next, prev } = usePreferencesStore(
        useShallow((state) => ({
            step: state.step,
            next: state.next,
            prev: state.prev,
        }))
    );

    const form = useForm<TPreferences>({
        initialValues: {
            gender: "",
            sexualPreference: "",
            biography: "",
            tags: [],
            pictures: [],
        },

        validate: zodResolver(preferencesSchema),
    });

    const handleSubmit = async (values: TPreferences) => {
        try {
            console.log(values);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        open();
    }, [open]);

    const canClose = useMemo(() => step !== 0, [step]);

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
            <Flex gap={"xl"} direction={"column"}>
                <Stepper active={step}>
                    <Stepper.Step label="First Step" description="Verify Email">
                        <Center py={"xl"}>
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
                                />
                                <Button variant="light">Validate</Button>
                            </Flex>
                        </Center>
                    </Stepper.Step>

                    <Stepper.Step label="First Step" description="Verify Email">
                        <Stack gap={"lg"} w={"100%"}>
                            <form onSubmit={form.onSubmit(handleSubmit)}>
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
                                    key={form.key("sexualPreference")}
                                    {...form.getInputProps("sexualPreference")}
                                />
                            </form>
                        </Stack>
                    </Stepper.Step>

                    <Stepper.Step
                        label="First Step"
                        description="Verify Email"
                    ></Stepper.Step>

                    <Stepper.Step
                        label="First Step"
                        description="Verify Email"
                    ></Stepper.Step>
                </Stepper>

                {canClose && (
                    <Group>
                        <Button onClick={prev}>previous</Button>
                        <Button onClick={next}>next</Button>
                    </Group>
                )}
            </Flex>
        </Modal>
    );
}
