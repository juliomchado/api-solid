import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to get check-ins count from metrics", async () => {
    for (let i = 1; i <= 5; i++) {
      await checkInsRepository.create({
        gym_id: `gym-id-${i}`,
        user_id: "user-id-01",
      });
    }

    const { checkInsTotalCount } = await sut.execute({
      userId: "user-id-01",
    });

    expect(checkInsTotalCount).toEqual(5);
  });
});
