import {
    loginSchema,
    preferencesSchema,
    registerSchema,
    userSchema,
} from "@/lib/validation";
import { z } from "zod";

export interface IRoute {
    name: string;
    link: string;
    icon: React.ReactNode;
    auth?: boolean;
}

export type ILogin = z.infer<typeof loginSchema>;
export type IRegister = z.infer<typeof registerSchema>;

export type IUser = z.infer<typeof userSchema>;
export type IPreferences = z.infer<typeof preferencesSchema>;
