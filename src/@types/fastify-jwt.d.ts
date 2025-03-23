import { FastifyJWT } from "./../../node_modules/@fastify/jwt/types/jwt.d";
import "@fastify/jwt";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string;
      role: "ADMIN" | "MEMBER";
    };
  }
}
