import { loginSchema, registerSchema } from "@/lib/validation";
import { z } from "zod";

export interface IRoute {
    name: string;
    link: string;
    icon: React.ReactNode;
    auth?: boolean;
}

export type TLogin = z.infer<typeof loginSchema>;
export type TRegister = z.infer<typeof registerSchema>;
