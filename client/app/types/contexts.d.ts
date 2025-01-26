interface IAuthContext {
    user: IProfile | null;
    login: (data: ILogin) => Promise<Partial<IProfile> | null>;
    register: (data: IRegister) => Promise<Partial<IProfile> | null>;
    logout: () => Promise<void>;
    logged: boolean;
    update: (data: Partial<IUser>) => Promise<boolean>;
    metadata: IMetadata | null;
    checkUser: () => Promise<IUser>;
}
