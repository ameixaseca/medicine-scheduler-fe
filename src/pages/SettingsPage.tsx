import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'
import Toast from '../components/Toast'
import { subscribeToPush, unsubscribeFromPush } from '../alarm/alarm'

export default function SettingsPage() {
  const { settings, save } = useSettings()
  const [toast, setToast] = useState<string | null>(null)

  if (!settings) return <p>Loading…</p>

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const pref = (form.elements.namedItem('notifPref') as HTMLSelectElement).value
    const tz = (form.elements.namedItem('timezone') as HTMLInputElement).value
    try {
      await save({ notificationPreference: pref, timezone: tz })
      setToast('Settings saved.')
    } catch {
      setToast('Failed to save settings.')
    }
  }

  const handleEnablePush = async () => {
    try {
      await subscribeToPush()
      setToast('Push notifications enabled.')
    } catch {
      setToast('Could not enable push notifications.')
    }
  }

  const handleDisablePush = async () => {
    try {
      await unsubscribeFromPush()
      setToast('Push notifications disabled.')
    } catch {
      setToast('Could not disable push notifications.')
    }
  }

  return (
    <main>
      <header className="page-header">
        <Link to="/" className="back-link">← Dashboard</Link>
        <h1>Settings</h1>
      </header>
      <div className="page-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="notifPref">Notification Preference</label>
            <select id="notifPref" name="notifPref" defaultValue={settings.notificationPreference}>
              <option value="push">Push only</option>
              <option value="alarm">In-app alarm only</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="timezone">Timezone</label>
            <input id="timezone" name="timezone" defaultValue={settings.timezone} />
          </div>
          <button type="submit" className="btn-primary btn-submit">Save</button>
        </form>
        <hr />
        <div className="btn-stack">
          <button className="btn-secondary" onClick={handleEnablePush}>Enable Push Notifications</button>
          <button className="btn-secondary" onClick={handleDisablePush}>Disable Push Notifications</button>
        </div>
      </div>
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </main>
  )
}
