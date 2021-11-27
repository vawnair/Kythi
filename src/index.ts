import "dotenv/config";
import { join } from "path";
import fastify from "fastify";
import { connect } from "mongoose";

const server = fastify();

server.register(require("fastify-autoload"), {
  dir: join(__dirname, "Routes"),
});

server.setValidatorCompiler(({ schema }) => {
  return data => schema.validate!(data)
})

server.listen(process.env.PORT, "0.0.0.0", (err) => {
  if (err) throw err;

  console.log(`Listening on http://127.0.0.1:${process.env.PORT}`);

  connect(process.env.MONGO_URI, {
    keepAlive: true,
  });
});
