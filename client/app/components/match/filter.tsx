import {
    Box,
    Button,
    Drawer,
    Flex,
    NumberInput,
    RangeSlider,
    Slider,
    TagsInput,
    Text,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconAdjustmentsHorizontal, IconInfoCircle } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFilter, updateFilter } from "~/lib/api";
import type { IFilter } from "~/types/validation";

export default function Filter() {
    const [opened, { open, close }] = useDisclosure(false);

    useQuery<IFilter>({
        queryKey: ["filter"],
        queryFn: getFilter,
        select: (data: IFilter) => {
            form.setValues({
                ...data,
                age: [data.ageMin, data.ageMax],
            });
            form.resetDirty();
        },
    });

    const mutateFilter = useMutation({
        mutationKey: ["filter"],
        mutationFn: async (data: IFilter) => {
            const updated = await updateFilter(data);

            notifications.show({
                title: "Filter updated",
                message: "Your filter has been updated",
                color: "green",
            });

            return updated;
        },
    });

    const form = useForm({
        initialValues: {
            location: 30,
            fameRatingMin: 0,
            fameRatingMax: 50,
            tags: [],
            age: [18, 25],
        },
        transformValues: (values) => {
            const { age, ...withoutAge } = values;

            return {
                ...withoutAge,
                ageMin: values.age[0],
                ageMax: values.age[1],
            };
        },
    });

    const submit = form.onSubmit((value) => {
        console.log(value);

        mutateFilter.mutate(value);
    });

    return (
        <Box>
            <Button
                variant="subtle"
                leftSection={<IconAdjustmentsHorizontal />}
                onClick={open}
                style={{
                    alignSelf: "flex-end",
                }}
            >
                Filters
            </Button>
            <Drawer
                opened={opened}
                onClose={close}
                title="Filter"
                position="right"
                overlayProps={{
                    backgroundOpacity: 0.3,
                    blur: 1,
                }}
            >
                <form onSubmit={submit}>
                    <Flex direction={"column"} gap={"lg"} py={"lg"}>
                        <div>
                            <Text>Max distance</Text>
                            <Slider
                                min={0}
                                max={100}
                                label={(label) => `${label} km`}
                                defaultValue={30}
                                size="lg"
                                {...form.getInputProps("location")}
                            />
                        </div>

                        <div>
                            <Tooltip label="Fame rating is a measure of how popular a user is">
                                <Flex align={"center"} gap={3}>
                                    <Text
                                        style={{
                                            cursor: "default",
                                        }}
                                    >
                                        Fame rating
                                    </Text>
                                    <IconInfoCircle size={16} />
                                </Flex>
                            </Tooltip>
                            <Flex gap={"md"}>
                                <NumberInput
                                    label="Minimum"
                                    placeholder="5"
                                    w={"100%"}
                                    defaultValue={0}
                                    {...form.getInputProps("fameRatingMin")}
                                />
                                <NumberInput
                                    label="Maximum"
                                    placeholder="20"
                                    w={"100%"}
                                    defaultValue={20}
                                    {...form.getInputProps("fameRatingMax")}
                                />
                            </Flex>
                        </div>
                        <div>
                            <Text>Age</Text>
                            <RangeSlider
                                min={18}
                                max={70}
                                defaultValue={[21, 25]}
                                size="lg"
                                minRange={2}
                                {...form.getInputProps("age")}
                            />
                        </div>
                        <TagsInput
                            label="Interests"
                            placeholder="What would you like?"
                            {...form.getInputProps("tags")}
                        />
                        <Button
                            type="submit"
                            disabled={!form.isDirty()}
                            loading={mutateFilter.isPending}
                        >
                            Apply filter
                        </Button>
                    </Flex>
                </form>
            </Drawer>
        </Box>
    );
}
