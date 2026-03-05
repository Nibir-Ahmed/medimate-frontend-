import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setLoading(true)
    try {
      const data = await registerUser(name, email, password, role)
      if (data.id) {
        navigate('/login')
      } else {
        setError('Registration failed!')
      }
    } catch (err) {
      setError('Something went wrong!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Medi<span className="bg-gradient-to-r from-violet-400 to-purple-600 px-2 py-1 rounded-lg">Mate</span>
          </h1>
          <p className="text-white/60">আপনার স্বাস্থ্য সহায়ক</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account ✨</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 rounded-2xl p-3 mb-4 text-sm">
              ❌ {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Full Name</label>
              <input
                type="text"
                placeholder="আপনার নাম"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-1 block">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-white/70 text-sm mb-1 block">আমি একজন</label>
              <select
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-violet-400 transition-all"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="patient" className="bg-violet-900">🧑 Patient</option>
                <option value="doctor" className="bg-violet-900">👨‍⚕️ Doctor</option>
              </select>
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 rounded-2xl transition-all shadow-lg shadow-violet-900/50 mt-2"
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Register →'}
            </button>
          </div>

          <p className="text-center mt-6 text-white/50 text-sm">
            Already account আছে?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">Login করো</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register