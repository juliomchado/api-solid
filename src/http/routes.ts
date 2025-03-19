import { FastifyInstance } from "fastify";
import { registerControler } from "./controllers/register-controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", registerControler);
}
