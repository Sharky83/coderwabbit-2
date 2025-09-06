import { z } from 'zod';

export const ComplexitySummarySchema = z.object({
  totalFiles: z.number().optional(),
  skippedFiles: z.array(z.string()).optional(),
  mostComplexFiles: z.array(z.object({
    file: z.string(),
    cyclomatic: z.number(),
    maintainability: z.number(),
  })).optional(),
  mostComplexFunctions: z.array(z.object({
    file: z.string(),
    name: z.string(),
    cyclomatic: z.number(),
    line: z.number(),
  })).optional(),
  error: z.string().optional(),
  info: z.string().optional(),
});

export const DuplicationSummarySchema = z.object({
  totalClones: z.number().optional(),
  clones: z.array(z.object({
    format: z.string(),
    lines: z.number(),
    tokens: z.number(),
    sources: z.array(z.object({
      file: z.string(),
      start: z.number(),
      end: z.number(),
    })),
  })).optional(),
  error: z.string().optional(),
  info: z.string().optional(),
});

export const ResultsSchema = z.object({
  complexitySummary: ComplexitySummarySchema,
  duplicationSummary: DuplicationSummarySchema,
  suggestions: z.array(z.string()),
  detectedLanguages: z.array(z.string()),
  language: z.string(),
  // You can add more fields here as needed
});
