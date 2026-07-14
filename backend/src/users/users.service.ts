import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        referralCode: crypto.randomUUID().slice(0, 8).toUpperCase(),
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }
}
