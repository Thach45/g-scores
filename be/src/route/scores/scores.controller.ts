import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { FindScoreParamsDto } from './dto/find-score.params.dto';
import { ScoresService } from './scores.service';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { ScoreResponseDto } from 'src/route/scores/dto/score.response.dto';
import { StatisticResponseDto } from 'src/route/scores/dto/statistic.response.dto';
import { TopGroupAResponseDto } from 'src/route/scores/dto/top-a.response.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
@Controller('scores')
@UseInterceptors(TransformInterceptor, ClassSerializerInterceptor)
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}
  @Get('statistics')
  @UseInterceptors(CacheInterceptor)
  async findStatistics() {
    const results = await this.scoresService.findStatistics();
    return results.map(
      (item: StatisticResponseDto) => new StatisticResponseDto(item),
    );
  }

  @Get('top-a')
  @UseInterceptors(CacheInterceptor)
  async findTopGroupA() {
    const results = await this.scoresService.findTopGroupA();
    return results.map(
      (item: TopGroupAResponseDto) => new TopGroupAResponseDto(item),
    );
  }

  @Get(':sbd')
  async findByRegistrationNumber(@Param() params: FindScoreParamsDto) {
    const result = await this.scoresService.findByRegistrationNumber(
      params.sbd,
    );
    return new ScoreResponseDto(result);
  }
}
