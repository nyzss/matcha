import {
    Box,
    Button,
    Card,
    Flex,
    LoadingOverlay,
    Paper,
    Rating,
    Text,
    ThemeIcon,
    Title,
    Transition,
    useMantineTheme,
    type MantineTransition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconGhost2 } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Filter from "~/components/match/filter";
import { getSuggestions } from "~/lib/api";

export default function Home() {
    const theme = useMantineTheme();
    const { data, isPending, isFetching } = useQuery({
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
                xl: 40,
            }}
            gap={"sm"}
        >
            <Filter />

            <Box pos={"relative"} h={"100%"}>
                <LoadingOverlay
                    visible={isFetching}
                    overlayProps={{ radius: "sm", blur: 2 }}
                />

                {data && data?.users.length > 0 ? (
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
                                            import.meta.env
                                                .VITE_DEFAULT_AVATAR_URL
                                        })`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                    key={index}
                                    h={"100%"}
                                >
                                    <Flex
                                        gap={"md"}
                                        align={"flex-end"}
                                        h={"100%"}
                                    >
                                        <Flex
                                            direction={"column"}
                                            gap={"md"}
                                            w={"100%"}
                                        >
                                            <div style={{ cursor: "default" }}>
                                                <Rating
                                                    color={theme.primaryColor}
                                                    value={
                                                        data?.users[index]
                                                            ?.fameRating
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
                                                {data?.users[index]
                                                    ?.biography ||
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
                ) : (
                    <Card
                        h={"100%"}
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                    >
                        <Flex
                            direction={"column"}
                            align={"center"}
                            justify={"center"}
                            h={"100%"}
                            gap={"xs"}
                        >
                            <ThemeIcon
                                variant="outline"
                                size={200}
                                radius={999}
                            >
                                <IconGhost2 size={150} />
                            </ThemeIcon>
                            <Title>No matches found</Title>
                            <Text>
                                Try changing your filter settings or come back
                                later!
                            </Text>
                        </Flex>
                    </Card>
                )}
            </Box>
        </Flex>
    );
}
