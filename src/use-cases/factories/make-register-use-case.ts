import { PrismaUserRepository } from "@/repositories/prisma/prisma-users";
import { RegisterUseCase } from "../register";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUserRepository();
  const registerUserCase = new RegisterUseCase(usersRepository);

  return registerUserCase;
}
