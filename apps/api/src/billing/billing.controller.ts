import { Controller, Post, Body, UseGuards, Request, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  createCheckout(@Body('plan') plan: string, @Request() req) {
    return this.billingService.createCheckoutSession(req.user.id, plan);
  }

  @UseGuards(JwtAuthGuard)
  @Post('portal')
  createPortal(@Request() req) {
    return this.billingService.createPortalSession(req.user.id);
  }

  @Post('webhook')
  webhook(@Headers('stripe-signature') sig: string, @Req() req: RawBodyRequest<Request>) {
    return this.billingService.handleWebhook(sig, req.rawBody);
  }
}
