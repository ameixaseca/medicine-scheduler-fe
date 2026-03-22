# CSS Redesign — Design Spec

**Date:** 2026-03-22
**Status:** Approved

## Context

The current `index.css` and `App.css` are unchanged from the Vite + React template. The app has no real styling. This spec defines a CSS design system to replace them, optimised for a mobile caregiver using a smartphone in a care setting.

## Constraints & Decisions

- **Mobile-first:** primary device is a smartphone; max-width `480px` centred on larger screens
- **Light theme only:** no dark mode support
- **Green/white palette:** associated with health and wellbeing
- **Approach:** single global CSS file with CSS custom properties and semantic utility classes — no new dependencies, no CSS Modules, no Tailwind

## Design Tokens (`index.css`)

### Colours

```css
--color-primary:        #2e7d32   /* main green — primary actions */
--color-primary-light:  #e8f5e9   /* light green — backgrounds, badges */
--color-primary-dark:   #1b5e20   /* dark green — hover states */
--color-danger:         #c62828   /* red — overdue, destructive actions */
--color-danger-light:   #ffebee   /* red tint — overdue card background */
--color-warning:        #e65100   /* orange — skip action, warnings */
--color-text:           #1a1a1a   /* primary text */
--color-text-secondary: #555555   /* secondary text, labels */
--color-surface:        #ffffff   /* cards, forms */
--color-bg:             #f4f6f4   /* page background */
--color-border:         #c8d5c8   /* borders */
```

### Spacing (4px scale)

```css
--space-1: 4px   --space-2: 8px   --space-3: 12px
--space-4: 16px  --space-5: 24px  --space-6: 32px
```

### Typography

```css
--font-base: system-ui, 'Segoe UI', Roboto, sans-serif
```

Base body: `16px / 1.5`. Headings:
- `h1`: `24px`, `font-weight: 600`, `margin: 0`, `color: var(--color-text)`
- `h2`: `18px`, `font-weight: 600`, `margin: 0`, `color: var(--color-text)`
- Small/secondary text: `14px / 1.4`, `color: var(--color-text-secondary)`

### Borders & Shadows

```css
--radius-sm: 6px   --radius-md: 10px   --radius-lg: 16px
--shadow-card: 0 1px 3px rgba(0,0,0,0.10)
```

### Dividers

`<hr>`: `border: none; border-top: 1px solid var(--color-border); margin: var(--space-5) 0`

## Layout

### Root & Page

- `body`: `margin: 0`, `background: var(--color-bg)`, `font-family: var(--font-base)`, `font-size: 16px`, `color: var(--color-text)`
- `#root`: `max-width: 480px`, `margin: 0 auto`, `min-height: 100svh`, `display: flex`, `flex-direction: column`

### Page Structure

Every `<main>` uses two child regions:

```
.page-header   — position: sticky, top: 0, z-index: 10
                 background: white, border-bottom: 1px solid --color-border
                 padding: --space-4, display: flex, align-items: center
.page-content  — flex: 1, display: flex, flex-direction: column
                 gap: --space-3, padding: --space-4
```

### Auth Pages (Login / Register)

These pages have no navigation. `.page-header` is not used. The `<main>` has a single centred column: `max-width: 400px`, `margin: auto`, `padding: --space-5 --space-4`. The `<h1>` sits at the top, followed by the `<form>`, then the cross-link (`← Log in` / `Create an account`) as a plain `<a>` styled with `color: --color-primary`, `text-decoration: none`, `font-size: 14px`, centred. No hero image is used.

### Dashboard Header (`.page-header`)

Contains `<h1>` (flex: 1, `font-size: 20px`) on the left and a `<nav>` on the right with three items: "Patients" and "Settings" as `<Link>` elements styled as `.btn-nav` (text-only, `color: --color-primary`, `font-size: 14px`, `padding: 4px 8px`, no border), and "Log out" as a `<button>` with the same `.btn-nav` style but `color: --color-text-secondary`.

### Inner Page Headers (`.page-header`)

Contains a back-link (`← Patients`, `← Dashboard`) as `.back-link` (`color: --color-primary`, `font-size: 14px`, `text-decoration: none`, `margin-right: auto`) and `<h1>` on the right — or stacked vertically if preferred; the key constraint is both stay within `.page-header`.

## Component Styles

### Buttons

Three semantic variants — all share `min-height: 48px`, `border-radius: var(--radius-md)`, `font-size: 16px`, `font-weight: 500`, `padding: 0 20px`, `cursor: pointer`, `border: 2px solid transparent`.

| Class | Background | Text | Border |
|-------|-----------|------|--------|
| `.btn-primary` | `--color-primary` | white | — |
| `.btn-secondary` | white | `--color-primary` | `--color-primary` |
| `.btn-danger` | `--color-danger` | white | — |
| `.btn-warning` | white | `--color-warning` | `--color-warning` |

`.btn-warning` is used for the Skip button in `ScheduleItem`. Do not use an ad-hoc override of `.btn-secondary`.

Hover: `filter: brightness(0.92)` on all variants. Focus-visible: `outline: 3px solid var(--color-primary)`, `outline-offset: 2px`.

### Forms

