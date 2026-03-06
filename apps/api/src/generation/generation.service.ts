import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../common/prisma.service';
import { GenerateDto } from './dto/generate.dto';

const FREE_LIMIT = 10;

const PROMPTS = {
  CAPTION: (dto: GenerateDto) =>
    `You are an expert copywriter for adult content creators on OnlyFans/Fansly.
Create an engaging, seductive caption for a post. Keep it flirty and within platform guidelines.
Creator niche: ${dto.niche || 'general'}
Tone: ${dto.tone || 'flirty'}
Context: ${dto.context}
Generate 3 caption variations.`,

  BIO: (dto: GenerateDto) =>
    `Write a compelling profile bio for an adult content creator.
Niche: ${dto.niche || 'general'}
Personality: ${dto.tone || 'confident'}
Key info: ${dto.context}
Generate 2 bio options (under 150 chars each).`,

  DM_SCRIPT: (dto: GenerateDto) =>
    `Write a personalized DM script to convert a free follower to a paying subscriber.
Creator niche: ${dto.niche || 'general'}
Scenario: ${dto.context}
Make it feel personal, not spammy. 3-5 sentences.`,

  CONTENT_IDEAS: (dto: GenerateDto) =>
    `Generate 10 content ideas for an adult creator.
Niche: ${dto.niche || 'general'}
Context: ${dto.context}
Mix free teasers and premium content ideas. Be creative but within OnlyFans guidelines.`,

  HASHTAGS: (dto: GenerateDto) =>
    `Generate optimal hashtags for adult content.
Platform: ${dto.context || 'Twitter/X'}
Niche: ${dto.niche || 'general'}
Return 20-30 relevant hashtags, ordered by relevance.`,
};

@Injectable()
export class GenerationService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.openai = new OpenAI({ apiKey: this.config.get('OPENAI_API_KEY') });
  }

  async generate(userId: string, type: keyof typeof PROMPTS, dto: GenerateDto) {
    // Check quota for free users
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (user.subscription?.plan === 'FREE') {
      const currentMonth = new Date();
      currentMonth.setDate(1); currentMonth.setHours(0, 0, 0, 0);
      const count = await this.prisma.generation.count({
        where: { userId, createdAt: { gte: currentMonth } },
      });
      if (count >= FREE_LIMIT)
        throw new ForbiddenException('Monthly limit reached. Upgrade to Pro for unlimited generations.');
    }

    const prompt = PROMPTS[type](dto);
    const completion = await this.openai.chat.completions.create({
      model: this.config.get('OPENAI_MODEL', 'gpt-4o-mini'),
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    const result = completion.choices[0].message.content;
    const tokens = completion.usage?.total_tokens || 0;

    const generation = await this.prisma.generation.create({
      data: { userId, type, prompt: dto.context, result, tokens },
    });

    return { result, generationId: generation.id, tokensUsed: tokens };
  }

  async getHistory(userId: string) {
    return this.prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
