// @vitest-environment happy-dom
// The week card on Home: one row per workout under its day, a dash for a day off, the week's totals.
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createRoot } from 'react-dom/client'
import WeekCard from './WeekCard.jsx'
import { SPORTS } from '../lib/exercises.js'

let root, host
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host)
})
afterEach(() => { act(() => root.unmount()); host.remove() })

const MIN = 60000
const T0 = new Date('2026-11-09T09:00:00').getTime()
const S = {
  unit: 'kg',
  customEx: [{ id: 'cx1', n: 'Padel', bp: 'cardio', eq: '', custom: true, cat: SPORTS }],
  workouts: [
    { id: 'a', d: '2026-11-09', start: T0, end: T0 + 45 * MIN, name: 'Push', entries: [{ id: 'bench', sets: [{ w: 100, r: 5, done: true }] }] },
    { id: 'c', d: '2026-11-11', start: T0 + 2 * 86400000, end: T0 + 2 * 86400000 + 20 * MIN, name: 'Padel night', entries: [{ id: 'cx1', sets: [{ min: 20, sec: 0, done: true }] }] },
  ],
}
const days = () => [...host.querySelectorAll('.week-card-day')]

describe('WeekCard', () => {
  it('lists each workout under its day and a dash for a day off', () => {
    act(() => root.render(<WeekCard S={S} start="2026-11-09" />))
    expect(days()).toHaveLength(7)
    const rows = host.querySelectorAll('.week-card-workout')
    expect(rows).toHaveLength(2)
    expect(days()[0].textContent).toContain('Push')
    expect(days()[0].textContent).toContain('45 min')
    expect(days()[1].querySelector('.week-card-workout')).toBeNull()
    expect(days()[1].textContent).toContain('–')
    expect(days()[2].textContent).toContain('Padel night')
    expect(days()[2].textContent).toContain('Padel 20 min')
  })

  it('says what the week came to, and when nothing was logged', () => {
    act(() => root.render(<WeekCard S={S} start="2026-11-09" />))
    expect(host.querySelector('.card-head-sub').textContent).toBe('2 workouts · 1h 5m · 1 set')
    act(() => root.render(<WeekCard S={S} start="2026-11-16" />))
    expect(host.querySelector('.card-head-sub').textContent).toBe('Nothing logged this week')
  })
})
