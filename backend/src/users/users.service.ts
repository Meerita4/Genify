import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, name: true, email: true, credits: true, createdAt: true },
    });

    const totalGenerations = await this.prisma.generation.count({ where: { userId } });

    return { ...user, totalGenerations };
  }
}
