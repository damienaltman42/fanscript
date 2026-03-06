import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['10 generations/month', 'All tools included', 'Copy to clipboard'],
    cta: 'Start Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    features: ['Unlimited generations', 'All tools included', 'Priority processing', 'History (50 items)'],
    cta: 'Get Pro',
    href: '/register?plan=PRO',
    highlight: true,
  },
  {
    name: 'Business',
    price: '$49',
    period: '/month',
    features: ['Everything in Pro', 'API access', 'Bulk generation', 'Priority support'],
    cta: 'Get Business',
    href: '/register?plan=BUSINESS',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-purple-950 to-black text-white">
      <nav className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-pink-400">FanScript ✨</Link>
        <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Simple Pricing</h1>
        <p className="text-gray-400 mb-16 text-lg">Start free. Upgrade when you're ready to scale.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-2xl p-8 border ${
              plan.highlight ? 'border-pink-500 bg-pink-500/10 scale-105' : 'border-white/10 bg-white/5'
            }`}>
              {plan.highlight && <div className="text-pink-400 text-sm font-medium mb-4">⭐ Most Popular</div>}
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-gray-300">
                    <span className="text-pink-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}
                className={`block w-full py-3 rounded-xl font-semibold text-center transition ${
                  plan.highlight ? 'bg-pink-500 hover:bg-pink-600' : 'border border-white/20 hover:bg-white/10'
                }`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
