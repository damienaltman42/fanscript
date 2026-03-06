import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, include: { subscription: true } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { subscription: true } });
  }

  async create(data: { email: string; password: string; name: string }) {
    return this.prisma.user.create({
      data: {
        ...data,
        subscription: { create: { plan: 'FREE' } },
      },
    });
  }
}
