import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users";

export class PrismaUserRepository implements UsersRepository {
  findById(userId: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
  async create({ email, name, password_hash }: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    });

    return user;
  }
}
