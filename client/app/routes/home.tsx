import {
    Box,
    Button,
    Drawer,
    Flex,
    LoadingOverlay,
    NumberInput,
    Paper,
    RangeSlider,
    Rating,
    Slider,
    TagsInput,
    Text,
    Title,
    Tooltip,
    Transition,
    useMantineTheme,
    type MantineTransition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustmentsHorizontal, IconInfoCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getSuggestions } from "~/lib/api";

export default function Home() {
    const theme = useMantineTheme();
    const { data, isPending } = useQuery({
        queryKey: ["suggestions"],
        queryFn: getSuggestions,
    });
    const [opened, { open, close }] = useDisclosure(false);
    const [index, setIndex] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(true);
    const [transition, setTransition] =
        useState<MantineTransition>("rotate-left");

    if (isPending) {
        return <LoadingOverlay />;
    }

    const handleNext = (matched: boolean = true) => {
        if (data && index === data.users.length - 1) {
            setIndex(0);
            return;
        }

        setTransition(matched ? "fade-left" : "fade-right");
        setVisible(false);
        setTimeout(() => {
            setTransition("pop");
            setIndex((prevIndex) => prevIndex + 1);
            setVisible(true);
        }, 300);
    };

    const handleMatch = () => {
        console.log("Matched with", data?.users[index].firstName);
        handleNext(true);
    };

    const handlePass = () => {
        console.log("Passed on", data?.users[index].firstName);
        handleNext(false);
    };

    return (
        <Flex
            h={"100%"}
            direction={"column"}
            px={{
                xs: 70,
                md: "xl",
                xl: 70,
            }}
            gap={"sm"}
        >
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
                <Flex direction={"column"} gap={"lg"} py={"lg"}>
                    <div>
                        <Text>Max distance</Text>
                        <Slider
                            min={0}
                            max={100}
                            label={(label) => `${label} km`}
                            defaultValue={30}
                            size="lg"
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
                            />
                            <NumberInput
                                label="Maximum"
                                placeholder="20"
                                w={"100%"}
                                defaultValue={20}
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
                        />
                    </div>
                    <TagsInput
                        label="Interests"
                        placeholder="What would you like?"
                    />
                    <Button>Apply filter</Button>
                </Flex>
            </Drawer>
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
            <Box h={"100%"}>
                <Transition
                    mounted={visible}
                    transition={transition}
                    duration={300}
                    timingFunction="ease"
                >
                    {(styles) => (
                        <Paper
                            shadow="md"
                            p="xl"
                            radius="xs"
                            style={{
                                ...styles,
                                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,1)), url(${
                                    data?.users[index]?.avatar ||
                                    import.meta.env.VITE_DEFAULT_AVATAR_URL
                                })`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                            key={index}
                            h={"100%"}
                        >
                            <Flex gap={"md"} align={"flex-end"} h={"100%"}>
                                <Flex
                                    direction={"column"}
                                    gap={"md"}
                                    w={"100%"}
                                >
                                    <div style={{ cursor: "default" }}>
                                        <Rating
                                            color={theme.primaryColor}
                                            value={
                                                data?.users[index]?.fameRating
                                            }
                                            readOnly
                                            fractions={10}
                                        />
                                        <Title order={3} c="white">
                                            {`${data?.users[index]?.firstName} ${data?.users[index]?.lastName}, ${data?.users[index]?.age}`}
                                        </Title>
                                    </div>
                                    <Text
                                        c={"white"}
                                        style={{ cursor: "default" }}
                                    >
                                        {data?.users[index]?.biography ||
                                            "No biography"}
                                    </Text>
                                    <Flex gap={"sm"}>
                                        <Button
                                            variant="light"
                                            color="red"
                                            size="lg"
                                            c={"red"}
                                            onClick={handlePass}
                                            fullWidth
                                        >
                                            Pass
                                        </Button>
                                        <Button
                                            variant="light"
                                            color="green"
                                            size="lg"
                                            c={"green"}
                                            onClick={handleMatch}
                                            fullWidth
                                        >
                                            Match
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Paper>
                    )}
                </Transition>
            </Box>
        </Flex>
    );
}
