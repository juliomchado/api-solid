import { CheckIn } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { randomUUID } from "node:crypto";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { SearchGymUseCase } from "./search-gyms";
import { object } from "zod";
import { title } from "node:process";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search Gyns Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to search gyms by title", async () => {
    await gymsRepository.create({
      title: "js-gym",
      phone: "",
      description: "",
      latitude: 40.8341688,
      longitude: -7.1228838,
    });

    await gymsRepository.create({
      title: "ts-gym",
      phone: "",
      description: "",
      latitude: 40.8341688,
      longitude: -7.1228838,
    });

    const { gyms } = await sut.execute({
      query: "ts",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "ts-gym",
      }),
    ]);
  });

  it("should be able to get check-ins count from metrics", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `ts-gym-${i}`,
        phone: "",
        description: "",
        latitude: 40.8341688,
        longitude: -7.1228838,
      });
    }

    const { gyms } = await sut.execute({
      query: "ts",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "ts-gym-21",
      }),
      expect.objectContaining({
        title: "ts-gym-22",
      }),
    ]);
  });
});
