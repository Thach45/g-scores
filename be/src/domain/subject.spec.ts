import { Subject } from './subject';

describe('Subject Domain Class', () => {
  const math = new Subject('toan', 'toan', 'Toán Học');

  describe('isValidScore', () => {
    it('should return true for valid scores between 0 and 10', () => {
      expect(math.isValidScore(0)).toBe(true);
      expect(math.isValidScore(5.5)).toBe(true);
      expect(math.isValidScore(10)).toBe(true);
    });

    it('should return false for invalid scores', () => {
      expect(math.isValidScore(-1)).toBe(false);
      expect(math.isValidScore(10.1)).toBe(false);
      expect(math.isValidScore(NaN)).toBe(false);
    });
  });

  describe('classifyScore', () => {
    it('should return level1 for scores >= 8', () => {
      expect(math.classifyScore(8)).toBe('level1');
      expect(math.classifyScore(10)).toBe('level1');
    });

    it('should return level2 for scores >= 6 and < 8', () => {
      expect(math.classifyScore(6)).toBe('level2');
      expect(math.classifyScore(7.5)).toBe('level2');
    });

    it('should return level3 for scores >= 4 and < 6', () => {
      expect(math.classifyScore(4)).toBe('level3');
      expect(math.classifyScore(5.9)).toBe('level3');
    });

    it('should return level4 for scores < 4', () => {
      expect(math.classifyScore(0)).toBe('level4');
      expect(math.classifyScore(3.5)).toBe('level4');
    });

    it('should throw an error for invalid scores', () => {
      expect(() => math.classifyScore(-1)).toThrow(
        'Invalid score for Toán Học: -1',
      );
      expect(() => math.classifyScore(10.5)).toThrow(
        'Invalid score for Toán Học: 10.5',
      );
    });
  });
});
