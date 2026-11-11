// The sums behind the week card on Home: which workouts fall in the week, what a sports entry counts.
import { describe, expect, it } from 'vitest'
import { weekCard } from './week-card.js'
import { SPORTS } from './exercises.js'

const T0 = new Date('2026-11-09T09:00:00').getTime()
const MIN = 60000
const set = (w, r, extra = {}) => ({ w, r, done: true, ...extra })
const S = {
  customEx: [{ id: 'cx1', n: 'Padel', bp: 'cardio', eq: '', custom: true, cat: SPORTS }],
  workouts: [
    { id: 'b', d: '2026-11-09', start: T0 + 5 * 3600000, end: T0 + 5 * 3600000 + 30 * MIN, name: 'Evening', entries: [{ id: 'bench', sets: [set(50, 10)] }] },
    { id: 'a', d: '2026-11-09', start: T0, end: T0 + 45 * MIN, name: 'Push', entries: [
      { id: 'bench', sets: [set(60, 5, { phase: 'warmup' }), set(100, 5), set(100, 4), { w: 100, r: 5, done: false }] },
    ] },
    { id: 'c', d: '2026-11-11', start: T0 + 2 * 86400000, end: T0 + 2 * 86400000 + 20 * MIN, name: 'Padel night', entries: [
      { id: 'cx1', sets: [{ min: 20, sec: 0, done: true }] },
    ] },
    { id: 'out', d: '2026-11-16', start: T0 + 7 * 86400000, end: T0 + 7 * 86400000 + MIN, name: 'Next week', entries: [] },
  ],
}

describe('weekCard', () => {
  const wk = weekCard(S, '2026-11-09')

  it('has seven days from the start, with day numbers', () => {
    expect(wk.days.map(d => d.iso)).toEqual(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'])
    expect(wk.days.map(d => d.day)).toEqual([9, 10, 11, 12, 13, 14, 15])
    expect(wk.days[0].dow).toBe(1)
  })

  it('keeps two workouts of one day as two rows, in the order they began', () => {
    expect(wk.days[0].workouts.map(w => w.id)).toEqual(['a', 'b'])
  })

  it('leaves a day off empty and drops a workout outside the week', () => {
    expect(wk.days[1].workouts).toEqual([])
    expect(wk.days.flatMap(d => d.workouts).map(w => w.id)).toEqual(['a', 'b', 'c'])
  })

  it('counts done work sets only: no warm-up, no unticked set', () => {
    const a = wk.days[0].workouts[0]
    expect(a.sets).toBe(2)
    expect(a.volume).toBe(100 * 5 + 100 * 4)
    expect(a.ms).toBe(45 * MIN)
  })

  it('counts a sports entry as time only, from the minutes typed on its set', () => {
    const c = wk.days[2].workouts[0]
    expect(c.sets).toBe(0)
    expect(c.volume).toBe(0)
    expect(c.sports).toEqual([{ id: 'cx1', name: 'Padel', ms: 20 * MIN }])
  })

  it('totals the week', () => {
    expect(wk.total).toEqual({ workouts: 3, ms: (45 + 30 + 20) * MIN, sets: 3 })
  })

  it('copes with no workouts at all', () => {
    expect(weekCard({}, '2026-11-09').total).toEqual({ workouts: 0, ms: 0, sets: 0 })
  })
})
