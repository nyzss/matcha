import Profile from "@/components/profile/profile";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = decodeURIComponent((await params).id);

    return <Profile id={id} />;
}

