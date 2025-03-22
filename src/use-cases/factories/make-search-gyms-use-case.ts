import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymUseCase } from "../search-gyms";

export function makeValidateCheckInUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new SearchGymUseCase(gymsRepository);

  return useCase;
}
