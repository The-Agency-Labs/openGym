// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import WeekCard from './WeekCard.jsx'
import { SPORTS } from '../lib/exercises.js'
import { DEF } from '../store/useStore.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

const clone = v => JSON.parse(JSON.stringify(v))
const MIN = 60000
const T = new Date(2026, 10, 9, 18, 0).getTime()
let root, host

function show(S, start = '2026-11-09') {
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => { root.render(<WeekCard S={S} start={start} />) })
  return host
}
afterEach(() => { act(() => root?.unmount()); host?.remove(); root = host = null })

describe('WeekCard', () => {
  it('lists both workouts of one day and a dash for a day off', () => {
    const S = clone(DEF)
    S.workouts = [
      { id: 'a', d: '2026-11-09', start: T, end: T + 30 * MIN, name: 'Morning', entries: [] },
      { id: 'b', d: '2026-11-09', start: T + 120 * MIN, end: T + 150 * MIN, name: 'Evening', entries: [] },
    ]
    const el = show(S)
    expect(el.querySelectorAll('.week-card-day')).toHaveLength(7)
    const monday = el.querySelector('[data-day="2026-11-09"]')
    expect([...monday.querySelectorAll('.week-card-workout .tt')].map(x => x.textContent)).toEqual(['Morning', 'Evening'])
    expect(el.querySelector('[data-day="2026-11-10"]').textContent).toContain('–')
    expect(el.textContent).toContain('2 workouts')
  })

  it('says so when the week is empty', () => {
    const el = show(clone(DEF))
    expect(el.textContent).toContain('0 workouts')
    expect(el.textContent).toContain('Nothing logged this week')
  })

  it('shows a Sports entry as time only', () => {
    const S = clone(DEF)
    S.customEx = [{ id: 'c1', n: 'Tennis', custom: true, cat: SPORTS }]
    S.workouts = [{ id: 'a', d: '2026-11-10', start: T, end: T + 60 * MIN, name: 'Match',
      entries: [{ id: 'c1', sets: [{ min: 20, sec: 0, done: true, at: T + 20 * MIN }] }] }]
    const el = show(S)
    const row = el.querySelector('[data-day="2026-11-10"]')
    expect(row.textContent).toContain('Tennis')
    expect(row.textContent).toContain('20 min')
    expect(row.textContent).not.toContain('set')
  })
})
