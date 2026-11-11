// The week card on Home (components/WeekCard.jsx): every workout of one week, day by day.
// Read-only and derived: nothing here is stored or synced, it only reads S.workouts and S.customEx.
// An exercise of yours marked as Sports (cat === SPORTS, components/SportsSheet.jsx) counts its time
// only, never sets or volume. Its time is what entryTimes (lib/exercise-time.js) credits it from
// the ticks of its sets; a workout logged without tick times falls back to the minutes and seconds
// typed on its sets.
import { entryTimes } from './exercise-time.js'
import { SPORTS } from './exercises.js'
import { isoOf } from './format.js'
import { completedVolumeOf, hasCompletedWork, isWarmupRow } from './workout-model.js'

const num = v => (Number(v) > 0 ? Number(v) : 0)
const typedMs = sets => (sets || []).filter(hasCompletedWork).reduce((ms, s) => ms + num(s?.min) * 60000 + num(s?.sec) * 1000, 0)
const lengthOf = w => (Number(w?.end) > Number(w?.start) ? Number(w.end) - Number(w.start) : 0)

function row(S, w) {
  const times = entryTimes(w)
  const sports = []
  let sets = 0, volume = 0
  ;(w.entries || []).forEach((e, i) => {
    const own = (S.customEx || []).find(c => c && c.id === e?.id)
    if (own?.cat === SPORTS) {
      const ms = times[i] > 0 ? times[i] : typedMs(e.sets)
      sports.push({ id: e.id, name: String(own.n || ''), ms })
      return
    }
    for (const s of e?.sets || []) {
      if (isWarmupRow(s) || !hasCompletedWork(s)) continue
      sets++
      volume += completedVolumeOf(s)
    }
  })
  return { id: w.id, name: w.name || '', ms: lengthOf(w), sets, volume, sports }
}

/**
 * `{ days: [{ iso, dow, day, workouts }], total: { workouts, ms, sets } }` for the seven days from
 * `startISO` ("YYYY-MM-DD"). A day's workouts are in the order they began; two on one day are two rows.
 */
export function weekCard(S, startISO) {
  const first = new Date(startISO + 'T12:00:00')
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(first)
    d.setDate(first.getDate() + i)
    days.push({ iso: isoOf(d), dow: d.getDay(), day: d.getDate(), workouts: [] })
  }
  const byIso = new Map(days.map(d => [d.iso, d]))
  const list = (S?.workouts || []).filter(w => w && byIso.has(w.d))
    .sort((a, b) => (Number(a.start) || 0) - (Number(b.start) || 0))
  for (const w of list) byIso.get(w.d).workouts.push(row(S, w))
  const rows = days.flatMap(d => d.workouts)
  return {
    days,
    total: {
      workouts: rows.length,
      ms: rows.reduce((n, r) => n + r.ms, 0),
      sets: rows.reduce((n, r) => n + r.sets, 0),
    },
  }
}
