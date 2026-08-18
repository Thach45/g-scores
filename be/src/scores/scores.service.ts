import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findByRegistrationNumber(sbd: string) {
    const score = await this.prisma.examScore.findUnique({
      where: { sbd },
    });

    if (!score) {
      throw new NotFoundException(`No score found for registration number ${sbd}`);
    }

    return score;
  }
}
