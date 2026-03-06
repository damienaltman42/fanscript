'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SUPPORTED_LANGUAGES, detectBrowserLanguage, LangCode } from '@/lib/i18n'

type GenType = 'caption' | 'bio' | 'dm-script' | 'content-ideas' | 'hashtags'

const TOOLS = [
  { id: 'caption', label: 'Caption', emoji: '✍️', desc: 'Flirty post captions' },
  { id: 'bio', label: 'Bio', emoji: '👤', desc: 'Bios that convert' },
  { id: 'dm-script', label: 'DM Script', emoji: '💌', desc: 'Convert followers to fans' },
  { id: 'content-ideas', label: 'Ideas', emoji: '💡', desc: 'Never run out of ideas' },
  { id: 'hashtags', label: 'Hashtags', emoji: '#️⃣', desc: 'Platform-optimized tags' },
]

const TONES = ['Flirty', 'Bold', 'Playful', 'Mysterious', 'Confident', 'Sweet']
const PLATFORMS = ['OnlyFans', 'Fansly', 'Twitter/X', 'Instagram', 'TikTok', 'Patreon']

const NSFW_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Suggestive', color: 'text-blue-400' },
  2: { label: 'Sensual', color: 'text-purple-400' },
  3: { label: 'Explicit', color: 'text-pink-400' },
  4: { label: 'Very Explicit', color: 'text-orange-400' },
  5: { label: '🔥 No Limits', color: 'text-red-400' },
}

const EXAMPLES: Record<string, string> = {
  'caption': 'Mirror selfie in new red lace bodysuit, Friday night, home alone...',
  'bio': 'Fitness creator, 24, loves yoga and coffee, 5K followers',
  'dm-script': 'New follower who liked 3 of my posts in a row',
  'content-ideas': 'Lingerie + fitness niche, 3K subscribers, summer coming',
  'hashtags': 'Fitness + lingerie creator, posting on Twitter and OF',
}

// ─── Result Renderers ─────────────────────────────────────────────────────────

