import { Test, TestingModule } from '@nestjs/testing';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';

describe('ScoresController', () => {
  let controller: ScoresController;
  let service: jest.Mocked<ScoresService>;

  // Tạo mock service giả lập các hàm xử lý DB
  const mockScoresService = {
    findStatistics: jest.fn(),
    findTopGroupA: jest.fn(),
    findByRegistrationNumber: jest.fn(),
  };

  // Tạo mock Cache Manager để NestJS interceptor không bị lỗi khi quét Cache
  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoresController],
      providers: [
        {
          provide: ScoresService,
          useValue: mockScoresService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    controller = module.get<ScoresController>(ScoresController);
    service = module.get(ScoresService);
  });

  afterEach(() => {
    // Xóa sạch lịch sử gọi hàm giả lập sau mỗi bài test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findStatistics', () => {
    it('should return statistics results from service', async () => {
      const expectedResult = [
        { subject: 'toan', level1: 100, level2: 200, level3: 300, level4: 400 },
      ];
      mockScoresService.findStatistics.mockResolvedValue(expectedResult);

      const result = await controller.findStatistics();
      expect(result).toEqual(expectedResult);
      expect(service.findStatistics).toHaveBeenCalledTimes(1);
    });
  });

  describe('findTopGroupA', () => {
    it('should return top group A students from service', async () => {
      const expectedResult = [
        {
          sbd: '01000001',
          toan: 9.0,
          vat_li: 8.5,
          hoa_hoc: 9.5,
          total_score: 27,
        },
      ];
      mockScoresService.findTopGroupA.mockResolvedValue(expectedResult);

      const result = await controller.findTopGroupA();
      expect(result).toEqual(expectedResult);
      expect(service.findTopGroupA).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByRegistrationNumber', () => {
    it('should return score for a valid SBD', async () => {
      const expectedResult = {
        sbd: '01000001',
        toan: 8.0,
        nguVan: 7.5,
        ngoaiNgu: 9.0,
        vatLi: null,
        hoaHoc: null,
        sinhHoc: null,
        lichSu: null,
        diaLi: null,
        gdcd: null,
        maNgoaiNgu: 'N1',
      };
      mockScoresService.findByRegistrationNumber.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findByRegistrationNumber({
        sbd: '01000001',
      });
      expect(result).toEqual(expectedResult);
      expect(service.findByRegistrationNumber).toHaveBeenCalledWith('01000001');
    });

    it('should propagate NotFoundException if student is not found', async () => {
      mockScoresService.findByRegistrationNumber.mockRejectedValue(
        new NotFoundException(
          'No score found for registration number 99999999',
        ),
      );

      await expect(
        controller.findByRegistrationNumber({ sbd: '99999999' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
