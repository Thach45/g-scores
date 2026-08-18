import { Controller, Get, Param } from '@nestjs/common';
import { FindScoreParamsDto } from './dto/find-score.params.dto';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get(':sbd')
  findByRegistrationNumber(@Param() params: FindScoreParamsDto) {
    return this.scoresService.findByRegistrationNumber(params.sbd);
  }
}
