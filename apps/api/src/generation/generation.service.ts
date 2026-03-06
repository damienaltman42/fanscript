import { Injectable, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import { GenerateDto } from './dto/generate.dto';
import { GenerationContext, NsfwLevel, Platform, SupportedLanguage, UserPlan } from './agents/context';
import {
  initAgents,
  runCaptionAgent,
  runBioAgent,
  runDMScriptAgent,
  runContentIdeasAgent,
  runHashtagAgent,
} from './agents';

const FREE_LIMIT = 10;

const GEN_TYPE_MAP = {
  caption: 'CAPTION',
  bio: 'BIO',
  'dm-script': 'DM_SCRIPT',
  'content-ideas': 'CONTENT_IDEAS',
  hashtags: 'HASHTAGS',
} as const;

@Injectable()
export class GenerationService implements OnModuleInit {

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  onModuleInit() {
    initAgents(this.config.get('OPENAI_API_KEY'));
  }

  private async getUserContext(userId: string, dto: GenerateDto): Promise<GenerationContext> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    const plan = (user?.subscription?.plan ?? 'FREE') as UserPlan;

    return {
      userId,
      plan,
      language: (dto.language ?? 'en') as SupportedLanguage,
      platform: (dto.platform ?? 'OnlyFans') as Platform,
      niche: dto.niche ?? '',
      tone: dto.tone ?? 'Flirty',
      nsfwLevel: (dto.nsfwLevel ?? 2) as NsfwLevel,
      creatorName: user?.name ?? undefined,
    };
  }

  private async checkQuota(userId: string, plan: string): Promise<void> {
    if (plan !== 'FREE') return;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const count = await this.prisma.generation.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    });
    if (count >= FREE_LIMIT) {
      throw new ForbiddenException('Monthly limit reached. Upgrade to Pro for unlimited generations.');
    }
  }

  private async saveGeneration(userId: string, type: string, prompt: string, result: any) {
    return this.prisma.generation.create({
      data: {
        userId,
        type: type as any,
        prompt,
        result: JSON.stringify(result),
        tokens: 0,
      },
    });
  }

  async generateCaption(userId: string, dto: GenerateDto) {
    const ctx = await this.getUserContext(userId, dto);
    await this.checkQuota(userId, ctx.plan);
    const output = await runCaptionAgent(ctx, dto.context);
    await this.saveGeneration(userId, 'CAPTION', dto.context, output);
    return output;
  }

  async generateBio(userId: string, dto: GenerateDto) {
    const ctx = await this.getUserContext(userId, dto);
    await this.checkQuota(userId, ctx.plan);
    const output = await runBioAgent(ctx, dto.context);
    await this.saveGeneration(userId, 'BIO', dto.context, output);
    return output;
  }

  async generateDMScript(userId: string, dto: GenerateDto) {
    const ctx = await this.getUserContext(userId, dto);
    await this.checkQuota(userId, ctx.plan);
    const output = await runDMScriptAgent(ctx, dto.context);
    await this.saveGeneration(userId, 'DM_SCRIPT', dto.context, output);
    return output;
  }

  async generateContentIdeas(userId: string, dto: GenerateDto) {
    const ctx = await this.getUserContext(userId, dto);
    await this.checkQuota(userId, ctx.plan);
    const output = await runContentIdeasAgent(ctx, dto.context);
    await this.saveGeneration(userId, 'CONTENT_IDEAS', dto.context, output);
    return output;
  }

  async generateHashtags(userId: string, dto: GenerateDto) {
    const ctx = await this.getUserContext(userId, dto);
    await this.checkQuota(userId, ctx.plan);
    const output = await runHashtagAgent(ctx, dto.context);
    await this.saveGeneration(userId, 'HASHTAGS', dto.context, output);
    return output;
  }

  async getHistory(userId: string) {
    const items = await this.prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return items.map(item => ({
      ...item,
      result: (() => { try { return JSON.parse(item.result); } catch { return item.result; } })(),
    }));
  }

  async getMonthlyUsage(userId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    return this.prisma.generation.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    });
  }
}
