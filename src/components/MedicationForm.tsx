import { useState, type FormEvent } from 'react'
import { Save } from 'lucide-react'
import type { MedicationPayload } from '../api/medications'

interface Props {
  initial?: Partial<MedicationPayload>
  onSubmit: (data: MedicationPayload) => Promise<void>
  submitLabel: string
}

function distributeEvenly(count: number): string[] {
  const spacing = Math.floor(24 / count)
  return Array.from({ length: count }, (_, i) => {
    const hour = (8 + i * spacing) % 24
    return `${String(hour).padStart(2, '0')}:00`
  })
}

export default function MedicationForm({ initial, onSubmit, submitLabel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [dosage, setDosage] = useState(initial?.dosage ?? '')
  const [unit, setUnit] = useState(initial?.unit ?? '')
  const [applicationMethod, setApplicationMethod] = useState(initial?.applicationMethod ?? '')
  const [startDate, setStartDate] = useState(initial?.startDate ?? '')
  const [endDate, setEndDate] = useState(initial?.endDate ?? '')
  const [frequency, setFrequency] = useState(initial?.times?.length ?? 1)
  const [times, setTimes] = useState<string[]>(initial?.times ?? ['08:00'])
  const [error, setError] = useState<string | null>(null)

  const handleFrequencyChange = (n: number) => {
    setFrequency(n)
    setTimes(distributeEvenly(n))
  }

  const handleTimeChange = (i: number, val: string) => {
    setTimes(prev => prev.map((t, idx) => idx === i ? val : t))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit({ name, dosage, unit, applicationMethod, startDate,
        endDate: endDate || undefined, times })
    } catch {
      setError('Erro ao salvar. Verifique os dados.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="med-name">Nome</label>
        <input id="med-name" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="dosage">Dose</label>
        <input id="dosage" value={dosage} onChange={e => setDosage(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="unit">Unidade</label>
        <input id="unit" value={unit} onChange={e => setUnit(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="method">Forma de aplicação</label>
        <input id="method" value={applicationMethod} onChange={e => setApplicationMethod(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="start">Data de início</label>
        <input id="start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="end">Data de término (opcional)</label>
        <input id="end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="freq">Frequência (vezes por dia)</label>
        <input id="freq" type="number" min={1} max={24} value={frequency}
          onChange={e => handleFrequencyChange(Number(e.target.value))} />
      </div>
      {times.map((t, i) => (
        <div key={i} className="form-group">
          <label htmlFor={`time-${i}`}>Horário {i + 1}</label>
          <input id={`time-${i}`} type="text" placeholder="HH:mm" value={t}
            onChange={e => handleTimeChange(i, e.target.value)} pattern="\d{2}:\d{2}" />
        </div>
      ))}
      <button type="submit" className="btn-primary btn-submit">
        <Save size={15} /> {submitLabel}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  )
}
