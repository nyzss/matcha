import { registerSchema } from "@/lib/validation";
import { Box } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

export default function LoginComponent() {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
        },
        validate: zodResolver(registerSchema),
    });

    const handleSubmit = (values: z.infer<typeof registerSchema>) => {
        console.log(values);
    };

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}></form>
        </Box>
    );
}
