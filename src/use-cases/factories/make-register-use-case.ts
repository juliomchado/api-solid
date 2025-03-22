import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register";

export function makeRegisterUseCase() {
  const userRepository = new PrismaUserRepository();
  const useCase = new RegisterUseCase(userRepository);

  return useCase;
}
