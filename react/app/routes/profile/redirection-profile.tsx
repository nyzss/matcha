import { redirect } from "react-router";

export async function loader() {
    return redirect("/profile/@me");
}

export default function ProfilePage() {
    return <></>;
}