import { test, TestContext } from "node:test";
import buildApp from "../app";

import crypto from "node:crypto";

const rand = () => crypto.randomBytes(20).toString("hex").slice(0, 12);

test("Health check", async (t: TestContext) => {
    t.plan(1);
    const app = await buildApp(false);

    const resp = await app.inject({
        method: "GET",
        url: "/api/healthcheck",
    });

    t.assert.strictEqual(resp.statusCode, 200, "returns a status code of 200");

    await app.close();
});

test("User creation", async (t: TestContext) => {
    // t.plan(2);
    const app = await buildApp(false);
    const randomName = rand();

    await t.test("Valid User creation", async (st: TestContext) => {
        const body = {
            username: randomName,
            email: `${randomName}@gmail.com`,
            password: "password123",
            birthDate: "2004-11-01",
            firstName: randomName,
            lastName: "TEST_USER_LastName",
        };

        const resp = await app.inject({
            method: "POST",
            url: "/api/auth/register",
            body: body,
        });

        const json = await resp.json();

        st.assert.strictEqual(
            resp.statusCode,
            200,
            "returns a status code of 200"
        );
        st.assert.strictEqual(
            json.user.username,
            randomName,
            "returns the correct username"
        );

        const cookies = ["accessToken", "refreshToken"];

        const checkCookies = resp.cookies
            .map((cookie) => cookie.name)
            .every((cookie) => cookies.includes(cookie));
        st.assert.strictEqual(
            checkCookies,
            true,
            "returns the correct cookies"
        );
    });

    await t.test(
        "Invalid User creation (same email/username)",
        async (st: TestContext) => {
            const body = {
                username: randomName,
                email: `${randomName}@gmail.com`,
                password: "password123",
                birthDate: "2004-11-01",
                firstName: randomName,
                lastName: "TEST_USER_LastName",
            };

            const resp = await app.inject({
                method: "POST",
                url: "/api/auth/register",
                body: body,
            });

            const json = await resp.json();

            st.assert.strictEqual(
                resp.statusCode,
                400,
                "returns a status code of 400"
            );
            st.assert.strictEqual(
                json.error,
                "Email already exists",
                "Email should already exist"
            );
        }
    );

    await t.test(
        "Invalid User creation (not sending all required fields - birthDate)",
        async (st: TestContext) => {
            const body = {
                username: randomName,
                email: `${randomName}@gmail.com`,
                password: "password123",
                // birthdate missing in this case
                // birthDate: "2004-11-01",
                firstName: randomName,
                lastName: "TEST_USER_LastName",
            };

            const resp = await app.inject({
                method: "POST",
                url: "/api/auth/register",
                body: body,
            });

            const json = await resp.json();

            st.assert.strictEqual(
                resp.statusCode,
                400,
                "returns a status code of 400"
            );
            st.assert.strictEqual(
                json.message,
                "Invalid request data",
                "should be catched by fastify schema validation"
            );
        }
    );

    await app.orm.query(
        `DELETE FROM profiles WHERE last_name = 'TEST_USER_LastName'`
    );
    await app.close();
});
