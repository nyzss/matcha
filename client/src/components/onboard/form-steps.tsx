import { usePreferencesStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import {
    Box,
    Button,
    Flex,
    Group,
    Progress,
    Select,
    Stack,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import React from "react";
import { TPreferences } from "@/types/validation";
import {
    GENDERS,
    preferencesSchema,
    SEXUAL_PREFERENCES,
} from "@/lib/validation";

export default function FormSteps() {
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

    return (
        <Flex gap={"xl"}>
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
                <Group>
                    <Button onClick={prev}>previous</Button>
                    <Button onClick={next}>next</Button>
                </Group>
            </Stack>
            <Box ml={"auto"} w={"50%"}>
                <Progress value={step * 20} />
            </Box>
        </Flex>
    );
}
