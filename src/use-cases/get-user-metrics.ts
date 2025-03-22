import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkInsTotalCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsTotalCount = await this.checkInsRepository.countByUserId(
      userId
    );

    // if (!checkIn) {
    //   throw new ResourceNotFoundError();
    // }

    // calculate distance between user and gym

    return {
      checkInsTotalCount,
    };
  }
}
