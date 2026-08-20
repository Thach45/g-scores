import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatisticResponseDto } from 'src/route/scores/dto/statistic.response.dto';
import { TopGroupAResponseDto } from 'src/route/scores/dto/top-a.response.dto';

@Injectable()
export class ScoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findByRegistrationNumber(sbd: string) {
    const score = await this.prisma.examScore.findUnique({
      where: { sbd },
    });

    if (!score) {
      throw new NotFoundException(
        `No score found for registration number ${sbd}`,
      );
    }

    return score;
  }

  async findStatistics() {
    const results = await this.prisma.$queryRaw<StatisticResponseDto[]>`
      SELECT
        v.subject as "subject",
        COUNT(CASE WHEN v.score >= 8 THEN 1 END)::int AS "level1",
        COUNT(CASE WHEN v.score >= 6 AND v.score < 8 THEN 1 END)::int AS "level2",
        COUNT(CASE WHEN v.score >= 4 AND v.score < 6 THEN 1 END)::int AS "level3",
        COUNT(CASE WHEN v.score < 4 THEN 1 END)::int AS "level4"
      FROM exam_scores
      CROSS JOIN LATERAL (
        VALUES 
          ('toan', toan),
          ('ngu_van', ngu_van),
          ('ngoai_ngu', ngoai_ngu),
          ('vat_li', vat_li),
          ('hoa_hoc', hoa_hoc),
          ('sinh_hoc', sinh_hoc),
          ('lich_su', lich_su),
          ('dia_li', dia_li),
          ('gdcd', gdcd)
      ) AS v(subject, score)
      WHERE v.score IS NOT NULL
      GROUP BY v.subject;
    `;

    return results.map(
      (item: StatisticResponseDto) => new StatisticResponseDto(item),
    );
  }

  async findTopGroupA() {
    const results = await this.prisma.$queryRaw<TopGroupAResponseDto[]>`
      SELECT 
        sbd,
        toan,
        vat_li,
        hoa_hoc,
        (toan + vat_li + hoa_hoc) as total_score
      FROM exam_scores
      WHERE toan IS NOT NULL AND vat_li IS NOT NULL AND hoa_hoc IS NOT NULL
      ORDER BY total_score DESC
      LIMIT 10;
    `;
    return results;
  }
}
