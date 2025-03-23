import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearByGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearByGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearByGymsUseCase(gymsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "near-gym",
      phone: "",
      description: "",
      latitude: 40.63823,
      longitude: -7.931199,
    });

    await gymsRepository.create({
      title: "far-gym",
      phone: "",
      description: "",
      latitude: 40.7060348,
      longitude: -7.7848632,
    });

    const { gyms } = await sut.execute({
      userLatitude: 40.637405,
      userLongitude: -7.927793,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "near-gym",
      }),
    ]);
  });
});
