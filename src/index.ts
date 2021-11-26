import "dotenv/config";
import fastify from "fastify";
import fastifyAutoload from "fastify-autoload";
import path from "path";

const server = fastify();

server.register(fastifyAutoload, {
  dir: path.join(__dirname, "Routes"),
});

server.listen(process.env.PORT, "0.0.0.0", (err) => {
  if (err) throw err;

  console.log(`Listening on http://127.0.0.1:${process.env.PORT}`);
});
