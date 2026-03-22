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
            Confirmar
          </button>
          <button className="btn-warning btn-compact" onClick={() => onSkip(item.logId)}>
            Pular
          </button>
          {pendingSync && <SyncIndicator />}
        </div>
      )}
    </div>
  )
}
