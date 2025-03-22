import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUserRepository();
  const useCase = new AuthenticateUseCase(userRepository);

  return useCase;
}
