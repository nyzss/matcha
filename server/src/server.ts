import buildApp from "./app";

const startServer = async () => {
    const app = await buildApp();

    try {
        const PORT = 8000;
        const HOST = process.env.NODE_ENV === "production" ? "::" : "localhost";
        await app.listen({ port: PORT, host: HOST });

        await app.ready();
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

startServer();
