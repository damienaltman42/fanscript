import Link from 'next/link'

const FEATURES = [
  { emoji: '✍️', title: 'Captions', desc: 'Flirty, engaging captions for your posts that drive subscriptions and saves.' },
  { emoji: '👤', title: 'Profile Bio', desc: 'Irresistible bios that convert profile visitors into paying subscribers.' },
  { emoji: '💌', title: 'DM Scripts', desc: 'Personalized scripts to turn free followers into loyal, paying fans.' },
  { emoji: '💡', title: 'Content Ideas', desc: 'Daily fresh ideas tailored to your niche. Never hit a creative block again.' },
  { emoji: '#️⃣', title: 'Hashtags', desc: 'Platform-optimized hashtags to boost reach on Twitter, IG and TikTok.' },
]

const DEMO = {
  input: '"Mirror selfie in new red lingerie set, Friday night vibes"',
  output: `Friday nights just got a whole lot spicier... 😏✨

Can you guess what's hiding beneath this lace? 💖

The weekend has officially started and I'm feeling 🔥

Link in bio for the full set 👇 #FridayFeeling #LingerieLife`,
}

const STATS = [
  { value: '2,400+', label: 'Active Creators' },
  { value: '180K+', label: 'Captions Generated' },
  { value: '4.9★', label: 'Average Rating' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-950 via-purple-950 to-black text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="text-2xl font-bold text-pink-400">FanScript ✨</div>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-gray-400 hover:text-white transition text-sm hidden sm:block">
            Pricing
          </Link>
          <Link href="/login" className="text-gray-300 hover:text-white transition text-sm">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-full text-sm font-medium transition"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-300 px-4 py-1.5 rounded-full text-sm mb-8 border border-pink-500/20">
          🔥 <span>AI-Powered for Adult Creators</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Write Less.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Earn More.
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Generate perfect captions, irresistible bios, and high-converting DM scripts
          for your OnlyFans and Fansly — in seconds.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/register"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition shadow-lg shadow-pink-500/20"
          >
            Start for Free →
          </Link>
          <Link
            href="/pricing"
            className="border border-white/20 hover:border-pink-400 text-white px-8 py-4 rounded-full text-lg transition"
          >
            See Pricing
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-2xl mx-auto px-6 py-6 flex justify-center gap-12 flex-wrap">
        {STATS.map(s => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Live Demo */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/60"/>
              <span className="w-3 h-3 rounded-full bg-yellow-500/60"/>
              <span className="w-3 h-3 rounded-full bg-green-500/60"/>
            </div>
            <span className="text-sm text-gray-500 ml-2">Live Preview — Caption Generator</span>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-6">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Your input</div>
              <div className="bg-black/30 rounded-xl p-4 text-sm text-gray-300 italic border border-white/5">
                {DEMO.input}
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                {['Flirty', 'OnlyFans'].map(tag => (
                  <span key={tag} className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>✨ AI Generated</span>
                <span className="text-pink-400 animate-pulse">●</span>
              </div>
              <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                {DEMO.output}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-3">Everything you need</h2>
        <p className="text-gray-400 text-center mb-12">5 AI tools built specifically for adult content creators</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 hover:bg-white/8 transition group"
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-pink-300 transition">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
          {/* CTA card */}
          <div className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl p-6 border border-pink-500/20 flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold mb-2">Ready to start?</h3>
              <p className="text-gray-400 text-sm">10 free generations every month. No credit card required.</p>
            </div>
            <Link
              href="/register"
              className="mt-4 block text-center bg-pink-500 hover:bg-pink-600 text-white py-2.5 rounded-xl font-medium text-sm transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Creators love FanScript</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: 'Luna K.', handle: '@lunakiss_of', text: 'My DM conversion rate went from 8% to 23% in 2 weeks. This tool is insane.' },
            { name: 'Mia R.', handle: '@mia_real', text: 'I used to spend 2h writing captions. Now it takes 10 seconds and they\'re way better.' },
            { name: 'Aria V.', handle: '@ariavelvet', text: 'The content ideas feature alone is worth every penny. Never blocked anymore.' },
          ].map(t => (
            <div key={t.name} className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-gray-500">{t.handle}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Stop wasting time on copy.</h2>
        <p className="text-gray-400 mb-8">Join 2,400+ creators who write faster and earn more.</p>
        <Link
          href="/register"
          className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition shadow-lg shadow-pink-500/20"
        >
          Start for Free — No card needed
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 FanScript · <Link href="/pricing" className="hover:text-gray-300">Pricing</Link> · <a href="mailto:hello@fanscript.io" className="hover:text-gray-300">Contact</a></p>
      </footer>
    </main>
  )
}
