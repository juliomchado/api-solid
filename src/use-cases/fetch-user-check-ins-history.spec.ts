import { CheckIn } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { randomUUID } from "node:crypto";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { FetchUserCheckInsUseCase } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: FetchUserCheckInsUseCase;

describe("Fetch user Check-in History Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to Fetch user check-in history", async () => {
    await checkInsRepository.create({
      gym_id: "gym-id-01",
      user_id: "user-id-01",
    });

    await checkInsRepository.create({
      gym_id: "gym-id-02",
      user_id: "user-id-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-id-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-id-01" }),
      expect.objectContaining({ gym_id: "gym-id-02" }),
    ]);
  });

  it("should be able to paginate Fetch user check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-id-${i}`,
        user_id: "user-id-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-id-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-id-21" }),
      expect.objectContaining({ gym_id: "gym-id-22" }),
    ]);
  });
});
