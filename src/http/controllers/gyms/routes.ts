import { FastifyInstance } from "fastify";

import { verifyJWT } from "../../middlewares/verify-jwt";
import { searchController } from "./search-controller";
import { nearbyController } from "./nearby-controller";
import { createController } from "./create-controller";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/gyms/search", searchController);
  app.get("/gyms/nearby", nearbyController);

  app.post("/gyms", createController);
}
