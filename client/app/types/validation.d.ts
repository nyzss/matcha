import {
    loginSchema,
    preferencesSchema,
    registerSchema,
    userSchema,
} from "~/lib/validation";
import { z } from "zod";

interface IRoute {
    name: string;
    link: string;
    icon: React.ReactNode;
    auth?: boolean;
}

type ILogin = z.infer<typeof loginSchema>;
type IRegister = z.infer<typeof registerSchema>;

type IUser = z.infer<typeof userSchema>;
type IPreferences = z.infer<typeof preferencesSchema>;
