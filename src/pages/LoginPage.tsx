import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Mail, Lock } from 'lucide-react'
import { login } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import Toast from '../components/Toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, login: setAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const { accessToken } = await login(email, password)
      setAuth(accessToken)
    } catch {
      setError('E-mail ou senha inválidos.')
    }
  }

  return (
    <main className="auth-main">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email"><Mail size={14} /> E-mail</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password"><Lock size={14} /> Senha</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary btn-submit">
          <LogIn size={16} /> Entrar
        </button>
      </form>
      <Link to="/register" className="auth-link">Criar uma conta</Link>
      {error && <Toast message={error} onDismiss={() => setError(null)} />}
    </main>
  )
}
