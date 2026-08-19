import { Matches } from 'class-validator';

export class FindScoreParamsDto {
  @Matches(/^\d{8}$/, {
    message: 'sbd must contain exactly 8 digits',
  })
  sbd: string;
}
