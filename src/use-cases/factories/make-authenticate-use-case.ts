import { PrismaUserRepository } from "@/repositories/prisma/prisma-users";
import { AuthenticateUseCase } from "../authenticate";

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUserRepository();
  const authenticateUserCase = new AuthenticateUseCase(usersRepository);

  return authenticateUserCase;
}
