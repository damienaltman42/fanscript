import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class BillingService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY'));
  }

  async createCheckoutSession(userId: string, plan: 'PRO' | 'BUSINESS') {
    const priceId = plan === 'PRO'
      ? this.config.get('STRIPE_PRICE_PRO')
      : this.config.get('STRIPE_PRICE_BUSINESS');

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${this.config.get('APP_URL')}/dashboard?success=true`,
      cancel_url: `${this.config.get('APP_URL')}/pricing`,
      metadata: { userId, plan },
    });

    return { url: session.url };
  }

  async createPortalSession(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub?.stripeCustomerId) throw new BadRequestException('No active subscription');

    const session = await this.stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${this.config.get('APP_URL')}/dashboard`,
    });

    return { url: session.url };
  }

  async handleWebhook(sig: string, rawBody: Buffer) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        this.config.get('STRIPE_WEBHOOK_SECRET'),
      );
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.CheckoutSession;
        const { userId, plan } = session.metadata;
        await this.prisma.subscription.update({
          where: { userId },
          data: {
            plan: plan as any,
            stripeCustomerId: session.customer as string,
            stripeSubId: session.subscription as string,
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await this.prisma.subscription.updateMany({
          where: { stripeSubId: sub.id },
          data: { plan: 'FREE', stripeSubId: null },
        });
        break;
      }
    }

    return { received: true };
  }
}
