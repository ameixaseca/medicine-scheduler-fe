import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPatients, createPatient } from '../api/patients'
import type { Patient } from '../api/patients'
import PatientForm from '../components/PatientForm'

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { getPatients().then(setPatients) }, [])

  const handleCreate = async (data: Omit<Patient, 'id'>) => {
    const created = await createPatient(data)
    setPatients(prev => [...prev, created])
    setShowForm(false)
  }

  return (
    <main>
      <header className="page-header">
        <Link to="/" className="back-link">← Dashboard</Link>
        <h1>Patients</h1>
      </header>
      <div className="page-content">
        <div>
          <button className="btn-secondary" onClick={() => setShowForm(v => !v)}>
            + Add Patient
          </button>
        </div>
        {showForm && <PatientForm onSubmit={handleCreate} submitLabel="Create" />}
        <ul className="item-list">
          {patients.map(p => (
            <li key={p.id} className="card">
              <Link to={`/patients/${p.id}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