function CaptionResult({ data, onCopy }: { data: any; onCopy: (text: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3">
        {data.variations?.map((v: any) => (
          <div key={v.index} className="bg-black/20 rounded-xl p-4 border border-white/5 group relative">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs text-pink-400 font-medium">Variation {v.index}</span>
              <button
                onClick={() => onCopy(v.text)}
                className="opacity-0 group-hover:opacity-100 transition text-xs text-gray-400 hover:text-white bg-white/10 px-2 py-0.5 rounded"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{v.text}</p>
            <div className="flex gap-3 mt-2 text-xs text-gray-600">
              <span>Hook: <span className="text-gray-400 italic">"{v.hook}"</span></span>
              <span>· {v.charCount} chars</span>
            </div>
          </div>
        ))}
      </div>
      {data.tips?.length > 0 && (
        <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3">
          <p className="text-xs text-yellow-400 font-medium mb-1.5">💡 Pro Tips</p>
          {data.tips.map((t: string, i: number) => (
            <p key={i} className="text-xs text-gray-400 leading-relaxed">• {t}</p>
          ))}
        </div>
      )}
    </div>
  )
}

function BioResult({ data, onCopy }: { data: any; onCopy: (text: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {data.variations?.map((v: any) => (
        <div key={v.index} className="bg-black/20 rounded-xl p-4 border border-white/5 group relative">
          <div className="flex items-start justify-between mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.type === 'short' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
              {v.type} · {v.charCount} chars
            </span>
            <button onClick={() => onCopy(v.text)} className="opacity-0 group-hover:opacity-100 transition text-xs text-gray-400 hover:text-white bg-white/10 px-2 py-0.5 rounded">
              Copy
            </button>
          </div>
          <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{v.text}</p>
        </div>
      ))}
      {data.tips?.map((t: string, i: number) => (
        <p key={i} className="text-xs text-gray-500">💡 {t}</p>
      ))}
    </div>
  )
}

function DMResult({ data, onCopy }: { data: any; onCopy: (text: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      {data.scripts?.map((s: any, i: number) => (
        <div key={i} className="bg-black/20 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">{s.scenario}</span>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            {s.messages?.map((msg: string, j: number) => (
              <div key={j} className="flex items-start gap-2">
                <span className="text-xs text-gray-600 w-4 shrink-0 mt-0.5">{j + 1}.</span>
                <p className="text-sm text-gray-200 leading-relaxed flex-1">{msg}</p>
                <button onClick={() => onCopy(msg)} className="text-xs text-gray-600 hover:text-white shrink-0">📋</button>
              </div>
            ))}
          </div>
          {s.conversionTip && (
            <p className="text-xs text-yellow-400/80 italic border-t border-white/5 pt-2">💡 {s.conversionTip}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function IdeasResult({ data }: { data: any }) {
  const sections = [
    { key: 'viral', label: '🎯 Viral / Acquisition', items: data.viral },
    { key: 'monetization', label: '💰 Monetization', items: data.monetization },
    { key: 'retention', label: '🔥 Retention', items: data.retention },
  ]
  return (
    <div className="flex flex-col gap-4">
      {sections.map(s => (
        <div key={s.key}>
          <h4 className="text-sm font-semibold text-white mb-2">{s.label}</h4>
          <div className="flex flex-col gap-2">
            {s.items?.map((item: any, i: number) => (
              <div key={i} className="bg-black/20 rounded-xl p-3 border border-white/5">
                <p className="text-sm font-medium text-gray-100 mb-0.5">{item.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                <p className="text-xs text-green-400/70 mt-1">→ {item.why}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function HashtagsResult({ data, onCopy }: { data: any; onCopy: (text: string) => void }) {
  const sets = [
    { key: 'fullSet', label: '📦 Full Set (30)', tags: data.fullSet },
    { key: 'compactSet', label: '⚡ Compact (10 best)', tags: data.compactSet },
    { key: 'trendingSet', label: '🔥 Trending (10)', tags: data.trendingSet },
  ]
  return (
    <div className="flex flex-col gap-4">
      {sets.map(s => (
        <div key={s.key} className="bg-black/20 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-300">{s.label}</span>
            <button onClick={() => onCopy(s.tags?.join(' '))} className="text-xs text-gray-500 hover:text-white">Copy all</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {s.tags?.map((tag: string, i: number) => (
              <span key={i} onClick={() => onCopy(tag)} className="text-xs bg-pink-500/10 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/10 cursor-pointer hover:bg-pink-500/20 transition">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      {data.warning && <p className="text-xs text-orange-400">⚠️ {data.warning}</p>}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTool, setActiveTool] = useState<GenType>('caption')
  const [context, setContext] = useState('')
  const [niche, setNiche] = useState('')
  const [tone, setTone] = useState('Flirty')
  const [platform, setPlatform] = useState('OnlyFans')
  const [nsfwLevel, setNsfwLevel] = useState(2)
  const [language, setLanguage] = useState<LangCode>('en')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [usage, setUsage] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    // Detect browser language
    setLanguage(detectBrowserLanguage())
    // Load usage
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/usage`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => setUsage(d.count)).catch(() => {})
  }, [])

  const generate = async () => {
    if (!context.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/${activeTool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ context, niche, tone, language, platform, nsfwLevel }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Generation failed')
      setResult(data)
      setUsage(u => u + 1)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text.slice(0, 20))
    setTimeout(() => setCopied(''), 2000)
  }

  const tool = TOOLS.find(t => t.id === activeTool)!
  const FREE_LIMIT = 10
  const usagePercent = Math.min((usage / FREE_LIMIT) * 100, 100)
  const nsfwInfo = NSFW_LABELS[nsfwLevel]
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-purple-950 to-black text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-10 gap-4">
        <div className="text-lg font-bold text-pink-400 shrink-0">FanScript ✨</div>

        <div className="flex items-center gap-3 flex-1 justify-end flex-wrap">
          {/* Language picker */}
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as LangCode)}
            className="bg-white/10 text-white text-xs rounded-lg px-2 py-1.5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>

          {/* Usage */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">{Math.min(usage, FREE_LIMIT)}/{FREE_LIMIT}</span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all" style={{ width: `${usagePercent}%` }} />
            </div>
          </div>

          <button onClick={() => { localStorage.removeItem('token'); router.push('/') }} className="text-gray-500 hover:text-white transition text-xs">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 border-r border-white/10 bg-black/10 flex flex-col p-3 gap-1 shrink-0 overflow-y-auto">
          <p className="text-xs text-gray-600 uppercase tracking-wider px-2 mb-1">Tools</p>
          {TOOLS.map(t => (
            <button key={t.id} onClick={() => { setActiveTool(t.id as GenType); setResult(null); setContext(''); setError('') }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition text-sm ${
                activeTool === t.id ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}>
              <span>{t.emoji}</span>
              <div>
                <div className="font-medium leading-tight">{t.label}</div>
                <div className="text-xs opacity-50 leading-tight">{t.desc}</div>
              </div>
            </button>
          ))}

          {usage >= 8 && (
            <div className="mt-3 bg-pink-500/10 border border-pink-500/20 rounded-xl p-3">
              <p className="text-xs text-pink-300 font-medium mb-1">⚡ Running low</p>
              <p className="text-xs text-gray-500 mb-2">Upgrade for unlimited</p>
              <a href="/pricing" className="block text-center text-xs bg-pink-500 hover:bg-pink-600 text-white py-1.5 rounded-lg transition font-medium">
                Upgrade →
              </a>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col p-5 gap-4 overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">{tool.emoji} {tool.label}</h1>
            <p className="text-gray-500 text-xs mt-0.5">{tool.desc}</p>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap gap-4">
            {/* Tone */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Tone</label>
              <div className="flex gap-1 flex-wrap">
                {TONES.map(t => (
                  <button key={t} onClick={() => setTone(t)}
                    className={`px-2.5 py-1 rounded-full text-xs transition ${tone === t ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Platform</label>
              <div className="flex gap-1 flex-wrap">
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className={`px-2.5 py-1 rounded-full text-xs transition ${platform === p ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* NSFW Slider */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400 font-medium">Content Intensity</label>
              <span className={`text-xs font-semibold ${nsfwInfo.color}`}>{nsfwInfo.label}</span>
            </div>
            <input
              type="range" min={1} max={5} value={nsfwLevel}
              onChange={e => setNsfwLevel(Number(e.target.value))}
              className="w-full h-1.5 appearance-none rounded-full cursor-pointer accent-pink-500"
              style={{ background: `linear-gradient(to right, #ec4899 ${(nsfwLevel - 1) * 25}%, rgba(255,255,255,0.1) ${(nsfwLevel - 1) * 25}%)` }}
            />
            <div className="flex justify-between text-xs text-gray-700 mt-1">
              <span>Suggestive</span><span>Sensual</span><span>Explicit</span><span>Very explicit</span><span>No limits</span>
            </div>
          </div>

          {/* Input */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col gap-3">
            <input value={niche} onChange={e => setNiche(e.target.value)}
              placeholder="Your niche (optional) — e.g. fitness, cosplay, lingerie..."
              className="w-full bg-white/5 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 border border-white/5" />
            <textarea value={context} onChange={e => setContext(e.target.value)}
              placeholder={`Describe your content... e.g. "${EXAMPLES[activeTool]}"`}
              rows={4}
              className="w-full bg-white/5 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 border border-white/5 resize-none" />
            <button onClick={generate} disabled={!context.trim() || loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Generating...</>
              ) : `✨ Generate ${tool.label} · ${currentLang?.flag} ${currentLang?.name}`}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
              <p className="text-red-300 font-medium">⚠️ {error}</p>
              {error.includes('limit') && <a href="/pricing" className="text-pink-400 text-xs hover:underline mt-1 block">Upgrade to Pro →</a>}
            </div>
          )}

          {/* Copied toast */}
          {copied && (
            <div className="fixed bottom-4 right-4 bg-green-500/90 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50">
              ✓ Copied!
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-white/5 rounded-2xl border border-pink-500/20 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-pink-300 text-sm">✨ Generated {tool.label}</h3>
                <button onClick={generate} className="text-xs text-gray-500 hover:text-pink-300 transition flex items-center gap-1">
                  🔄 Regenerate
                </button>
              </div>
              {activeTool === 'caption' && <CaptionResult data={result} onCopy={copyText} />}
              {activeTool === 'bio' && <BioResult data={result} onCopy={copyText} />}
              {activeTool === 'dm-script' && <DMResult data={result} onCopy={copyText} />}
              {activeTool === 'content-ideas' && <IdeasResult data={result} />}
              {activeTool === 'hashtags' && <HashtagsResult data={result} onCopy={copyText} />}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
