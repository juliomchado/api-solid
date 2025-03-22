import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-checkins-repository";
import { FetchUserCheckInsUseCase } from "../fetch-user-check-ins-history";

export function makeFetchUserCheckInsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsUseCase(checkInsRepository);

  return useCase;
}
