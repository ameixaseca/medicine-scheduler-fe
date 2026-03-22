import { RefreshCw } from 'lucide-react'

export default function SyncIndicator() {
  return (
    <span className="sync-indicator" aria-label="Sincronização pendente">
      <RefreshCw size={12} /> sincronizando…
    </span>
  )
}
