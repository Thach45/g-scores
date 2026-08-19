import { Exclude, Expose, Transform } from 'class-transformer';

export class ScoreResponseDto {
  @Expose()
  sbd: string;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  toan: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  nguVan: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  ngoaiNgu: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  vatLi: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  hoaHoc: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  sinhHoc: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  lichSu: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  diaLi: number | null;

  @Expose()
  @Transform(({ value }) => (value ? Number(value) : null))
  gdcd: number | null;

  @Exclude()
  maNgoaiNgu: string | null;

  constructor(partial: any) {
    Object.assign(this, partial);
  }
}
