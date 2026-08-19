import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'csv-parse';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { EXAM_SUBJECTS } from '../src/constants/subjects';

const DEFAULT_BATCH_SIZE = 1_000;
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
  }
}

class ExamScoreCsvMapper {
  map(record: CsvRecord, line: number): ExamScoreInput {
    const sbd = record.sbd?.trim() ?? '';
    if (!/^\d{8}$/.test(sbd)) {
      throw new CsvRowValidationError(
        line,
        'sbd must contain exactly 8 digits',
      );
    }

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

    for (const sub of EXAM_SUBJECTS) {
      (input as Record<string, string | null>)[sub.dtoKey] = this.parseScore(
        record[sub.dbColumn],
        sub.dbColumn,
        line,
      );
    }

    return input;
  }

  private parseScore(
    rawValue: string | undefined,
    column: string,
    line: number,
  ): string | null {
    const value = rawValue?.trim() ?? '';
    if (value === '') {
      return null;
    }

    const score = Number(value);
    if (!Number.isFinite(score) || score < 0 || score > 10) {
      throw new CsvRowValidationError(
        line,
        `${column} must be a number between 0 and 10`,
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

function parseOptions(argv: string[]): ImportOptions {
  const optionValue = (name: string) => {
    const index = argv.indexOf(name);
    return index === -1 ? undefined : argv[index + 1];
  };

  const file = optionValue('--file');
  if (!file) {
    throw new Error(
      'Missing CSV path. Example: npm run db:import -- --file ../dataset/diem_thi_thpt_2024.csv',
    );
  }

  const batchSize = Number(optionValue('--batch-size') ?? DEFAULT_BATCH_SIZE);
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 10_000) {
    throw new Error('--batch-size must be an integer from 1 to 10000');
  }

  return {
    filePath: resolve(file),
    batchSize,
  };
}

async function importExamScores(options: ImportOptions): Promise<void> {
  if (!existsSync(options.filePath)) {
    throw new Error(`CSV file not found: ${options.filePath}`);
  }

  const mapper = new ExamScoreCsvMapper();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    const count = await prisma.examScore.count();
    if (count > 0) {
      console.info('Database already contains exam scores. Skipping import.');
      return;
    }
  } catch (error) {
    console.error('Failed to check database, continuing with import...', error);
  }

  const parser = createReadStream(options.filePath).pipe(
    parse({
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }),
  );

  let batch: ExamScoreInput[] = [];
  let imported = 0;
  let line = 1;

  try {
    for await (const rawRecord of parser) {
      line += 1;
      batch.push(mapper.map(rawRecord as CsvRecord, line));

      if (batch.length === options.batchSize) {
        await writeBatch(prisma, batch);
        imported += batch.length;
        batch = [];
        console.info(`Processed ${imported.toLocaleString()} records`);
      }
    }

    if (batch.length > 0) {
      await writeBatch(prisma, batch);
      imported += batch.length;
    }

    console.info(`Imported ${imported.toLocaleString()} records successfully.`);
  } finally {
    await prisma.$disconnect();
  }
}

async function writeBatch(
  prisma: PrismaClient,
  batch: ExamScoreInput[],
): Promise<void> {
  await prisma.examScore.createMany({
    data: batch,
    skipDuplicates: true,
  });
}

async function bootstrap() {
  const options = parseOptions(process.argv.slice(2));
  await importExamScores(options);
}

void bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
