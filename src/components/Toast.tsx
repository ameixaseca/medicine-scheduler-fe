import { useEffect } from 'react'

interface Props { message: string; onDismiss: () => void }

export default function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div role="alert" className="toast">
      {message}
    </div>
  )
}
