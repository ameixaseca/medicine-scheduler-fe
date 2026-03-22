import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPatient, updatePatient, deletePatient } from '../api/patients'
import type { Patient } from '../api/patients'
import { getMedications, deleteMedication } from '../api/medications'
import type { Medication } from '../api/medications'
import PatientForm from '../components/PatientForm'

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const [editing, setEditing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    getPatient(id).then(setPatient)
    getMedications(id).then(setMedications)
  }, [id])

  const handleUpdate = async (data: Omit<Patient, 'id'>) => {
    const updated = await updatePatient(id!, data)
    setPatient(updated)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this patient?')) return
    await deletePatient(id!)
    navigate('/patients')
  }

  const handleDeleteMedication = async (medId: string) => {
    await deleteMedication(medId)
    setMedications(prev => prev.filter(m => m.id !== medId))
  }

  if (!patient) return <p>Loading…</p>

  return (
    <main>
      <header className="page-header">
        <Link to="/patients" className="back-link">← Patients</Link>
        <h1>{patient.name}</h1>
      </header>
      <div className="page-content">
        <div className="btn-row">
          <button className="btn-secondary btn-compact" onClick={() => setEditing(v => !v)}>Edit</button>
          <button className="btn-danger btn-compact" onClick={handleDelete}>Delete</button>
        </div>
        {editing && <PatientForm initial={patient} onSubmit={handleUpdate} submitLabel="Save" />}

        <h2>Medications</h2>
        <div>
          <Link to={`/patients/${id}/medications/new`} className="btn-secondary btn-compact">
            + Add Medication
          </Link>
        </div>
        <ul className="item-list">
          {medications.map(m => (
            <li key={m.id} className="card">
              <span className="item-name">{m.name} — {m.dosage} {m.unit}</span>
              <Link to={`/medications/${m.id}/edit`} className="btn-secondary btn-compact">Edit</Link>
              <button className="btn-danger btn-compact" onClick={() => handleDeleteMedication(m.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
