import fastify from "fastify";
import fs from "node:fs";

const folderName = "./logs";

try {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }
} catch (err) {
    console.error(err);
}

export const server = fastify({
    logger: {
        level: "info",
        file: "./logs/server.log",
    },
});

server.get("/", async (request, reply) => {
    return "hello wsdaflkasdjforld\n";
});

server.listen({ port: 8000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
