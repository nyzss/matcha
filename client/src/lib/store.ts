import { IProfile } from "@/types/auth";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage<IProfile | null>("user", null);

