import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GenerationService } from './generation.service';
import { GenerateDto } from './dto/generate.dto';

@UseGuards(JwtAuthGuard)
@Controller('generate')
export class GenerationController {
  constructor(private generationService: GenerationService) {}

  @Post('caption')
  caption(@Body() dto: GenerateDto, @Request() req) {
    return this.generationService.generate(req.user.id, 'CAPTION', dto);
  }

  @Post('bio')
  bio(@Body() dto: GenerateDto, @Request() req) {
    return this.generationService.generate(req.user.id, 'BIO', dto);
  }

  @Post('dm-script')
  dmScript(@Body() dto: GenerateDto, @Request() req) {
    return this.generationService.generate(req.user.id, 'DM_SCRIPT', dto);
  }

  @Post('content-ideas')
  contentIdeas(@Body() dto: GenerateDto, @Request() req) {
    return this.generationService.generate(req.user.id, 'CONTENT_IDEAS', dto);
  }

  @Post('hashtags')
  hashtags(@Body() dto: GenerateDto, @Request() req) {
    return this.generationService.generate(req.user.id, 'HASHTAGS', dto);
  }

  @Get('history')
  history(@Request() req) {
    return this.generationService.getHistory(req.user.id);
  }
}
