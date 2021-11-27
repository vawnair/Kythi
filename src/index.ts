import "dotenv/config";
import { join } from "path";
import fastify from "fastify";

const server = fastify();

server.register(require("fastify-autoload"), {
  dir: join(__dirname, "Routes"),
});

server.listen(process.env.PORT, "0.0.0.0", (err) => {
  if (err) throw err;

  console.log(`Listening on http://127.0.0.1:${process.env.PORT}`);
});
