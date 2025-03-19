import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register-use-case";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUserRepository();
  const registerUserCase = new RegisterUseCase(usersRepository);

  return registerUserCase;
}
