"use client";

import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect } from "react";
import FormSteps from "./form-steps";

export default function InitialSetup() {
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        open();
    }, [open]);

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
        >
            <FormSteps />
        </Modal>
    );
}
