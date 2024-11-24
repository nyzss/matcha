import fastify from "fastify";

export const server = fastify({
    logger: true,
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
