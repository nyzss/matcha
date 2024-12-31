// import { test } from "node:test";
import buildApp from "../app";

console.log(
    "CHECK IF POSTGRES ENVIRONMENT EXISTS ATLEAST: ",
    process.env.POSTGRES_DB,
    !!process.env.POSTGRES_DB
);

const test = async () => {
    const app = await buildApp(false);

    const resp = await app.inject({
        method: "GET",
        url: "/api/healthcheck",
    });

    console.log(resp.statusCode);
    console.log(resp.body);
    console.log(resp.headers);
};

test();
