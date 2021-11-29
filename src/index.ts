import "dotenv/config";
import { v5 } from "uuid";
import { join } from "path";
import fastify from "fastify";
import { hash } from "argon2";
import { connect } from "mongoose";
import { User } from "./Models/User";

const server = fastify();

server.register(require("fastify-autoload"), {
  dir: join(__dirname, "Routes"),
});

server.setValidatorCompiler(({ schema }) => {
  return (data) => schema.validate!(data);
});

server.listen(process.env.PORT, "0.0.0.0", (err) => {
  if (err) throw err;

  console.log(`Listening on http://127.0.0.1:${process.env.PORT}`);

  connect(
    process.env.MONGO_URI,
    {
      keepAlive: true,
    },
    async (err) => {
      if (err) throw err;

      console.log("Connected to MongoDB");

      if ((await User.countDocuments()) === 0) {
        console.log(
          '\nHey! Seems like a fresh database. You will be prompted shortly for some details to setup an admin account.\n'
        );

        const readline = require("readline").createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        readline.question("Enter your username: ", (username: string) => {
          readline.question("Enter your email: ", (email: string) => {
              readline.question("Enter your password: ", async (password: string) => {
                  const id = v5(username, process.env.UUID_NAMESPACE);

                  const user = new User();
                  user._id = id;
                  user.uid = 0;
                  user.username = username;
                  user.email = email.toLowerCase();
                  user.password = await hash(password);
                  user.invite.invitedBy = id;
                  user.permissions.admin = true;
                  await user.save();

                  console.log("\nSuccessfully created an admin account! Dont forget your login!");
                  readline.close();
                });
            });
        });
      }
    }
  );
});
