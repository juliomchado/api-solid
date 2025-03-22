import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let authenticateRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    authenticateRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(authenticateRepository);
  });

  it("should be able to authenticate", async () => {
    const userEmail = "johndoee12345@example.com";
    const userPassword = "123456";

    await authenticateRepository.create({
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
    await expect(
      sut.execute({
        email: "johndoee12345@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const userEmail = "johndoee12345@example.com";
    const userPassword = "123456";

    await authenticateRepository.create({
      name: "John Doe",
      email: userEmail,
      password_hash: await hash("12345", 6),
    });

    await expect(
      sut.execute({
        email: userEmail,
        password: userPassword,
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
