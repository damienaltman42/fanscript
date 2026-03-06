import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-950 via-purple-950 to-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="text-2xl font-bold text-pink-400">FanScript ✨</div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
          <Link href="/register" className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-full font-medium transition">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 py-24">
        <div className="inline-block bg-pink-500/20 text-pink-300 px-4 py-1 rounded-full text-sm mb-6">
          🔥 AI-Powered for Adult Creators
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Write Less.<br />
          <span className="text-pink-400">Earn More.</span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Generate perfect captions, irresistible bios, and high-converting DM scripts 
          for your OnlyFans and Fansly in seconds.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition">
            Start for Free →
          </Link>
          <Link href="/pricing" className="border border-pink-500/30 hover:border-pink-400 text-pink-300 px-8 py-4 rounded-full text-lg transition">
            See Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        {[
          { emoji: '✍️', title: 'Captions', desc: 'Flirty, engaging captions that drive subscriptions.' },
          { emoji: '💌', title: 'DM Scripts', desc: 'Convert free followers into paying fans effortlessly.' },
          { emoji: '🎯', title: 'Content Ideas', desc: 'Never run out of ideas. Daily inspiration tailored to your niche.' },
        ].map(f => (
          <div key={f.title} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 transition">
            <div className="text-4xl mb-4">{f.emoji}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
