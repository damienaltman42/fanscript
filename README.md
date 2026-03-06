# FanScript 🎬

AI-powered copywriting tool for adult content creators.
Generate captions, bios, DM scripts, and content ideas instantly.

## Stack
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 14 + Tailwind CSS
- **AI**: OpenAI GPT-4o-mini
- **Payments**: Stripe

## Getting Started

```bash
pnpm install
cp .env.example .env
# Fill in your .env values

# Start DB
docker-compose up -d

# Run migrations
cd apps/api && pnpm prisma migrate dev

# Start dev servers
pnpm dev
```

## Pricing
| Plan | Price | Generations |
|------|-------|-------------|
| Free | $0 | 10/month |
| Pro | $19/mo | Unlimited |
| Business | $49/mo | Unlimited + API |
