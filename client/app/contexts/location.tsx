import { useEffect } from "react";

export default function Location() {
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            console.log(pos);
        });
    }, []);

    return <></>;
}
