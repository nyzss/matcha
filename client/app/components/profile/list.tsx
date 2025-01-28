import {
    Avatar,
    Box,
    Card,
    Flex,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";
import { Link } from "react-router";
import { getImage } from "~/lib/api";

export default function List({ data }: { data: IUsersInteraction }) {
    const theme = useMantineTheme();
    return (
        <Card>
            {(data &&
                data.users.length > 0 &&
                data.users.map((user) => (
                    <Flex key={user.id} align={"center"} gap={"sm"}>
                        <Avatar
                            color="initials"
                            name={`${user.firstName} ${user.lastName}`}
                            size={55}
                            src={getImage(user.avatar)}
                        />
                        <Flex
                            direction={"column"}
                            gap={3}
                            component={Link}
                            to={`/profile/${user.username}`}
                            style={{
                                textDecoration: "inherit",
                                color: "inherit",
                            }}
                        >
                            <Title fz={"lg"}>
                                {user.firstName} {user.lastName}
                            </Title>
                            <Text fw={"bold"} c={`${theme.primaryColor}.3`}>
                                @{user.username}
                            </Text>
                        </Flex>
                    </Flex>
                ))) || (
                <Flex h={"100%"} align={"center"} justify={"center"} py={"xl"}>
                    <Text size={"xl"} c={"dimmed"}>
                        No blocked users
                    </Text>
                </Flex>
            )}
        </Card>
    );
}
