import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let usersRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(usersRepository);
  });

  it("should be able to user register", async () => {
    const { gym } = await sut.execute({
      title: "gym-title",
      phone: "",
      description: "",
      latitude: 40.8341688,
      longitude: -7.1228838,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
