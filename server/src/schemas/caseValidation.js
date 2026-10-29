import { z } from 'zod';

export const DifficultyEnum = z.enum(['easy', 'medium', 'hard']);

export const CreateCaseInputSchema = z.object({
  premise: z.string().trim().min(3, 'Premise must be at least 3 characters long').max(500, 'Premise must be under 500 characters'),
  difficulty: DifficultyEnum.default('medium'),
});

export const AccusationInputSchema = z.object({
  suspectId: z.string().min(1, 'Suspect ID is required'),
  rationale: z.string().trim().min(5, 'Please provide your investigative reasoning (at least 5 characters)'),
});

export const GeminiCaseOutputSchema = z.object({
  title: z.string().min(3),
  story: z.string().min(30),
  victim: z.object({
    name: z.string(),
    description: z.string(),
  }),
  crimeScene: z.object({
    location: z.string(),
    time: z.string(),
    description: z.string(),
  }),
  suspects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
      description: z.string(),
      alibi: z.string(),
      motive: z.string(),
      isCulprit: z.boolean(),
    })
  ),
  clues: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      location: z.string(),
    })
  ),
  hints: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
      text: z.string(),
    })
  ),
  solution: z.object({
    culpritId: z.string(),
    culpritName: z.string(),
    motive: z.string(),
    explanation: z.string(),
  }),
});
