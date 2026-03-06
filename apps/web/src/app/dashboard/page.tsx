'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type GenType = 'caption' | 'bio' | 'dm-script' | 'content-ideas' | 'hashtags'

const TOOLS = [
  { id: 'caption', label: 'Caption', emoji: '✍️', desc: 'Flirty post captions' },
  { id: 'bio', label: 'Bio', emoji: '👤', desc: 'Profile bios that convert' },
  { id: 'dm-script', label: 'DM Script', emoji: '💌', desc: 'Convert followers to fans' },
  { id: 'content-ideas', label: 'Content Ideas', emoji: '💡', desc: 'Never run out of ideas' },
  { id: 'hashtags', label: 'Hashtags', emoji: '#️⃣', desc: 'Platform-optimized tags' },
]

const TONES = ['Flirty', 'Bold', 'Playful', 'Mysterious', 'Confident', 'Sweet']
const PLATFORMS = ['OnlyFans', 'Fansly', 'Twitter/X', 'Instagram', 'TikTok']

const EXAMPLES: Record<string, string> = {
  'caption': 'Mirror selfie in new lingerie, Friday night, bold vibe',
  'bio': 'Fitness creator, 24, loves yoga and coffee, 5K followers',
  'dm-script': 'New follower who liked 3 of my posts in a row',
  'content-ideas': 'Lingerie + fitness, summer theme, 3K subscribers',
  'hashtags': 'Fitness creator posting on Twitter and Instagram',
}

export default function DashboardPage() {
  const [activeTool, setActiveTool] = useState<GenType>('caption')
  const [context, setContext] = useState('')
  const [niche, setNiche] = useState('')
  const [tone, setTone] = useState('Flirty')
  const [platform, setPlatform] = useState('OnlyFans')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [usageCount, setUsageCount] = useState<number | null>(null)
  const router = useRouter()

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    if (!token) { router.push('/login'); return }
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) {
        const data = await res.json()
        setHistory(data.slice(0, 10))
        setUsageCount(data.length)
      }
    } catch {}
  }

  const generate = async () => {
    if (!context.trim()) return
    setLoading(true); setError(''); setResult(''); setCopied(false)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/${activeTool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ context: `${context} [tone: ${tone}] [platform: ${platform}]`, niche }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Generation failed')
      setResult(data.result)
      loadHistory()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tool = TOOLS.find(t => t.id === activeTool)!
  const FREE_LIMIT = 10
  const usagePercent = usageCount !== null ? Math.min((usageCount / FREE_LIMIT) * 100, 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-purple-950 to-black text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="text-lg font-bold text-pink-400">FanScript ✨</div>
        <div className="flex items-center gap-4">
          {usageCount !== null && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">{Math.min(usageCount, FREE_LIMIT)}/{FREE_LIMIT} free</span>
              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          )}
          <button
            onClick={() => { localStorage.removeItem('token'); router.push('/') }}
            className="text-gray-400 hover:text-white transition text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-white/10 bg-black/10 flex flex-col p-3 gap-1 shrink-0">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-1">Tools</p>
          {TOOLS.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTool(t.id as GenType); setResult(''); setContext(''); setError('') }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition text-sm ${
                activeTool === t.id
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <span className="text-base">{t.emoji}</span>
              <div>
                <div className="font-medium leading-tight">{t.label}</div>
                <div className="text-xs opacity-60 leading-tight">{t.desc}</div>
              </div>
            </button>
          ))}

          {/* Recent History */}
          {history.length > 0 && (
            <>
              <div className="my-2 border-t border-white/10" />
              <p className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-1">Recent</p>
              {history.slice(0, 5).map((h, i) => (
                <button
                  key={i}
                  onClick={() => setResult(h.result)}
                  className="text-left px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition truncate"
                >
                  {h.type.replace('_', ' ')} — {h.prompt?.slice(0, 25)}…
                </button>
              ))}
            </>
          )}

          {/* Upgrade CTA */}
          {usageCount !== null && usageCount >= 8 && (
            <div className="mt-auto">
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-3">
                <p className="text-xs text-pink-300 font-medium mb-1">⚡ Running low</p>
                <p className="text-xs text-gray-400 mb-2">Upgrade for unlimited generations</p>
                <a href="/pricing" className="block text-center text-xs bg-pink-500 hover:bg-pink-600 text-white py-1.5 rounded-lg transition font-medium">
                  Upgrade →
                </a>
              </div>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col p-6 gap-5 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {tool.emoji} Generate {tool.label}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">{tool.desc}</p>
          </div>

          {/* Filters row */}
          <div className="flex gap-3 flex-wrap">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tone</label>
              <div className="flex gap-1.5 flex-wrap">
                {TONES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-1 rounded-full text-xs transition ${
                      tone === t ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Platform</label>
              <div className="flex gap-1.5 flex-wrap">
                {PLATFORMS.map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-1 rounded-full text-xs transition ${
                      platform === p ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col gap-3">
            <input
              value={niche}
              onChange={e => setNiche(e.target.value)}
              placeholder="Your niche (optional) — e.g. fitness, cosplay, lifestyle..."
              className="w-full bg-white/5 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 border border-white/5"
            />
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder={`Describe your content... e.g. "${EXAMPLES[activeTool]}"`}
              rows={4}
              className="w-full bg-white/5 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 border border-white/5 resize-none"
            />
            <button
              onClick={generate}
              disabled={!context.trim() || loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Generating...
                </>
              ) : (
                `✨ Generate ${tool.label}`
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm flex items-start gap-2">
              <span>⚠️</span>
              <div>
                <p className="font-medium">Generation failed</p>
                <p className="text-red-400 text-xs mt-0.5">{error}</p>
                {error.includes('limit') && (
                  <a href="/pricing" className="text-pink-400 hover:underline text-xs mt-1 block">
                    Upgrade to Pro for unlimited →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-white/5 rounded-2xl border border-pink-500/20 p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-pink-300 flex items-center gap-1.5">
                  ✨ Generated {tool.label}
                </h3>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition font-medium ${
                    copied
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre className="text-gray-100 whitespace-pre-wrap font-sans leading-relaxed text-sm bg-black/20 rounded-xl p-4">
                {result}
              </pre>
              <div className="flex gap-2">
                <button
                  onClick={generate}
                  className="text-xs text-pink-400 hover:text-pink-300 transition flex items-center gap-1"
                >
                  🔄 Regenerate
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
