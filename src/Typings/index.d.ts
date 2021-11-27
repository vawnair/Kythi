import { FastifySchema } from "fastify";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO_URI: string;
      UUID_NAMESPACE: string;
    }
  }
}

declare module "fastify" {
  interface FastifySchema extends FastifySchema {
    validate?: (data: any) => any;
  }
}
