'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/LanguageContext'
import { SUPPORTED_LANGUAGES, LangCode, saveLangToStorage } from '@/lib/i18n'

export default function RegisterPage() {
  const { lang, setLang, t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || t('result.error'))
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-purple-950 to-black flex flex-col">
      <nav className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-pink-400">FanScript ✨</Link>
        <select value={lang} onChange={e => { setLang(e.target.value as LangCode); saveLangToStorage(e.target.value as LangCode) }}
          className="bg-white/10 text-white text-xs rounded-lg px-2 py-1.5 border border-white/10 focus:outline-none">
          {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
        </select>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">{t('auth.register.title')}</h1>
              <p className="text-gray-400 text-sm">{t('auth.register.subtitle')}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder={t('auth.register.name')} value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/5 text-sm" required />
              <input type="email" placeholder={t('auth.register.email')} value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/5 text-sm" required />
              <input type="password" placeholder={t('auth.register.password')} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/5 text-sm" required minLength={8} />
              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2">
                {loading ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{t('auth.register.submitting')}</>) : t('auth.register.submit')}
              </button>
            </form>
            <p className="text-gray-500 text-center mt-4 text-sm">
              {t('auth.register.hasAccount')}{' '}
              <Link href="/login" className="text-pink-400 hover:underline">{t('auth.register.login')}</Link>
            </p>
          </div>
          <p className="text-center text-gray-600 text-xs mt-4">{t('auth.register.privacy')}</p>
        </div>
      </div>
    </div>
  )
}
