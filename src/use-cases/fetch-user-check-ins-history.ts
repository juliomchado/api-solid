import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchUserCheckInsUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsUseCaseRequest): Promise<FetchUserCheckInsUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    // if (!checkIn) {
    //   throw new ResourceNotFoundError();
    // }

    // calculate distance between user and gym

    return {
      checkIns,
    };
  }
}
