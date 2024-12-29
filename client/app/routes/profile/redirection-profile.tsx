import { redirect } from "react-router";

export async function clientLoader() {
    return redirect("/profile/@me");
}

export default function ProfilePage() {
    return <></>;
}
