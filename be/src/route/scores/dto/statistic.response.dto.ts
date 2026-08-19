import { Expose } from 'class-transformer';

export class StatisticResponseDto {
  @Expose()
  subject: string;
  @Expose()
  level1: number;
  @Expose()
  level2: number;
  @Expose()
  level3: number;
  @Expose()
  level4: number;

  constructor(partial: Partial<StatisticResponseDto>) {
    Object.assign(this, partial);
  }
}
