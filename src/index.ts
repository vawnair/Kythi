import "dotenv/config";
import fastify from "fastify";

const server = fastify();

server.get("/", (request, reply) => {
    reply.send({ message: "Hello World!" });
})

server.listen(process.env.PORT, "0.0.0.0", (err) => {
    if (err) throw err;

    console.log(`Listening on http://127.0.0.1:${process.env.PORT}`);
})