import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import { RegisterUseCase } from "@/use-cases/register";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(request.body);

  try {
    const registerUserCase = makeRegisterUseCase();

    await registerUserCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      });
    }

    throw error;
  }

  return reply.status(201).send();
}
