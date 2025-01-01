import InitialSetup from "~/components/onboard/initial-setup";
import { useAuth } from "./auth-provider";

export default function Onboarding() {
    const { logged, user } = useAuth();
    if (logged && !user?.verified) {
        return <InitialSetup />;
    }
    return <></>;
}
