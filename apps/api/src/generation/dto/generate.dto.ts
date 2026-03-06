import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';

export class GenerateDto {
  @IsString()
  context: string;

  @IsOptional()
  @IsString()
  niche?: string;

  @IsOptional()
  @IsString()
  tone?: string;

  @IsOptional()
  @IsEnum(['en', 'fr', 'es', 'it', 'de', 'pt', 'zh', 'ja'])
  language?: string;

  @IsOptional()
  @IsEnum(['OnlyFans', 'Fansly', 'Twitter/X', 'Instagram', 'TikTok', 'Patreon'])
  platform?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  nsfwLevel?: number;
}
