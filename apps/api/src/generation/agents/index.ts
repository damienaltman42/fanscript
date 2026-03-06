import { Agent, run, setDefaultOpenAIKey } from '@openai/agents';
import { GenerationContext, MODEL_BY_PLAN } from './context';
import {
  getCaptionSystemPrompt,
  getBioSystemPrompt,
  getDMScriptSystemPrompt,
  getContentIdeasSystemPrompt,
  getHashtagSystemPrompt,
} from './prompts';
import {
  CaptionOutputSchema,
  BioOutputSchema,
  DMScriptOutputSchema,
  ContentIdeasOutputSchema,
  HashtagOutputSchema,
  CaptionOutput,
  BioOutput,
  DMScriptOutput,
  ContentIdeasOutput,
  HashtagOutput,
} from './schemas';

// ─── INITIALIZE ───────────────────────────────────────────────────────────────

export function initAgents(apiKey: string) {
  setDefaultOpenAIKey(apiKey);
}

// ─── AGENTS ───────────────────────────────────────────────────────────────────

export async function runCaptionAgent(
  ctx: GenerationContext,
  userInput: string,
): Promise<CaptionOutput> {
  const model = MODEL_BY_PLAN[ctx.plan];

  const agent = new Agent({
    name: 'CaptionExpert',
    instructions: getCaptionSystemPrompt(ctx),
    model,
    outputType: CaptionOutputSchema,
    modelSettings: {
      temperature: 0.92, // High creativity for human-sounding output
      topP: 0.95,
    },
  });

  const result = await run(agent, userInput);
  return result.finalOutput as CaptionOutput;
}

export async function runBioAgent(
  ctx: GenerationContext,
  userInput: string,
): Promise<BioOutput> {
  const model = MODEL_BY_PLAN[ctx.plan];

  const agent = new Agent({
    name: 'BioExpert',
    instructions: getBioSystemPrompt(ctx),
    model,
    outputType: BioOutputSchema,
    modelSettings: { temperature: 0.88, topP: 0.95 },
  });

  const result = await run(agent, userInput);
  return result.finalOutput as BioOutput;
}

export async function runDMScriptAgent(
  ctx: GenerationContext,
  userInput: string,
): Promise<DMScriptOutput> {
  const model = MODEL_BY_PLAN[ctx.plan];

  const agent = new Agent({
    name: 'DMConversionExpert',
    instructions: getDMScriptSystemPrompt(ctx),
    model,
    outputType: DMScriptOutputSchema,
    modelSettings: { temperature: 0.85, topP: 0.95 },
  });

  const result = await run(agent, userInput);
  return result.finalOutput as DMScriptOutput;
}

export async function runContentIdeasAgent(
  ctx: GenerationContext,
  userInput: string,
): Promise<ContentIdeasOutput> {
  const model = MODEL_BY_PLAN[ctx.plan];

  const agent = new Agent({
    name: 'ContentStrategist',
    instructions: getContentIdeasSystemPrompt(ctx),
    model,
    outputType: ContentIdeasOutputSchema,
    modelSettings: { temperature: 0.9, topP: 0.95 },
  });

  const result = await run(agent, userInput);
  return result.finalOutput as ContentIdeasOutput;
}

export async function runHashtagAgent(
  ctx: GenerationContext,
  userInput: string,
): Promise<HashtagOutput> {
  const model = MODEL_BY_PLAN[ctx.plan];

  const agent = new Agent({
    name: 'HashtagStrategist',
    instructions: getHashtagSystemPrompt(ctx),
    model,
    outputType: HashtagOutputSchema,
    modelSettings: { temperature: 0.7, topP: 0.9 }, // Lower temp for accuracy
  });

  const result = await run(agent, userInput);
  return result.finalOutput as HashtagOutput;
}
