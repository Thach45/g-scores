import { ExamScoreCsvMapper } from '../../scripts/import-exam-scores';
import { EXAM_SUBJECTS } from './subject';

describe('ExamScoreCsvMapper', () => {
  let mapper: ExamScoreCsvMapper;

  beforeEach(() => {
    mapper = new ExamScoreCsvMapper(EXAM_SUBJECTS);
  });

  it('should return an error if SBD is less than 8 digits', () => {
    const invalidRecord = {
      sbd: '123',
    };

    expect(() => mapper.map(invalidRecord, 1)).toThrow();
  });
  it('should return an error if a score is invalid', () => {
    const invalidRecord = {
      sbd: '01000001',
      toan: '11',
    };

    expect(() => mapper.map(invalidRecord, 1)).toThrow();
  });
});
