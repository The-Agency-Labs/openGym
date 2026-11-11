// The week card's numbers: workouts, time and sets per day; a sport is time only.
import { describe, expect, it } from 'vitest'
import { weekCard } from './week-card.js'
import { SPORTS } from './exercises.js'

const T = new Date('2026-10-26T18:00:00').getTime()
const min = n => n * 60000
const S = {
  customEx: [{ id: 'c1', n: 'Padel', cat: SPORTS }],
  workouts: [
    { id: 'a', d: '2026-10-26', start: T, end: T + min(65), name: 'Push', entries: [
      { id: '0043', sets: [{ w: 60, r: 5, done: true }, { w: 20, r: 10, done: true, warmup: true }, { w: 60, r: 5, done: false }] },
    ] },
    { id: 'b', d: '2026-10-28', start: T, end: T + min(20), name: 'Padel night', entries: [
      { id: 'c1', sets: [{ min: 20, done: true, at: T + min(20) }] },
    ] },
    { id: 'c', d: '2026-11-09', start: T, end: T + min(30), entries: [] },
    { id: 'd', d: '2026-10-27' },
  ],
}

describe('weekCard', () => {
  const card = weekCard(S, '2026-10-26')
  it('has seven days from the start, and the workouts on their day', () => {
    expect(card.days.map(d => d.iso)[0]).toBe('2026-10-26')
    expect(card.days).toHaveLength(7)
    expect(card.days[0].workouts.map(w => w.id)).toEqual(['a'])
    expect(card.days[2].workouts.map(w => w.id)).toEqual(['b'])
  })
  it('counts done work sets only, and their volume', () => {
    expect(card.days[0].workouts[0]).toMatchObject({ sets: 1, volume: 300, ms: min(65) })
  })
  it('a sport is time only', () => {
    const w = card.days[2].workouts[0]
    expect(w.sets).toBe(0)
    expect(w.volume).toBe(0)
    expect(w.sports).toEqual([{ id: 'c1', name: 'Padel', ms: min(20) }])
  })
  it('totals the week, and a workout of another week or with no entries does not break it', () => {
    expect(card.total).toEqual({ workouts: 3, ms: min(85), sets: 1 })
  })
})
