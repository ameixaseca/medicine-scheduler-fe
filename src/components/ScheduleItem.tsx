import { CheckCircle2, XCircle, Check, SkipForward } from 'lucide-react'
import type { ScheduleItem as Item } from '../api/schedule'
import SyncIndicator from './SyncIndicator'

interface Props {
  item: Item
  pendingSync?: boolean
  onConfirm: (logId: string) => void
  onSkip: (logId: string) => void
}

export default function ScheduleItem({ item, pendingSync, onConfirm, onSkip }: Props) {
  const isOverdue = item.status === 'pending' && new Date(item.scheduledTime) < new Date()

  const cardClass = [
    'card',
    item.status !== 'pending' ? 'card--done' : '',
    isOverdue ? 'card--overdue' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>
      <div className="card-header">
        <span className="card-time">{item.scheduledTimeLocal}</span>
        <span className="card-patient">{item.patient.name}</span>
      </div>
      <div className="card-body">
        {item.medication.name} {item.medication.dosage}{item.medication.unit}
      </div>
      {item.status === 'pending' && (
        <div className="card-actions">
          <button className="btn-primary btn-compact" onClick={() => onConfirm(item.logId)}>
            <Check size={14} /> Confirmar
          </button>
          <button className="btn-warning btn-compact" onClick={() => onSkip(item.logId)}>
            <SkipForward size={14} /> Pular
          </button>
          {pendingSync && <SyncIndicator />}
        </div>
      )}
      {item.status === 'taken' && (
        <div className="card-actions">
          <span className="status-badge status-badge--taken">
            <CheckCircle2 size={13} /> Administrado
          </span>
        </div>
      )}
      {item.status === 'skipped' && (
        <div className="card-actions">
          <span className="status-badge status-badge--skipped">
            <XCircle size={13} /> Pulado
          </span>
        </div>
      )}
    </div>
  )
}
