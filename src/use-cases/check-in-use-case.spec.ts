import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in-use-case";
import { randomUUID } from "node:crypto";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-id-01",
      title: "javascript gym",
      description: "",
      latitude: 40.8156413,
      longitude: -7.1407557,
      phone: "",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be create a check in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: 40.8156413,
      userLongitude: -7.1407557,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: 40.8156413,
      userLongitude: -7.1407557,
    });

    await expect(
      sut.execute({
        gymId: checkIn.gym_id,
        userId: checkIn.user_id,
        userLatitude: 40.8156413,
        userLongitude: -7.1407557,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const firstCheckIn = await sut.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: 40.8156413,
      userLongitude: -7.1407557,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: firstCheckIn.checkIn.gym_id,
      userId: firstCheckIn.checkIn.user_id,
      userLatitude: 40.8156413,
      userLongitude: -7.1407557,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be to check in on distant gym", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await gymsRepository.create({
      id: "gym-id-02",
      title: "javascript gym",
      description: "",
      latitude: 40.8341688,
      longitude: -7.1228838,
      phone: "",
    });

    // 40.8341688,-7.1228838

    // 40.8156413,-7.140755714z

    await expect(
      sut.execute({
        gymId: "gym-id-02",
        userId: "user-id-01",
        userLatitude: 40.8156413,
        userLongitude: -7.1407557,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
