import fastify from "fastify";

export const server = fastify();

server.get("/", async (request, reply) => {
    return "hello world\n";
});

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
