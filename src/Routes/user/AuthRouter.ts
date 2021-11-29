import Joi from "joi";
import { v5 } from "uuid";
import { hash } from "argon2";
import { User } from "../../Models/User";
import { Invite } from "../../Models/Invite";
import type { FastifyInstance } from "fastify";
import { supportedMails } from "../../Utility/Constants";

async function getNextUid(): Promise<number> {
  const docCount = await User.countDocuments();

  return docCount + 1;
}

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  inviteCode: string;
}

export default async function (server: FastifyInstance) {
  server.post<{ Body: RegisterBody }>(
    "/register",
    {
      schema: {
        body: Joi.object().keys({
          username: Joi.string().required().pattern(/^[a-zA-Z0-9_]{3,20}$/),
          email: Joi.string()
            .email()
            .required(),
          password: Joi.string().required().min(8),
          inviteCode: Joi.string().required(),
        }).required(),
      },
    },
    async (request, reply) => {
      const { username, email, password } = request.body;
      const inviteUsed: Invite | undefined = await Invite.findById(request.body.inviteCode);
      const inviteAuthor: User | undefined = await User.findById(inviteUsed?.createdBy);

      if (!inviteUsed || !inviteAuthor) {
        return reply.code(400).send({
          error: "Invalid invite.",
        });
      }

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
      user._id = v5(username, process.env.UUID_NAMESPACE);
      user.username = username;
      user.email = email.toLowerCase();
      user.password = await hash(password);
      user.uid = await getNextUid();
      user.invite.invitedBy = inviteAuthor._id;
      await user.save();

      inviteAuthor.invite.invited.push(user._id);
      await inviteAuthor.save();
      await inviteUsed.remove();

      return {
        message: "Sucessfully Registered!",
      };
    }
  );
}

export const autoPrefix = "/auth";
