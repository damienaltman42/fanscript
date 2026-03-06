'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-purple-950 to-black flex items-center justify-center">
      <div className="bg-white/5 rounded-2xl p-8 w-full max-w-md border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Start Writing Better ✨</h1>
        <p className="text-gray-400 text-center mb-6">10 free generations every month</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Creator name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="w-full bg-white/10 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            className="w-full bg-white/10 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          <input type="password" placeholder="Password (8+ chars)" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            className="w-full bg-white/10 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500" required minLength={8} />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold transition">
            Create Account →
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account? <Link href="/login" className="text-pink-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
