'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type GenType = 'caption' | 'bio' | 'dm-script' | 'content-ideas' | 'hashtags'

const TOOLS = [
  { id: 'caption', label: '✍️ Caption', placeholder: 'Describe your post... (e.g. "Spicy mirror selfie, Friday night vibes")' },
  { id: 'bio', label: '👤 Bio', placeholder: 'Describe yourself... (e.g. "Fitness creator, love yoga and coffee")' },
  { id: 'dm-script', label: '💌 DM Script', placeholder: 'Scenario... (e.g. "New follower who liked 3 posts")' },
  { id: 'content-ideas', label: '💡 Content Ideas', placeholder: 'Your niche... (e.g. "Lingerie + fitness, 5K followers")' },
  { id: 'hashtags', label: '#️⃣ Hashtags', placeholder: 'Platform + niche... (e.g. "Twitter, fitness creator")' },
]

export default function DashboardPage() {
  const [activeTool, setActiveTool] = useState<GenType>('caption')
  const [context, setContext] = useState('')
  const [niche, setNiche] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login')
  }, [])

  const generate = async () => {
    setLoading(true); setError(''); setResult('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/${activeTool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ context, niche }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Generation failed')
      setResult(data.result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const tool = TOOLS.find(t => t.id === activeTool)!

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-purple-950 to-black text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="text-xl font-bold text-pink-400">FanScript ✨</div>
        <button onClick={() => { localStorage.removeItem('token'); router.push('/') }}
          className="text-gray-400 hover:text-white transition text-sm">Logout</button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Generate Content</h1>

        {/* Tool selector */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TOOLS.map(t => (
            <button key={t.id} onClick={() => { setActiveTool(t.id as GenType); setResult(''); setContext('') }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTool === t.id ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Your niche (optional)</label>
              <input value={niche} onChange={e => setNiche(e.target.value)}
                placeholder="e.g. fitness, cosplay, lifestyle..."
                className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Context *</label>
              <input value={context} onChange={e => setContext(e.target.value)}
                placeholder={tool.placeholder}
                className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>
          <button onClick={generate} disabled={!context || loading}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition">
            {loading ? '✨ Generating...' : `Generate ${tool.label}`}
          </button>
        </div>

        {/* Result */}
        {error && <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 mb-6">{error}</div>}
        {result && (
          <div className="bg-white/5 rounded-2xl p-6 border border-pink-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-pink-300">✨ Your Generated Content</h3>
              <button onClick={() => navigator.clipboard.writeText(result)}
                className="text-sm text-gray-400 hover:text-white transition">Copy</button>
            </div>
            <pre className="text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
