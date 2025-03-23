import { FastifyInstance } from "fastify";

import { verifyJWT } from "../../middlewares/verify-jwt";

import { registerController } from "./register-controller";
import { authenticateController } from "./authenticate-controller";
import { profileController } from "./profile-controller";
import { refreshController } from "./refresh-controller";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", registerController);
  app.post("/sessions", authenticateController);

  app.patch("/token/refresh", refreshController);

  /** Auth   */
  app.get("/me", { onRequest: [verifyJWT] }, profileController);
}
