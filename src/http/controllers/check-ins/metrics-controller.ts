import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-users-metrics-use-case";

import { FastifyReply, FastifyRequest } from "fastify";

export async function metricsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();

  const { checkInsTotalCount } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    checkInsTotalCount,
  });
}
