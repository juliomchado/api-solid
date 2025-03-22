import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface FetchNearByGymsCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearByGymsCaseResponse {
  gyms: Gym[];
}

export class FetchNearByGymsCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearByGymsCaseRequest): Promise<FetchNearByGymsCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
