import InitialSetup from "~/components/onboard/initial-setup";
import { useAuth } from "../../contexts/auth-provider";

export default function Onboarding() {
    const { logged, user } = useAuth();
    if (logged) {
        return <InitialSetup />;
    }
    return <></>;
}
