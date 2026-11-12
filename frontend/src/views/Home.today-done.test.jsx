// @vitest-environment happy-dom
// The Today card lists every workout logged today, not only the last one: each with its start time
// and length, a sport with its own time, and nothing at all on a day with no workout.
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { useStore } from '../store/useStore.js'
import { todayISO } from '../lib/format.js'
import { SPORTS } from '../lib/exercises.js'
import Home from './Home.jsx'

vi.mock('react-router-dom', () => ({ useNavigate: () => () => {} }))
vi.mock('../sheets.jsx', () => ({
  starterPlanSheet: vi.fn(), bwSheet: vi.fn(), goalSheet: vi.fn(), dayOverrideSheet: vi.fn(),
  calendarSheet: vi.fn(), startFlow: vi.fn(), bwDeltaColor: () => '', weighInsSheet: vi.fn(),
}))

const min = n => n * 60000
const noon = new Date(todayISO() + 'T12:00:00').getTime()
const workouts = [
  { id: 'a', d: todayISO(), start: noon - min(300), end: noon - min(300) + min(40), name: 'New routine', entries: [] },
  { id: 'b', d: todayISO(), start: noon, end: noon + min(50), name: 'Incline', entries: [] },
  { id: 'c', d: todayISO(), start: noon + min(120), end: noon + min(180), name: 'Pickleball night', entries: [
    { id: 'c1', sets: [{ min: 55, done: true, at: noon + min(175) }] },
  ] },
]

let host, root
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
})
afterEach(() => { act(() => root.unmount()); host.remove() })

const setS = (over = {}) => useStore.setState(s => ({
  S: { ...s.S, routines: [], dayPlan: {}, workouts: [], active: null, queue: null, rotation: null, scheduleMode: null, week: {}, customEx: [], ...over },
  user: null,
}))
const mount = () => act(() => root.render(<Home />))
const lines = () => [...host.querySelectorAll('.today-done-workout')]

describe('Home: the Today card lists everything done today', () => {
  it('shows every workout, in the order they started, each with its length', () => {
    setS({ workouts }); mount()
    expect(lines().map(l => l.textContent)).toEqual([
      expect.stringContaining('New routine'),
      expect.stringContaining('Incline'),
      expect.stringContaining('Pickleball night'),
    ])
    expect(lines()[0].textContent).toContain('40 min')
    expect(lines()[1].textContent).toContain('50 min')
  })

  it('a sport inside a workout shows its own time', () => {
    setS({ workouts, customEx: [{ id: 'c1', n: 'Pickleball', cat: SPORTS }] }); mount()
    expect(lines()[2].textContent).toContain('Pickleball 55 min')
  })

  it('draws nothing on a day with no workout, and keeps the way to another workout', () => {
    setS(); mount()
    expect(host.querySelector('.today-done')).toBeNull()
    expect([...host.querySelectorAll('button')].some(b => b.textContent.includes('Choose a different workout'))).toBe(true)
  })

  it('keeps the way to another workout when some are done', () => {
    setS({ workouts }); mount()
    expect([...host.querySelectorAll('button')].some(b => b.textContent.includes('Choose a different workout'))).toBe(true)
  })

  it('leaves a workout of another day out', () => {
    setS({ workouts: [{ ...workouts[0], id: 'old', d: '2020-01-01' }] }); mount()
    expect(host.querySelector('.today-done')).toBeNull()
  })
})
