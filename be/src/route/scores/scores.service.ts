import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatisticResponseDto } from 'src/route/scores/dto/statistic.response.dto';
import { ScoreResponseDto } from 'src/route/scores/dto/score.response.dto';
import { TopGroupAResponseDto } from 'src/route/scores/dto/top-a.response.dto';

@Injectable()
export class ScoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findByRegistrationNumber(
    sbd: string,
  ): Promise<ScoreResponseDto | null> {
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
        subject as "subject",
        COUNT(CASE WHEN score >= 8 THEN 1 END)::int AS "level1",
        COUNT(CASE WHEN score >= 6 AND score < 8 THEN 1 END)::int AS "level2",
        COUNT(CASE WHEN score >= 4 AND score < 6 THEN 1 END)::int AS "level3",
        COUNT(CASE WHEN score < 4 THEN 1 END)::int AS "level4"
      FROM (
        SELECT 'toan' as subject, toan as score FROM exam_scores WHERE toan IS NOT NULL
        UNION ALL
        SELECT 'nguVan', ngu_van FROM exam_scores WHERE ngu_van IS NOT NULL
        UNION ALL
        SELECT 'ngoaiNgu', ngoai_ngu FROM exam_scores WHERE ngoai_ngu IS NOT NULL
        UNION ALL
        SELECT 'vatLi', vat_li FROM exam_scores WHERE vat_li IS NOT NULL
        UNION ALL
        SELECT 'hoaHoc', hoa_hoc FROM exam_scores WHERE hoa_hoc IS NOT NULL
        UNION ALL
        SELECT 'sinhHoc', sinh_hoc FROM exam_scores WHERE sinh_hoc IS NOT NULL
        UNION ALL
        SELECT 'lichSu', lich_su FROM exam_scores WHERE lich_su IS NOT NULL
        UNION ALL
        SELECT 'diaLi', dia_li FROM exam_scores WHERE dia_li IS NOT NULL
        UNION ALL
        SELECT 'gdcd', gdcd FROM exam_scores WHERE gdcd IS NOT NULL

      ) AS subject_scores
      GROUP BY subject;
    `;

    return results;
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
