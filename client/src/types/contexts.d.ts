import { IProfile } from "./auth";
import { ILogin, IRegister } from "./validation";

export interface IAuthContext {
    user: IProfile | null;
    login: (data: ILogin) => Promise<Partial<IProfile> | null>;
    register: (data: IRegister) => Promise<Partial<IProfile> | null>;
    logout: () => Promise<void>;
    logged: boolean;
}

