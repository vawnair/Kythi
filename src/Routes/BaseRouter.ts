import type { FastifyInstance } from "fastify";

export default async function (server: FastifyInstance) {
  server.get("/", async (request, reply) => {
    return { message: "Hello World!" };
  });
}
