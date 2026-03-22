# CSS Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Vite template CSS with a mobile-first, green/white design system for the medical scheduler PWA.

**Architecture:** Single global `index.css` holds all tokens, resets, layout classes, and utility classes. Components and pages gain semantic class names (`btn-primary`, `card`, `form-group`, etc.) via JSX edits. No new dependencies.

**Tech Stack:** React 19, TypeScript, Vanilla CSS custom properties, Vite

**Spec:** `docs/superpowers/specs/2026-03-22-css-redesign-design.md`

---

## File Map

| File | What changes |
|------|-------------|
| `src/index.css` | Full rewrite — tokens, reset, base elements, layout, all utility classes |
| `src/App.css` | Cleared (was Vite template content) |
| `src/components/Toast.tsx` | Replace inline `style={{}}` with `.toast` class |
| `src/components/SyncIndicator.tsx` | Replace emoji with styled `<span>` |
| `src/components/ScheduleItem.tsx` | Replace inline `style={{}}` with `.card` + subclasses + modifier classes |
| `src/components/PatientForm.tsx` | Wrap each field in `.form-group` |
| `src/components/MedicationForm.tsx` | Wrap each field in `.form-group` |
| `src/pages/LoginPage.tsx` | Auth page structure, `.form-group`, `.btn-primary` |
| `src/pages/RegisterPage.tsx` | Auth page structure, `.form-group`, `.btn-primary` |
| `src/pages/DashboardPage.tsx` | `.page-header` + `.page-content` + `.btn-nav` |
| `src/pages/PatientsPage.tsx` | `.page-header` + `.page-content` + patient list cards |
| `src/pages/PatientDetailPage.tsx` | `.page-header` + `.page-content` + medication list cards |
| `src/pages/MedicationFormPage.tsx` | `.page-header` + `.page-content` |
| `src/pages/SettingsPage.tsx` | `.page-header` + `.page-content` + form classes |

---

## Task 1: Rewrite `index.css` and clear `App.css`

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.css` (not imported anywhere — this step is optional housekeeping)

This task builds the entire CSS foundation. All other tasks depend on it.

- [ ] **Step 1: Replace `src/index.css` with the full design system**

```css
/* ============================================================
   TOKENS
   ============================================================ */
:root {
  /* Colours */
  --color-primary:        #2e7d32;
  --color-primary-light:  #e8f5e9;
  --color-primary-dark:   #1b5e20;
  --color-danger:         #c62828;
  --color-danger-light:   #ffebee;
  --color-warning:        #e65100;
  --color-text:           #1a1a1a;
  --color-text-secondary: #555555;
  --color-surface:        #ffffff;
  --color-bg:             #f4f6f4;
  --color-border:         #c8d5c8;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;

  /* Typography */
  --font-base: system-ui, 'Segoe UI', Roboto, sans-serif;

  /* Shape */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.10);
}

/* ============================================================
   RESET & BASE
   ============================================================ */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-bg);
  font-family: var(--font-base);
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, p {
  margin: 0;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
}

h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-5) 0;
}

/* ============================================================
   ROOT LAYOUT
   ============================================================ */
#root {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

/* ============================================================
   PAGE STRUCTURE
   ============================================================ */
main {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.page-header h1 {
  font-size: 20px;
  flex: 1;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
}

/* Auth pages: no page-header, centred column */
.auth-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: var(--space-5) var(--space-4);
}

.auth-main h1 {
  margin-bottom: var(--space-5);
}

.auth-main form {
  width: 100%;
  max-width: 400px;
}

.auth-link {
  display: block;
  margin-top: var(--space-4);
  font-size: 14px;
  color: var(--color-primary);
  text-align: center;
}

/* Back link in inner page headers */
.back-link {
  font-size: 14px;
  color: var(--color-primary);
  text-decoration: none;
  margin-right: auto;
}

.back-link:hover {
  text-decoration: underline;
}

/* ============================================================
   BUTTONS
   ============================================================ */
