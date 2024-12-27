import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "matcha" },
        { name: "description", content: "dating app" },
    ];
};

export default function Index() {
    return <div>hello world</div>;
}
