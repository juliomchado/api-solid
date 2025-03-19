import { describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate Use Case", () => {
  it("should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    const userEmail = "johndoee12345@example.com";
    const userPassword = "123456";

    await usersRepository.create({
      name: "John Doe",
      email: userEmail,
      password_hash: await hash(userPassword, 6),
    });

    const { user } = await sut.execute({
      email: userEmail,
      password: userPassword,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    expect(async () => {
      return await sut.execute({
        email: "johndoee12345@example.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    const userEmail = "johndoee12345@example.com";
    const userPassword = "123456";

    await usersRepository.create({
      name: "John Doe",
      email: userEmail,
      password_hash: await hash("12345", 6),
    });

    expect(async () => {
      await sut.execute({
        email: userEmail,
        password: userPassword,
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
