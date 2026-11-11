import { describe, expect, it } from 'vitest'
import { weekCard } from './week-card.js'
import { SPORTS } from './exercises.js'

const T = new Date(2026, 10, 9, 18, 0).getTime()   // Monday 9 Nov 2026, 18:00
const MIN = 60000
const lift = (id, at) => ({ id, sets: [
  { w: 100, r: 5, done: true, at },
  { w: 100, r: 5, done: true, at: at + MIN },
  { w: 60, r: 10, done: true, warmup: true },
  { w: 100, r: 5, done: false },
] })
const workout = (id, d, start, entries, name = 'Push') => ({ id, d, start, end: start + 60 * MIN, name, entries })
const SPORT = { id: 'c1', n: 'Tennis', custom: true, cat: SPORTS }
const dayOf = (wk, iso) => wk.days.find(x => x.iso === iso)

describe('weekCard', () => {
  it('is seven days from the start, with the weekday of each', () => {
    const wk = weekCard({ workouts: [] }, '2026-11-09')
    expect(wk.days.map(x => x.iso)).toEqual(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'])
    expect(wk.days.map(x => x.dow)).toEqual([1, 2, 3, 4, 5, 6, 0])
    expect(wk.total).toEqual({ workouts: 0, ms: 0, sets: 0 })
  })

  it('keeps two workouts on one day as two rows, earliest first, and leaves other weeks out', () => {
    const S = { workouts: [
      workout('b', '2026-11-09', T + 120 * MIN, [lift('0025', T + 130 * MIN)], 'Evening'),
      workout('a', '2026-11-09', T, [lift('0025', T + 10 * MIN)], 'Morning'),
      workout('x', '2026-11-16', T, [lift('0025', T + 10 * MIN)], 'Next week'),
    ] }
    const wk = weekCard(S, '2026-11-09')
    expect(dayOf(wk, '2026-11-09').workouts.map(w => w.name)).toEqual(['Morning', 'Evening'])
    expect(dayOf(wk, '2026-11-10').workouts).toEqual([])
    expect(wk.total.workouts).toBe(2)
  })

  it('counts done work sets and their volume, not warm-ups or rows left undone', () => {
    const wk = weekCard({ workouts: [workout('a', '2026-11-09', T, [lift('0025', T + 10 * MIN)])] }, '2026-11-09')
    const [w] = dayOf(wk, '2026-11-09').workouts
    expect(w.sets).toBe(2)
    expect(w.volume).toBe(1000)
    expect(w.ms).toBe(60 * MIN)
    expect(wk.total).toEqual({ workouts: 1, ms: 60 * MIN, sets: 2 })
  })

  it('reads a Sports exercise as time only, from its tick times', () => {
    const entry = { id: 'c1', sets: [{ w: 50, r: 10, min: 20, sec: 0, done: true, at: T + 20 * MIN }] }
    const S = { customEx: [SPORT], workouts: [workout('a', '2026-11-10', T, [entry], 'Match')] }
    const [w] = dayOf(weekCard(S, '2026-11-09'), '2026-11-10').workouts
    expect(w.sports).toEqual([{ id: 'c1', name: 'Tennis', ms: 20 * MIN }])
    expect(w.sets).toBe(0)
    expect(w.volume).toBe(0)
  })

  it('falls back to the typed length when a Sports row has no tick time', () => {
    const entry = { id: 'c1', sets: [{ min: 45, sec: 30, done: true }] }
    const S = { customEx: [SPORT], workouts: [workout('a', '2026-11-10', T, [entry], 'Match')] }
    const [w] = dayOf(weekCard(S, '2026-11-09'), '2026-11-10').workouts
    expect(w.sports[0].ms).toBe(45 * MIN + 30000)
  })

  it('treats the same exercise as a lift while it is not marked Sports', () => {
    const entry = { id: 'c1', sets: [{ w: 50, r: 10, done: true, at: T + 5 * MIN }] }
    const S = { customEx: [{ ...SPORT, cat: undefined }], workouts: [workout('a', '2026-11-10', T, [entry])] }
    const [w] = dayOf(weekCard(S, '2026-11-09'), '2026-11-10').workouts
    expect(w.sports).toEqual([])
    expect(w.sets).toBe(1)
  })
})
