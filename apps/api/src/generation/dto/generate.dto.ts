import { IsString, IsOptional } from 'class-validator';
export class GenerateDto {
  @IsString() context: string;
  @IsOptional() @IsString() niche?: string;
  @IsOptional() @IsString() tone?: string;
}
