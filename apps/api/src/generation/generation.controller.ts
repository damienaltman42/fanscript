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
    return this.generationService.generateCaption(req.user.id, dto);
  }

  @Post('bio')
  bio(@Body() dto: GenerateDto, @Request() req) {
    return this.generationService.generateBio(req.user.id, dto);
  }

  @Post('dm-script')
  dmScript(@Body() dto: GenerateDto, @Request() req) {
    return this.generationService.generateDMScript(req.user.id, dto);
  }

  @Post('content-ideas')
  contentIdeas(@Body() dto: GenerateDto, @Request() req) {
    return this.generationService.generateContentIdeas(req.user.id, dto);
  }

  @Post('hashtags')
  hashtags(@Body() dto: GenerateDto, @Request() req) {
    return this.generationService.generateHashtags(req.user.id, dto);
  }

  @Get('history')
  history(@Request() req) {
    return this.generationService.getHistory(req.user.id);
  }

  @Get('usage')
  usage(@Request() req) {
    return this.generationService.getMonthlyUsage(req.user.id).then(count => ({ count, limit: 10 }));
  }
}
