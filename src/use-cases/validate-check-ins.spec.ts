import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-ins";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be create to validate the check-in", async () => {
    // vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-id-01",
      user_id: "user-id-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(
      checkIn.validated_at
    );
  });

  it("should not be able to validate an inexistent check-in", async () => {
    await expect(
      sut.execute({
        checkInId: "inexistent-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation ", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-id-01",
      user_id: "user-id-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
