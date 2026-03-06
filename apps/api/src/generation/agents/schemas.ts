import { z } from 'zod';

// ─── OUTPUT SCHEMAS ───────────────────────────────────────────────────────────

export const CaptionOutputSchema = z.object({
  variations: z.array(z.object({
    index: z.number(),
    text: z.string(),
    hook: z.string().describe('The first line / attention hook'),
    cta: z.string().describe('The call-to-action used'),
    charCount: z.number(),
  })),
  tips: z.array(z.string()).describe('2-3 pro tips for using these captions'),
});

export const BioOutputSchema = z.object({
  variations: z.array(z.object({
    index: z.number(),
    text: z.string(),
    type: z.enum(['short', 'long']),
    charCount: z.number(),
  })),
  tips: z.array(z.string()),
});

export const DMScriptOutputSchema = z.object({
  scripts: z.array(z.object({
    scenario: z.string().describe('e.g. New follower, Inactive subscriber'),
    messages: z.array(z.string()).describe('Individual messages to send'),
    conversionTip: z.string().describe('Why this approach works'),
  })),
});

export const ContentIdeasOutputSchema = z.object({
  viral: z.array(z.object({
    title: z.string(),
    description: z.string(),
    why: z.string(),
  })),
  monetization: z.array(z.object({
    title: z.string(),
    description: z.string(),
    why: z.string(),
  })),
  retention: z.array(z.object({
    title: z.string(),
    description: z.string(),
    why: z.string(),
  })),
});

export const HashtagOutputSchema = z.object({
  fullSet: z.array(z.string()).describe('30 hashtags'),
  compactSet: z.array(z.string()).describe('10 best performers'),
  trendingSet: z.array(z.string()).describe('10 trending/growing tags'),
  warning: z.string().optional().describe('Any platform-specific warnings'),
});

export type CaptionOutput = z.infer<typeof CaptionOutputSchema>;
export type BioOutput = z.infer<typeof BioOutputSchema>;
export type DMScriptOutput = z.infer<typeof DMScriptOutputSchema>;
export type ContentIdeasOutput = z.infer<typeof ContentIdeasOutputSchema>;
export type HashtagOutput = z.infer<typeof HashtagOutputSchema>;
