import { describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register-use-case";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { compare } from "bcryptjs";
import { InMemoryRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const inMemoryRepository = new InMemoryRepository();
    const registerUseCase = new RegisterUseCase(inMemoryRepository);

    const { user } = await registerUseCase.execute({
      name: "John doe",
      email: "johndoee12345@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should be able to user register", async () => {
    const inMemoryRepository = new InMemoryRepository();
    const registerUseCase = new RegisterUseCase(inMemoryRepository);

    const { user } = await registerUseCase.execute({
      name: "John doe",
      email: "johndoee12345@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should to not be able to register users with same email", async () => {
    const inMemoryRepository = new InMemoryRepository();
    const registerUseCase = new RegisterUseCase(inMemoryRepository);
    const email = "johndoee12345@example.com";

    await registerUseCase.execute({
      name: "John doe",
      email,
      password: "123456",
    });

    expect(async () => {
      await registerUseCase.execute({
        name: "John doe",
        email,
        password: "123456",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
