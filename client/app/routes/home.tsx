import {
    Anchor,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    LoadingOverlay,
    Paper,
    Popover,
    Radio,
    Rating,
    Text,
    ThemeIcon,
    Title,
    Transition,
    useMantineTheme,
    type MantineTransition,
} from "@mantine/core";
import { IconGhost2, IconRefresh } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import Filter from "~/components/match/filter";
import { getImage, getSuggestions, matchUser } from "~/lib/api";

export default function Home() {
    const theme = useMantineTheme();
    const [sortField, setSortField] = useState<TFieldOptions | null>(null);
    const [order, setOrder] = useState<TOrderOptions | null>(null);
    const { data, isPending, isFetching, refetch } = useQuery({
        queryKey: ["suggestions", sortField, order],
        queryFn: () => getSuggestions(sortField, order),
    });

    const [index, setIndex] = useState<number>(0);
    const [visible, setVisible] = useState<boolean>(true);
    const [transition, setTransition] =
        useState<MantineTransition>("rotate-left");

    const handleNext = (matched: boolean = true) => {
        if (data && index === data.users.length - 1) {
            setIndex(0);

            refetch();
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

    const handleMatch = async () => {
        const res = await matchUser(data!.users[index].id.toString(), true);

        handleNext(true);
    };

    const handlePass = async () => {
        const res = await matchUser(data!.users[index].id.toString(), false);

        handleNext(false);
    };

    return (
        <Container
            h={"100%"}
            p={{
                base: "0",
            }}
        >
            <Flex h={"100%"} direction={"column"} gap={"sm"}>
                <Flex justify={"space-between"} gap={"sm"}>
                    <Filter />
                    <Flex>
                        <Popover>
                            <Popover.Target>
                                <Button variant="subtle">Add filter</Button>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Flex direction={"column"}>
                                    <Radio.Group
                                        name="sort"
                                        label="Sort"
                                        description="Field by which the results will be sorted"
                                        value={sortField}
                                        onChange={(value) => {
                                            setSortField(
                                                value as TFieldOptions
                                            );
                                            if (order === null) {
                                                setOrder("asc");
                                            }
                                        }}
                                    >
                                        <Flex
                                            direction={"column"}
                                            mt={"xs"}
                                            gap={"sm"}
                                        >
                                            <Radio value={"age"} label="Age" />
                                            <Radio
                                                value={"location"}
                                                label="Location"
                                            />
                                            <Radio
                                                value={"fame_rating"}
                                                label="Fame rating"
                                            />
                                            <Radio
                                                value={"common_tags"}
                                                label="Common tags"
                                            />
                                        </Flex>
                                    </Radio.Group>
                                    <Divider my={"sm"} />
                                    <Radio.Group
                                        name="order"
                                        label={<Text>Order</Text>}
                                        description="Order in which the results will be sorted"
                                        value={order}
                                        onChange={(value) => {
                                            setOrder(value as TOrderOptions);
                                            if (sortField === null) {
                                                setSortField("age");
                                            }
                                        }}
                                    >
                                        <Flex
                                            direction={"column"}
                                            mt={"xs"}
                                            gap={"xs"}
                                        >
                                            <Radio
                                                value={"asc"}
                                                label="Ascending"
                                            />
                                            <Radio
                                                value={"desc"}
                                                label="Descending"
                                            />
                                        </Flex>
                                    </Radio.Group>

                                    <Button
                                        mt={"md"}
                                        mb={"sm"}
                                        fullWidth
                                        variant="subtle"
                                        onClick={() => {
                                            setOrder(null);
                                            setSortField(null);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                </Flex>
                            </Popover.Dropdown>
                        </Popover>
                    </Flex>
                </Flex>

                <Box pos={"relative"} h={"100%"}>
                    <LoadingOverlay
                        visible={isPending || isFetching}
                        overlayProps={{ radius: "sm", blur: 2 }}
                        transitionProps={{
                            duration: 500,
                            transition: "fade",
                        }}
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
                                        style={{
                                            ...styles,
                                            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,1)), url(${
                                                getImage(
                                                    data?.users[index].avatar
                                                ) ||
                                                import.meta.env
                                                    .VITE_DEFAULT_AVATAR_URL
                                            })`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                        radius={"lg"}
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
                                                <div
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                >
                                                    <Rating
                                                        color={
                                                            theme.primaryColor
                                                        }
                                                        value={
                                                            data?.users[index]
                                                                ?.fameRating
                                                        }
                                                        readOnly
                                                        fractions={10}
                                                    />
                                                    <Anchor
                                                        c="white"
                                                        component={Link}
                                                        size="xl"
                                                        fw={"bold"}
                                                        to={
                                                            "/profile/" +
                                                            data?.users[index]
                                                                .username
                                                        }
                                                    >
                                                        {`${data?.users[index]?.firstName} ${data?.users[index]?.lastName}, ${data?.users[index]?.age}`}
                                                    </Anchor>
                                                </div>
                                                <Text
                                                    c={"white"}
                                                    style={{
                                                        cursor: "default",
                                                    }}
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
                            px={50}
                        >
                            <Flex
                                direction={"column"}
                                align={"center"}
                                justify={"center"}
                                h={"100%"}
                                gap={"xs"}
                            >
                                <ThemeIcon
                                    variant="transparent"
                                    size={200}
                                    radius={999}
                                >
                                    <IconGhost2 size={150} />
                                </ThemeIcon>
                                <Title>No matches found</Title>
                                <Text>
                                    Try changing your filter settings or come
                                    back later!
                                </Text>
                                <Button
                                    onClick={() => refetch()}
                                    variant="transparent"
                                    leftSection={<IconRefresh />}
                                    loading={isFetching}
                                >
                                    Retry
                                </Button>
                            </Flex>
                        </Card>
                    )}
                </Box>
            </Flex>
        </Container>
    );
}
