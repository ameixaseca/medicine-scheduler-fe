import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import Toast from '../components/Toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const { accessToken } = await login(email, password)
      setAuth(accessToken)
      navigate('/')
    } catch {
      setError('Invalid email or password.')
    }
  }

  return (
    <main className="auth-main">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary btn-submit">Log in</button>
      </form>
      <Link to="/register" className="auth-link">Create an account</Link>
      {error && <Toast message={error} onDismiss={() => setError(null)} />}
    </main>
  )
}
