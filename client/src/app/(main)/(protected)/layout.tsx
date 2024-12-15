import Middleware from "@/components/auth/middleware";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Middleware isProtected={true}>{children}</Middleware>
        </>
    );
}