- `.form-group`: `display: flex`, `flex-direction: column`, `gap: 6px`, `margin-bottom: --space-3`
- `label`: `font-size: 14px`, `font-weight: 500`, `color: --color-text-secondary`
- `input`, `select`, `textarea`: `width: 100%`, `box-sizing: border-box`, `padding: 12px`, `border: 1.5px solid --color-border`, `border-radius: --radius-sm`, `font-size: 16px`, `color: --color-text`, `background: --color-surface`
- `textarea`: additionally `resize: vertical`, `min-height: 80px`
- Focus for all three: `border-color: --color-primary`, `outline: none`, `box-shadow: 0 0 0 3px var(--color-primary-light)`
- Error text (`p[role="alert"]`): `font-size: 14px`, `color: --color-danger`, `margin: --space-1 0 0`
- Submit button: `.btn-primary` + `width: 100%`, `margin-top: --space-3`

Both `PatientForm` (name, dateOfBirth, notes textarea) and `MedicationForm` use this pattern. Wrap each field in `.form-group`.

### ScheduleItem Card

Container `.card`:
- `background: --color-surface`, `border-radius: --radius-md`, `box-shadow: --shadow-card`, `padding: 14px 16px`
- `border-left: 4px solid transparent` (default, keeps layout stable)

Internal structure:

```
.card
  .card-header         — display: flex, justify-content: space-between, align-items: baseline, margin-bottom: 4px
    span.card-time     — font-size: 14px, font-weight: 600, color: --color-text-secondary
    span.card-patient  — font-size: 15px, font-weight: 600, color: --color-text
  .card-body           — font-size: 15px, color: --color-text-secondary, margin-bottom: 10px
  .card-actions        — display: flex, gap: --space-2, align-items: center
    button.btn-primary (compact)
    button.btn-warning (compact)
    SyncIndicator
```

"Compact" buttons inside cards: `min-height: 36px`, `font-size: 14px`, `padding: 0 14px`.

Status variants:
- `taken` or `skipped`: add `.card--done` → `opacity: 0.6`; `.card-actions` not rendered
- Overdue (pending + past scheduled time): add `.card--overdue` → `border-left-color: --color-danger`, `background: --color-danger-light`

### Patient List (PatientsPage)

The patient list uses a plain `<ul>` with `list-style: none`, `padding: 0`, `margin: 0`, `display: flex`, `flex-direction: column`, `gap: --space-2`. Each `<li>` is a `.card` with a single `<Link>` (`display: block`, `color: --color-text`, `font-weight: 500`, `text-decoration: none`).

The "+ Add Patient" toggle button uses `.btn-secondary`. The `PatientForm` appears inline below the button (no modal).

### Medication List (PatientDetailPage)

Each medication row is a `.card`. Internal layout: `display: flex`, `align-items: center`, `gap: --space-3`.

```
.card
  span (medication name + dosage, flex: 1, font-size: 15px)
  a.btn-secondary (compact, "Edit")
  button.btn-danger (compact, "Delete")
```

"Delete" maps to `.btn-danger`. "Edit" maps to `.btn-secondary` compact.

### Toast

```css
position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
background: var(--color-text); color: white;
padding: 12px 24px; border-radius: var(--radius-md);
max-width: calc(100vw - 32px); box-sizing: border-box;
font-size: 15px; z-index: 100;
```

### SyncIndicator

Replace the emoji with a styled `<span>`: `font-size: 12px`, `color: --color-text-secondary`, `font-style: italic`. Text content: `"syncing…"`. No spinner animation.

## Files Touched

| File | Change |
|------|--------|
| `src/index.css` | Full rewrite — tokens, reset, base elements, layout, utility classes |
| `src/App.css` | Clear content (was Vite template only) |
| `src/components/ScheduleItem.tsx` | Replace inline styles with `.card`, `.card-header`, `.card-body`, `.card-actions`, status modifier classes |
| `src/components/Toast.tsx` | Replace inline styles with `.toast` class |
| `src/components/SyncIndicator.tsx` | Replace emoji span with styled "syncing…" span |
| `src/pages/DashboardPage.tsx` | Add `.page-header` with `h1` + nav, `.page-content` wrapper |
| `src/pages/LoginPage.tsx` | Add auth page layout, `.form-group`, `.btn-primary` |
| `src/pages/RegisterPage.tsx` | Same as LoginPage |
| `src/pages/PatientsPage.tsx` | Add `.page-header`, `.page-content`, patient list cards, `.btn-secondary` for toggle |
| `src/pages/PatientDetailPage.tsx` | Add `.page-header`, `.page-content`, medication list cards, `.btn-danger` for delete |
| `src/pages/MedicationFormPage.tsx` | Add `.page-header`, `.page-content`, `.form-group`, `.btn-primary` |
| `src/pages/SettingsPage.tsx` | Add `.page-header`, `.page-content`, `.form-group`, `.btn-primary`/`.btn-secondary` |
| `src/components/PatientForm.tsx` | Add `.form-group` wrappers around each field |
| `src/components/MedicationForm.tsx` | Add `.form-group` wrappers around each field |

## Out of Scope

- Dark mode
- Animations beyond hover transitions
- Any new dependencies
- Icon library
- Modal dialogs (forms remain inline)
