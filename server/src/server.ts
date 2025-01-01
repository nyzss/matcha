import buildApp from "./app";

const startServer = async () => {
    const app = await buildApp({
        level: "info",
        transport: {
            target: "pino-pretty",
        },
    });

    try {
        const PORT = 8000;
        const HOST =
            process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
        await app.listen({ port: PORT, host: HOST });

        await app.ready();
        if (process.env.NODE_ENV === "development") {
            console.log(
                `DEVELOPEMENT SERVER: 🚀 Server running at http://${HOST}:${PORT}`
            );
        } else if (process.env.NODE_ENV === "production") {
            console.log(`🚀 Server running at https://${HOST}:${PORT}`);
        }
        // prod:
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

startServer();
