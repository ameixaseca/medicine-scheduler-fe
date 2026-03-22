import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, User, Mail, Lock } from 'lucide-react'
import { register } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import Toast from '../components/Toast'

export default function RegisterPage() {
  const [name, setName] = useState('')
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
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      const { accessToken } = await register(name, email, password, tz)
      setAuth(accessToken)
    } catch {
      setError('Falha no cadastro. Verifique seus dados.')
    }
  }

  return (
    <main className="auth-main">
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name"><User size={14} /> Nome</label>
          <input id="name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email"><Mail size={14} /> E-mail</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password"><Lock size={14} /> Senha</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
        </div>
        <button type="submit" className="btn-primary btn-submit">
          <UserPlus size={16} /> Cadastrar
        </button>
      </form>
      <Link to="/login" className="auth-link">Já tem uma conta? Entrar</Link>
      {error && <Toast message={error} onDismiss={() => setError(null)} />}
    </main>
  )
}
