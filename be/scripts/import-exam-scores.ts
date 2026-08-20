import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'csv-parse';
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { EXAM_SUBJECTS, Subject } from 'src/domain/subject';

const DEFAULT_BATCH_SIZE = 5_000;

type CsvRecord = Record<string, string | undefined>;

type ExamScoreInput = {
  sbd: string;

  toan: string | null;
  nguVan: string | null;
  ngoaiNgu: string | null;

  vatLi: string | null;
  hoaHoc: string | null;
  sinhHoc: string | null;

  lichSu: string | null;
  diaLi: string | null;
  gdcd: string | null;

  maNgoaiNgu: string | null;
};

type ImportOptions = {
  filePath: string;
  batchSize: number;
};

class CsvRowValidationError extends Error {
  constructor(
    readonly line: number,
    message: string,
  ) {
    super(`CSV line ${line}: ${message}`);
    this.name = 'CsvRowValidationError';
  }
}

class CsvHeaderValidationError extends Error {
  constructor(message: string) {
    super(`Invalid CSV header: ${message}`);
    this.name = 'CsvHeaderValidationError';
  }
}

function validateCsvHeaders(headers: string[]): string[] {
  const normalizedHeaders = headers.map((header) => header.trim());
  const requiredHeaders = [
    'sbd',
    ...EXAM_SUBJECTS.map((subject) => subject.dbColumn),
    'ma_ngoai_ngu',
  ];
  const uniqueHeaders = new Set(normalizedHeaders);
  const missingHeaders = requiredHeaders.filter(
    (header) => !uniqueHeaders.has(header),
  );
  const duplicateHeaders = normalizedHeaders.filter(
    (header, index) => normalizedHeaders.indexOf(header) !== index,
  );

  if (missingHeaders.length > 0) {
    throw new CsvHeaderValidationError(
      `missing required column(s): ${missingHeaders.join(', ')}`,
    );
  }

  if (duplicateHeaders.length > 0) {
    throw new CsvHeaderValidationError(
      `duplicate column(s): ${[...new Set(duplicateHeaders)].join(', ')}`,
    );
  }

  return normalizedHeaders;
}

class ExamScoreCsvMapper {
  constructor(private readonly subjects: Subject[]) {}

  map(record: CsvRecord, line: number): ExamScoreInput {
    const sbd = this.parseRegistrationNumber(record.sbd, line);

    const input: ExamScoreInput = {
      sbd,

      toan: null,
      nguVan: null,
      ngoaiNgu: null,

      vatLi: null,
      hoaHoc: null,
      sinhHoc: null,

      lichSu: null,
      diaLi: null,
      gdcd: null,

      maNgoaiNgu: this.parseForeignLanguageCode(record.ma_ngoai_ngu, line),
    };

    for (const subject of this.subjects) {
      (input as Record<string, string | null>)[subject.dtoKey] =
        this.parseScore(record[subject.dbColumn], subject, line);
    }

    return input;
  }

  private parseRegistrationNumber(
    rawValue: string | undefined,
    line: number,
  ): string {
    const value = rawValue?.trim() ?? '';

    if (!/^\d{8}$/.test(value)) {
      throw new CsvRowValidationError(
        line,
        'sbd must contain exactly 8 digits',
      );
    }

    return value;
  }

  private parseScore(
    rawValue: string | undefined,
    subject: Subject,
    line: number,
  ): string | null {
    const value = rawValue?.trim() ?? '';

    if (value === '') {
      return null;
    }

    const score = Number(value);

    if (!subject.isValidScore(score)) {
      throw new CsvRowValidationError(
        line,
        `${subject.dbColumn} must be a number between 0 and 10`,
      );
    }

    return value;
  }

  private parseForeignLanguageCode(
    rawValue: string | undefined,
    line: number,
  ): string | null {
    const value = rawValue?.trim() ?? '';

    if (value === '') {
      return null;
    }

    if (!/^N[1-7]$/.test(value)) {
      throw new CsvRowValidationError(
        line,
        'ma_ngoai_ngu must be one of N1 through N7',
      );
    }

    return value;
  }
}

class ExamScoreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async insertBatch(batch: ExamScoreInput[]): Promise<number> {
    if (batch.length === 0) {
      return 0;
    }

    const result = await this.prisma.examScore.createMany({
      data: batch,
      skipDuplicates: true,
    });

    return result.count;
  }
}

class ExamScoreCsvImporter {
  constructor(
    private readonly mapper: ExamScoreCsvMapper,
    private readonly repository: ExamScoreRepository,
  ) {}

  async import(options: ImportOptions): Promise<void> {
    if (!existsSync(options.filePath)) {
      throw new Error(`CSV file not found: ${options.filePath}`);
    }

    const parser = createReadStream(options.filePath).pipe(
      parse({
        bom: true,
        columns: validateCsvHeaders,
        skip_empty_lines: true,
        trim: true,
      }),
    );

    let batch: ExamScoreInput[] = [];

    let fileLine = 1;
    let processedCount = 0;
    let insertedCount = 0;

    console.info(`Starting CSV import from: ${options.filePath}`);

    console.info(`Batch size: ${options.batchSize.toLocaleString()}`);

    for await (const rawRecord of parser) {
      fileLine += 1;

      const mapped = this.mapper.map(rawRecord as CsvRecord, fileLine);

      batch.push(mapped);
      processedCount += 1;

      if (batch.length >= options.batchSize) {
        insertedCount += await this.flushBatch(batch);

        batch = [];

        console.info(this.formatProgress(processedCount, insertedCount));
      }
    }

    if (batch.length > 0) {
      insertedCount += await this.flushBatch(batch);
    }

    const skippedCount = processedCount - insertedCount;

    console.info('');
    console.info('CSV import completed.');
    console.info(`Processed: ${processedCount.toLocaleString()}`);
    console.info(`Inserted: ${insertedCount.toLocaleString()}`);
    console.info(`Skipped duplicates: ${skippedCount.toLocaleString()}`);
  }

  private async flushBatch(batch: ExamScoreInput[]): Promise<number> {
    return this.repository.insertBatch(batch);
  }

  private formatProgress(
    processedCount: number,
    insertedCount: number,
  ): string {
    return [
      `Processed ${processedCount.toLocaleString()} rows`,
      `Inserted ${insertedCount.toLocaleString()}`,
      `Skipped ${(processedCount - insertedCount).toLocaleString()}`,
    ].join(' | ');
  }
}

function parseOptions(argv: string[]): ImportOptions {
  const getOptionValue = (name: string): string | undefined => {
    const index = argv.indexOf(name);

    if (index === -1) {
      return undefined;
    }

    return argv[index + 1];
  };

  const filePath = getOptionValue('--file');

  if (!filePath) {
    throw new Error(
      [
        'Missing CSV path.',
        'Example:',
        'npm run db:import -- --file ../dataset/diem_thi.csv',
      ].join(' '),
    );
  }

  const batchSize = Number(
    getOptionValue('--batch-size') ?? DEFAULT_BATCH_SIZE,
  );

  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 500_000) {
    throw new Error('--batch-size must be an integer from 1 to 500,000');
  }

  return {
    filePath: resolve(filePath),
    batchSize,
  };
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl,
    }),
  });
}

async function bootstrap(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));

  const prisma = createPrismaClient();

  const mapper = new ExamScoreCsvMapper(EXAM_SUBJECTS);

  const repository = new ExamScoreRepository(prisma);

  const importer = new ExamScoreCsvImporter(mapper, repository);

  try {
    await importer.import(options);
  } finally {
    await prisma.$disconnect();
  }
}

void bootstrap().catch((error: unknown) => {
  if (
    error instanceof CsvRowValidationError ||
    error instanceof CsvHeaderValidationError
  ) {
    console.error(`Invalid CSV data: ${error.message}`);
  } else if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Unexpected import error:', error);
  }

  process.exitCode = 1;
});
