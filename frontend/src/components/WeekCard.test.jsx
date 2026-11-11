// @vitest-environment happy-dom
// The week card on Home: one line per workout, the totals in its subtitle, nothing for an empty week.
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createRoot } from 'react-dom/client'
import WeekCard from './WeekCard.jsx'
import { SPORTS } from '../lib/exercises.js'

const T = new Date('2026-10-26T18:00:00').getTime()
const min = n => n * 60000
const S = {
  unit: 'kg',
  customEx: [{ id: 'c1', n: 'Padel', cat: SPORTS }],
  workouts: [
    { id: 'a', d: '2026-10-26', start: T, end: T + min(65), name: 'Push', entries: [{ id: '0043', sets: [{ w: 60, r: 5, done: true }] }] },
    { id: 'b', d: '2026-10-28', start: T, end: T + min(20), name: 'Padel night', entries: [{ id: 'c1', sets: [{ min: 20, done: true, at: T + min(20) }] }] },
  ],
}

let root, host
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host)
})
afterEach(() => { act(() => root.unmount()); host.remove() })
const render = start => { act(() => root.render(<WeekCard S={S} start={start} />)); return host }

describe('WeekCard', () => {
  it('shows each workout and the week totals', () => {
    const el = render('2026-10-26')
    expect(el.querySelectorAll('.week-card-workout')).toHaveLength(2)
    expect(el.querySelector('.card-head-sub').textContent).toBe('2 workouts · 1h 25m · 1 set')
    expect(el.textContent).toContain('Push')
    expect(el.textContent).toContain('Padel 20 min')
  })
  it('is not there for a week with no workout', () => {
    expect(render('2026-11-02').querySelector('.week-card')).toBeNull()
  })
})
