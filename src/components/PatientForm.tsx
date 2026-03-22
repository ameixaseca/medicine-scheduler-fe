import { useState } from 'react'
import type { FormEvent } from 'react'
import { Save } from 'lucide-react'
import type { Patient } from '../api/patients'

interface Props {
  initial?: Partial<Patient>
  onSubmit: (data: Omit<Patient, 'id'>) => Promise<void>
  submitLabel: string
}

export default function PatientForm({ initial, onSubmit, submitLabel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(initial?.dateOfBirth ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit({ name, dateOfBirth, notes })
    } catch {
      setError('Erro ao salvar. Verifique os dados.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nome</label>
        <input id="name" value={name} onChange={e => setName(e.target.value)} required maxLength={200} />
      </div>
      <div className="form-group">
        <label htmlFor="dob">Data de nascimento</label>
        <input id="dob" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="notes">Observações</label>
        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
      <button type="submit" className="btn-primary btn-submit">
        <Save size={15} /> {submitLabel}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  )
}
