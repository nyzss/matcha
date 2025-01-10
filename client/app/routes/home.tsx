import { Button, Flex, Paper, Text, Title } from "@mantine/core";

const profiles = [
    {
        name: "Kanye West",
        image: "https://sup.drafted.dev/storage/v1/object/public/avatars/kanye-west.jpg",
        biography:
            "I am Kanye West and I am a rapper, singer, songwriter, record producer, and fashion designer. I am one of the most acclaimed musicians of the 21st century and one of the best-selling music artists of all time.",
        birthdate: "1977-06-08",
        fameRating: 9.5,
        interests: ["Music", "Fashion", "Design"],
    },
    {
        name: "Travis Scott",
        image: "https://sup.drafted.dev/storage/v1/object/public/avatars/travis-scott.jpg",
        biography:
            "I am Travis Scott, an American rapper, singer, songwriter, and record producer known for my unique style blending hip hop, trap, and psychedelic music. I've released several chart-topping albums, including 'Astroworld.'",
        birthdate: "1991-04-30",
        fameRating: 9.0,
        interests: ["Music", "Gaming", "Fashion"],
    },
    {
        name: "Nicki Minaj",
        image: "https://sup.drafted.dev/storage/v1/object/public/avatars/nicki-minaj.jpg",
        biography:
            "I am Nicki Minaj, a Trinidadian-American rapper, singer, and songwriter. Known for my versatility and animated flow, I am one of the best-selling female artists in history and have a profound influence on hip hop.",
        birthdate: "1982-12-08",
        fameRating: 9.6,
        interests: ["Music", "Beauty", "Philanthropy"],
    },
    {
        name: "Selena Gomez",
        image: "https://sup.drafted.dev/storage/v1/object/public/avatars/selena-gomez.jpg",
        biography:
            "I am Selena Gomez, an American singer, actress, and producer. With multiple chart-topping albums and an influence in pop culture, I have made a significant impact in both music and entertainment industries.",
        birthdate: "1992-07-22",
        fameRating: 9.4,
        interests: ["Music", "Acting", "Mental Health Advocacy"],
    },
];

export default function Home() {
    return (
        <Flex direction={"column"} gap={"lg"} px={60} pb={50}>
            {profiles.map((profile, index) => (
                <Paper
                    shadow="md"
                    p="xl"
                    radius="md"
                    style={{
                        backgroundImage: `url(${profile.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    key={index}
                    h={"600px"}
                    //   className={classes.card}
                >
                    <Flex
                        gap={"md"}
                        justify={"space-between"}
                        align={"flex-end"}
                        h={"100%"}
                    >
                        <div>
                            <Text size="lg" c={"white"}>
                                {profile.fameRating}
                            </Text>
                            <Title order={3} c="white">
                                {profile.name}
                            </Title>
                        </div>
                        <Button variant="white" color="dark">
                            See more
                        </Button>
                    </Flex>
                </Paper>
            ))}
        </Flex>
    );
}
