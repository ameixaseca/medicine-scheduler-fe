import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, User, Bell, BellOff, Save } from 'lucide-react'
import { getProfile, updateProfile } from '../api/profile'
import { useSettings } from '../hooks/useSettings'
import { useAuth } from '../hooks/useAuth'
import Toast from '../components/Toast'
import { subscribeToPush, unsubscribeFromPush } from '../alarm/alarm'

function initials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function ProfilePage() {
  const { setUserName } = useAuth()
  const { settings, save: saveSettings } = useSettings()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    getProfile()
      .then(p => { setName(p.name); setEmail(p.email) })
      .finally(() => setLoadingProfile(false))
  }, [])

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const updated = await updateProfile({ name })
      setUserName(updated.name)
      setToast('Nome atualizado.')
    } catch {
      setToast('Erro ao atualizar o nome.')
    }
  }

  const handleSettingsSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const pref = (form.elements.namedItem('notifPref') as HTMLSelectElement).value
    const tz = (form.elements.namedItem('timezone') as HTMLInputElement).value
    try {
      await saveSettings({ notificationPreference: pref, timezone: tz })
      setToast('Configurações salvas.')
    } catch {
      setToast('Erro ao salvar configurações.')
    }
  }

  const handleEnablePush = async () => {
    try {
      await subscribeToPush()
      setToast('Notificações push ativadas.')
    } catch {
      setToast('Não foi possível ativar as notificações push.')
    }
  }

  const handleDisablePush = async () => {
    try {
      await unsubscribeFromPush()
      setToast('Notificações push desativadas.')
    } catch {
      setToast('Não foi possível desativar as notificações push.')
    }
  }

  if (loadingProfile || !settings) return <p>Carregando…</p>

  return (
    <main>
      <header className="page-header">
        <Link to="/" className="back-link"><ArrowLeft size={16} /> Agenda</Link>
        <h1><User size={20} /> Perfil</h1>
      </header>
      <div className="page-content">

        {/* Avatar + e-mail */}
        <div className="profile-header">
          <div className="profile-avatar">{name ? initials(name) : '?'}</div>
          <p className="profile-email">{email}</p>
        </div>

        {/* Informações pessoais */}
        <p className="section-label"><User size={13} /> Informações pessoais</p>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="profileName">Nome</label>
            <input
              id="profileName"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary btn-submit">
            <Save size={15} /> Atualizar nome
          </button>
        </form>

        <hr />

        {/* Configurações de notificação */}
        <p className="section-label"><Bell size={13} /> Notificações</p>
        <form onSubmit={handleSettingsSubmit}>
          <div className="form-group">
            <label htmlFor="notifPref">Preferência de notificação</label>
            <select id="notifPref" name="notifPref" defaultValue={settings.notificationPreference}>
              <option value="push">Apenas push</option>
              <option value="alarm">Apenas alarme interno</option>
              <option value="both">Ambos</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="timezone">Fuso horário</label>
            <input id="timezone" name="timezone" defaultValue={settings.timezone} />
          </div>
          <button type="submit" className="btn-primary btn-submit">
            <Save size={15} /> Salvar configurações
          </button>
        </form>

        <hr />

        <p className="section-label"><Bell size={13} /> Notificações push</p>
        <div className="btn-stack">
          <button className="btn-secondary" onClick={handleEnablePush}>
            <Bell size={15} /> Ativar notificações push
          </button>
          <button className="btn-secondary" onClick={handleDisablePush}>
            <BellOff size={15} /> Desativar notificações push
          </button>
        </div>

      </div>
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </main>
  )
}
