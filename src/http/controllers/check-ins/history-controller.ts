import { makeFetchUserCheckInsUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-use-case";

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function historyController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const fetchUserCheckInsUseCase = makeFetchUserCheckInsUseCase();

  const { checkIns } = await fetchUserCheckInsUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(200).send({
    checkIns,
  });
}
