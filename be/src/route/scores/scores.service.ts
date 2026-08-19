import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatisticResponseDto } from 'src/route/scores/dto/statistic.response.dto';
import { TopGroupAResponseDto } from 'src/route/scores/dto/top-a.response.dto';
import { EXAM_SUBJECTS } from '../../constants/subjects';
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
    const unionQueries = EXAM_SUBJECTS.map(
      (sub) =>
        `SELECT '${sub.dbColumn}' as subject, ${sub.dbColumn} as score FROM exam_scores WHERE ${sub.dbColumn} IS NOT NULL`,
    ).join(' UNION ALL ');

    const results = await this.prisma.$queryRawUnsafe<StatisticResponseDto[]>(`
      SELECT
        subject as "subject",
        COUNT(CASE WHEN score >= 8 THEN 1 END)::int AS "level1",
        COUNT(CASE WHEN score >= 6 AND score < 8 THEN 1 END)::int AS "level2",
        COUNT(CASE WHEN score >= 4 AND score < 6 THEN 1 END)::int AS "level3",
        COUNT(CASE WHEN score < 4 THEN 1 END)::int AS "level4"
      FROM (
        ${unionQueries}
      ) AS subject_scores
      GROUP BY subject;
    `);

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
