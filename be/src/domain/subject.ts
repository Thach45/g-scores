export type ScoreLevel = 'level1' | 'level2' | 'level3' | 'level4';

export class Subject {
  constructor(
    public readonly dtoKey: string,
    public readonly dbColumn: string,
    public readonly label: string,
  ) {}

  isValidScore(score: number): boolean {
    return Number.isFinite(score) && score >= 0 && score <= 10;
  }

  classifyScore(score: number): ScoreLevel {
    if (!this.isValidScore(score)) {
      throw new Error(`Invalid score for ${this.label}: ${score}`);
    }

    if (score >= 8) return 'level1';
    if (score >= 6) return 'level2';
    if (score >= 4) return 'level3';

    return 'level4';
  }
}

export const EXAM_SUBJECTS: Subject[] = [
  new Subject('toan', 'toan', 'Toán Học'),
  new Subject('nguVan', 'ngu_van', 'Ngữ Văn'),
  new Subject('ngoaiNgu', 'ngoai_ngu', 'Ngoại Ngữ'),
  new Subject('vatLi', 'vat_li', 'Vật Lí'),
  new Subject('hoaHoc', 'hoa_hoc', 'Hóa Học'),
  new Subject('sinhHoc', 'sinh_hoc', 'Sinh Học'),
  new Subject('lichSu', 'lich_su', 'Lịch Sử'),
  new Subject('diaLi', 'dia_li', 'Địa Lí'),
  new Subject('gdcd', 'gdcd', 'GDCD'),
];