.btn-primary,
.btn-secondary,
.btn-danger,
.btn-warning {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 500;
  padding: 0 20px;
  cursor: pointer;
  border: 2px solid transparent;
  font-family: var(--font-base);
  transition: filter 0.15s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-danger {
  background: var(--color-danger);
  color: #ffffff;
}

.btn-warning {
  background: var(--color-surface);
  color: var(--color-warning);
  border-color: var(--color-warning);
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-danger:hover,
.btn-warning:hover {
  filter: brightness(0.92);
}

.btn-primary:focus-visible,
.btn-secondary:focus-visible,
.btn-danger:focus-visible,
.btn-warning:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Full-width submit button inside forms */
.btn-submit {
  width: 100%;
  margin-top: var(--space-3);
}

/* Compact variant for card actions */
.btn-compact {
  min-height: 36px;
  font-size: 14px;
  padding: 0 14px;
}

/* Nav buttons in dashboard header */
.btn-nav {
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 14px;
  font-family: var(--font-base);
  cursor: pointer;
  border-radius: var(--radius-sm);
  color: var(--color-primary);
  text-decoration: none;
}

.btn-nav:hover {
  background: var(--color-primary-light);
}

.btn-nav--muted {
  color: var(--color-text-secondary);
}

/* ============================================================
   FORMS
   ============================================================ */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: var(--space-3);
}

.form-group label {
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 16px;
  font-family: var(--font-base);
  color: var(--color-text);
  background: var(--color-surface);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

p[role="alert"] {
  font-size: 14px;
  color: var(--color-danger);
  margin: var(--space-1) 0 0;
}

/* ============================================================
   CARDS
   ============================================================ */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 14px 16px;
  border-left: 4px solid transparent;
}

.card--done {
  opacity: 0.6;
}

.card--overdue {
  border-left-color: var(--color-danger);
  background: var(--color-danger-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.card-time {
  font-size: 14px;
  line-height: 1.4;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.card-patient {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.card-body {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.card-actions {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

/* ============================================================
   PATIENT / MEDICATION LISTS
   ============================================================ */
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.item-list .card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.item-list .card a {
  display: block;
  flex: 1;
  color: var(--color-text);
  font-weight: 500;
  text-decoration: none;
}

.item-list .card a:hover {
  color: var(--color-primary);
}

.item-name {
  flex: 1;
  font-size: 15px;
}

/* ============================================================
   TOAST
   ============================================================ */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-text);
  color: #ffffff;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  max-width: calc(100vw - 32px);
  box-sizing: border-box;
  font-size: 15px;
  z-index: 100;
}

/* ============================================================
   SYNC INDICATOR
   ============================================================ */
.sync-indicator {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-style: italic;
}

/* ============================================================
   DASHBOARD NAV
   ============================================================ */
.dashboard-nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

/* ============================================================
   BUTTON ROW / STACK HELPERS
   ============================================================ */
.btn-row {
  display: flex;
  flex-direction: row;
  gap: var(--space-2);
}

.btn-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
```

- [ ] **Step 2: Clear `src/App.css`**

Replace the entire content of `src/App.css` with a single comment:

```css
/* App-level styles — see index.css for the design system */
```

- [ ] **Step 3: Verify build compiles**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/App.css
git commit -m "style: rewrite index.css with full design system, clear App.css"
```

---

## Task 2: Update `Toast` and `SyncIndicator`

**Files:**
- Modify: `src/components/Toast.tsx`
- Modify: `src/components/SyncIndicator.tsx`

- [ ] **Step 1: Replace inline styles in `Toast.tsx` with `.toast` class**

Keep the existing `useEffect` unchanged. Replace only the `return` statement with:

```tsx
return (
  <div role="alert" className="toast">
    {message}
  </div>
)
```

- [ ] **Step 2: Replace `SyncIndicator.tsx` with styled span**

Replace the entire file content with:

```tsx
export default function SyncIndicator() {
  return <span className="sync-indicator" aria-label="Pending sync">syncing…</span>
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/Toast.tsx src/components/SyncIndicator.tsx
git commit -m "style: replace inline styles in Toast and SyncIndicator with CSS classes"
```

---

## Task 3: Update `ScheduleItem`

**Files:**
- Modify: `src/components/ScheduleItem.tsx`

- [ ] **Step 1: Replace inline styles with CSS classes**

Replace the entire component:

```tsx
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
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ScheduleItem.tsx
git commit -m "style: apply card classes to ScheduleItem, remove inline styles"
```

---

## Task 4: Update form components (`PatientForm`, `MedicationForm`)

**Files:**
- Modify: `src/components/PatientForm.tsx`
- Modify: `src/components/MedicationForm.tsx`

- [ ] **Step 1: Wrap each field in `.form-group` in `PatientForm.tsx`**

Replace the `return` statement in `PatientForm`:

```tsx
return (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="name">Name</label>
      <input id="name" value={name} onChange={e => setName(e.target.value)} required maxLength={200} />
    </div>
    <div className="form-group">
      <label htmlFor="dob">Date of Birth</label>
      <input id="dob" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="notes">Notes</label>
      <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} />
    </div>
    <button type="submit" className="btn-primary btn-submit">{submitLabel}</button>
    {error && <p role="alert">{error}</p>}
  </form>
)
```

- [ ] **Step 2: Wrap each field in `.form-group` in `MedicationForm.tsx`**

Replace the `return` statement in `MedicationForm`:

```tsx
return (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label htmlFor="med-name">Name</label>
      <input id="med-name" value={name} onChange={e => setName(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="dosage">Dosage</label>
      <input id="dosage" value={dosage} onChange={e => setDosage(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="unit">Unit</label>
      <input id="unit" value={unit} onChange={e => setUnit(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="method">Application Method</label>
      <input id="method" value={applicationMethod} onChange={e => setApplicationMethod(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="start">Start Date</label>
      <input id="start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
    </div>
    <div className="form-group">
      <label htmlFor="end">End Date (optional)</label>
      <input id="end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
    </div>
    <div className="form-group">
      <label htmlFor="freq">Frequency (times per day)</label>
      <input id="freq" type="number" min={1} max={24} value={frequency}
        onChange={e => handleFrequencyChange(Number(e.target.value))} />
    </div>
    {times.map((t, i) => (
      <div key={i} className="form-group">
        <label htmlFor={`time-${i}`}>Time {i + 1}</label>
        <input id={`time-${i}`} type="text" placeholder="HH:mm" value={t}
          onChange={e => handleTimeChange(i, e.target.value)} pattern="\d{2}:\d{2}" />
      </div>
    ))}
    <button type="submit" className="btn-primary btn-submit">{submitLabel}</button>
    {error && <p role="alert">{error}</p>}
  </form>
)
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/PatientForm.tsx src/components/MedicationForm.tsx
git commit -m "style: add form-group wrappers to PatientForm and MedicationForm"
```

---

## Task 5: Update auth pages (`LoginPage`, `RegisterPage`)

**Files:**
- Modify: `src/pages/LoginPage.tsx`
- Modify: `src/pages/RegisterPage.tsx`

- [ ] **Step 1: Update `LoginPage.tsx`**

Replace the `return` statement:

```tsx
return (
  <main className="auth-main">
    <h1>Log in</h1>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="btn-primary btn-submit">Log in</button>
    </form>
    <Link to="/register" className="auth-link">Create an account</Link>
    {error && <Toast message={error} onDismiss={() => setError(null)} />}
  </main>
)
```

- [ ] **Step 2: Update `RegisterPage.tsx`**

Replace the `return` statement:

```tsx
return (
  <main className="auth-main">
    <h1>Create account</h1>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
      </div>
      <button type="submit" className="btn-primary btn-submit">Register</button>
    </form>
    <Link to="/login" className="auth-link">Already have an account?</Link>
    {error && <Toast message={error} onDismiss={() => setError(null)} />}
  </main>
)
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/LoginPage.tsx src/pages/RegisterPage.tsx
git commit -m "style: apply auth page layout to LoginPage and RegisterPage"
```

---

## Task 6: Update `DashboardPage`

**Files:**
- Modify: `src/pages/DashboardPage.tsx`

- [ ] **Step 1: Update `DashboardPage.tsx` return statement**

Replace the `return` statement:

```tsx
return (
  <main>
    <header className="page-header">
      <h1>Today's Schedule</h1>
      <nav className="dashboard-nav">
        <Link to="/patients" className="btn-nav">Patients</Link>
        <Link to="/settings" className="btn-nav">Settings</Link>
        <button className="btn-nav btn-nav--muted" onClick={logout}>Log out</button>
      </nav>
    </header>
    <div className="page-content">
      {items.length === 0 && <p>No medications scheduled today.</p>}
      {items.map(item => (
        <ScheduleItemComponent
          key={item.logId}
          item={item}
          pendingSync={pendingSyncIds.has(item.logId)}
          onConfirm={handleConfirm}
          onSkip={handleSkip}
        />
      ))}
    </div>
    {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
  </main>
)
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/DashboardPage.tsx
git commit -m "style: add page-header and page-content layout to DashboardPage"
```

---

## Task 7: Update `PatientsPage`

**Files:**
- Modify: `src/pages/PatientsPage.tsx`

- [ ] **Step 1: Update `PatientsPage.tsx` return statement**

Replace the `return` statement:

```tsx
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
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/PatientsPage.tsx
git commit -m "style: apply layout and card list to PatientsPage"
```

---

## Task 8: Update `PatientDetailPage`

**Files:**
- Modify: `src/pages/PatientDetailPage.tsx`

- [ ] **Step 1: Update `PatientDetailPage.tsx` return statement**

Replace the `if (!patient) return` line and the `return (...)` block:

```tsx
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
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/PatientDetailPage.tsx
git commit -m "style: apply layout and medication list cards to PatientDetailPage"
```

---

## Task 9: Update `MedicationFormPage` and `SettingsPage`

**Files:**
- Modify: `src/pages/MedicationFormPage.tsx`
- Modify: `src/pages/SettingsPage.tsx`

- [ ] **Step 1: Update `MedicationFormPage.tsx` return statement**

Replace the `if (isEdit && !initial) return` line and the `return (...)` block:

```tsx
if (isEdit && !initial) return <p>Loading…</p>

return (
  <main>
    <header className="page-header">
      <Link to={isEdit ? '#' : `/patients/${patientId}`} className="back-link"
        onClick={() => navigate(-1)}>← Back</Link>
      <h1>{isEdit ? 'Edit Medication' : 'New Medication'}</h1>
    </header>
    <div className="page-content">
      <MedicationForm initial={initial} onSubmit={handleSubmit} submitLabel={isEdit ? 'Save' : 'Create'} />
    </div>
  </main>
)
```

- [ ] **Step 2: Update `SettingsPage.tsx` return statement**

Replace the `if (!settings) return` line and the `return (...)` block:

```tsx
if (!settings) return <p>Loading…</p>

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
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/MedicationFormPage.tsx src/pages/SettingsPage.tsx
git commit -m "style: apply layout and form classes to MedicationFormPage and SettingsPage"
```

---

## Done

All 14 files updated. Run `npm run dev` and visually verify each page on a mobile viewport (375px width in DevTools).
