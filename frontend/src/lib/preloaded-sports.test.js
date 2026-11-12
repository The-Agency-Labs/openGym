// The sports that come with the app: listed, time only, never yours to edit, hidden by your own.
import { describe, expect, it } from 'vitest'
import { PRELOADED_SPORT_NAMES } from './preloaded-sports.js'
import { PRELOADED_SPORTS, SPORTS, allExercises, exerciseOf, isCardio, isCustomEx, isSport } from './exercises.js'
import { defaultConfig, setLabel, modeOf } from './history.js'
import { weekCard } from './week-card.js'

const WANTED = ['pickleball', 'spikeball', 'swimming', 'basketball', 'volleyball', 'tennis', 'badminton', 'soccer', 'hockey', 'golf', 'hiking', 'climbing', 'cycling']
const sportNamed = (list, name) => list.filter(e => e.n.toLowerCase() === name)

describe('preloaded sports', () => {
  it('are the thirteen asked for, each a Sports exercise that is not custom', () => {
    expect(PRELOADED_SPORT_NAMES.map(n => n.toLowerCase()).sort()).toEqual([...WANTED].sort())
    for (const e of PRELOADED_SPORTS) {
      expect(e.cat).toBe(SPORTS)
      expect(isCustomEx(e)).toBe(false)
      expect(isSport(e.id)).toBe(true)
      expect(exerciseOf(e.id)).toBe(e)
    }
    expect(new Set(PRELOADED_SPORTS.map(e => e.id)).size).toBe(13)
  })
  it('are listed once each, with the catalogue swimming stepping aside', () => {
    const all = allExercises({ customEx: [] })
    for (const name of WANTED) expect(sportNamed(all, name)).toHaveLength(1)
    expect(sportNamed(all, 'swimming')[0].cat).toBe(SPORTS)
    expect(exerciseOf('2870').n).toBe('swimming')
  })
  it('give way to an exercise of the same name that you already have', () => {
    const mine = { id: 'c9', n: ' Tennis ', cat: SPORTS, custom: true }
    const all = allExercises({ customEx: [mine] })
    expect(sportNamed(all.map(e => ({ ...e, n: e.n.trim() })), 'tennis')).toHaveLength(1)
    expect(all.find(e => e.id === 'c9')).toBe(mine)
    expect(all.some(e => e.id === 'sport-tennis')).toBe(false)
  })
  it('keep a different exercise of yours, like Volleyball Runs, next to Volleyball', () => {
    const runs = { id: 'c1', n: 'Volleyball Runs', custom: true }
    const all = allExercises({ customEx: [runs] })
    expect(all.some(e => e.id === 'c1')).toBe(true)
    expect(all.some(e => e.id === 'sport-volleyball')).toBe(true)
  })
  it('log time only: cardio mode, no speed', () => {
    expect(isCardio('sport-golf')).toBe(true)
    expect(modeOf({ id: 'sport-golf' })).toBe('cardio')
    expect(defaultConfig('sport-golf')).toMatchObject({ min: 20, speed: 0 })
    expect(defaultConfig('0043').speed).not.toBe(0)
  })
  it('read as minutes, with no speed on the label', () => {
    const label = setLabel('sport-golf', { min: 45, speed: 0 }, { id: 'sport-golf', mode: 'cardio' }, 'kmh')
    expect(label).toContain('45 min')
    expect(label).not.toMatch(/km|mph/)
  })
  it('count on the week card as time, not as lifting', () => {
    const T = new Date('2026-10-26T18:00:00').getTime()
    const S = { customEx: [], workouts: [
      { id: 'a', d: '2026-10-26', start: T, end: T + 1800000, entries: [{ id: 'sport-golf', sets: [{ min: 30, done: true, at: T + 1800000 }] }] },
    ] }
    const card = weekCard(S, '2026-10-26')
    expect(card.days[0].workouts).toHaveLength(1)
    expect(JSON.stringify(card)).toContain('Golf')
  })
})
