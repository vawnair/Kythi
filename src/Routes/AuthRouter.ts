import { v5 } from "uuid";
import { hash } from "argon2";
import { User } from "../Models/User";
import type { FastifyInstance } from "fastify";
import { supportedMails } from "../Utility/Constants";

async function getNextUid(): Promise<number> {
  const docCount = await User.countDocuments();

  return docCount + 1;
}

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export default async function (server: FastifyInstance) {
  server.post<{ Body: RegisterBody }>(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            username: { type: "string", pattern: "^[a-zA-Z0-9_]{3,20}$" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8 },
          },
          required: ["username", "email", "password"],
        },
      },
    },
    async (request, reply) => {
      const { username, email, password } = request.body;

      if (!supportedMails.includes(email.split("@")[1].split(".")[0].toLocaleLowerCase())) {
        return reply.code(400).send({
          error: "Only emails registered under gmail is supported.",
        });
      }

      if (
        await User.findOne({
          $or: [
            { username: new RegExp(`^${username}$`, "i") },
            { email: new RegExp(`^${email}$`, "i") },
          ],
        })
      ) {
        return reply.code(400).send({
          error: "Username or email already exists",
        });
      }

      const user = new User();
      user._id = v5(email, process.env.UUID_NAMESPACE);
      user.username = username;
      user.email = email.toLowerCase();
      user.password = await hash(password);
      user.uid = await getNextUid();
      await user.save();

      return {
        message: "Sucessfully Registered!",
      };
    }
  );
}

export const autoPrefix = "/auth";
