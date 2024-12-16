import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

export default function EditProfile() {
    const [opened, { open, close }] = useDisclosure();

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title="Edit Profile"
                size={"xl"}
                centered
            >
                <h1>edit your profile content here</h1>
            </Modal>
            <Button ml={"auto"} variant="light" onClick={open}>
                Edit Profile
            </Button>
        </>
    );
}

